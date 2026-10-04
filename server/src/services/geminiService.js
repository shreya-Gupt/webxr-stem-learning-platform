import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini AI service for the WebXR STEM Learning Assistant.
 *
 * Responsible for:
 *  - Initialising the Gemini client once per process.
 *  - Building the STEM-contextualised system instruction.
 *  - Converting the frontend conversation history to Gemini's format.
 *  - Calling the Gemini API and returning a plain-text answer.
 */

const SYSTEM_INSTRUCTION = `You are the WebXR STEM Learning Assistant.

You help students understand difficult scientific, mathematical, and biological concepts through the interactive 3D simulations available on the WebXR platform.

Guidelines:
- Answer in simple, student-friendly language suited to high-school or early college level.
- Use the current simulation context (subject, simulation name, active parameters) when it is provided — it tells you exactly what the student can see on screen.
- Never invent simulation results or fabricate data.
- Explain concepts step-by-step when that helps understanding; keep answers concise for simple factual questions.
- When a follow-up question references "it", "that", or "the value", infer from the conversation history what "it" refers to.
- You are a learning assistant, not a replacement for a teacher. Encourage curiosity and exploration.
- Format responses in plain text (no markdown headings or bullet lists unless it genuinely helps readability).`;

let genAI = null;
let model = null;

function getModel() {
  if (model) return model;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured in server/.env');
  }

  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  return model;
}

/**
 * Build a context-enriched prompt that prepends simulation state to the
 * user's raw question so Gemini always knows which simulation is active.
 *
 * @param {string} question        - The raw question the student typed.
 * @param {string} concept         - Human-readable concept/simulation name.
 * @param {string} subject         - Subject (Physics, Chemistry, Mathematics, Biology).
 * @param {Object} params          - Active simulation parameters object (optional).
 * @returns {string}
 */
function buildContextualPrompt(question, concept, subject, params) {
  const lines = [];

  if (subject && subject !== 'General STEM') {
    lines.push(`CURRENT SUBJECT: ${subject}`);
  }
  if (concept && concept !== 'General STEM') {
    lines.push(`CURRENT SIMULATION: ${concept}`);
  }
  if (params && typeof params === 'object' && Object.keys(params).length > 0) {
    const paramStr = Object.entries(params)
      .map(([k, v]) => `  ${k} = ${v}`)
      .join('\n');
    lines.push(`ACTIVE SIMULATION PARAMETERS:\n${paramStr}`);
  }

  lines.push(`STUDENT QUESTION: ${question}`);

  return lines.join('\n');
}

/**
 * Convert the frontend message array to Gemini's `contents` format.
 * The frontend sends: [{ sender: 'user'|'bot', text: '...' }, ...]
 *
 * @param {Array} history  - Previous messages (excluding the current question).
 * @returns {Array}         - Gemini-formatted history.
 */
function buildHistory(history = []) {
  const geminiHistory = [];

  for (const msg of history) {
    if (!msg || !msg.text) continue;
    const role = msg.sender === 'user' ? 'user' : 'model';
    // Merge consecutive messages of the same role (Gemini requires alternating)
    const last = geminiHistory[geminiHistory.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += '\n' + msg.text;
    } else {
      geminiHistory.push({ role, parts: [{ text: msg.text }] });
    }
  }

  return geminiHistory;
}

/**
 * Main entry-point for the AI controller.
 *
 * @param {string} question   - Student's question.
 * @param {string} concept    - Active simulation name.
 * @param {string} subject    - Active subject.
 * @param {Object} params     - Active simulation parameters.
 * @param {Array}  history    - Prior conversation messages.
 * @returns {Promise<string>} - AI answer text.
 */
export async function askGemini({ question, concept, subject, params, history }) {
  const geminiModel = getModel();

  const contextualPrompt = buildContextualPrompt(question, concept, subject, params);
  const geminiHistory = buildHistory(history);

  const chat = geminiModel.startChat({ history: geminiHistory });
  const result = await chat.sendMessage(contextualPrompt);
  const response = result.response;

  const text = response.text();
  if (!text || text.trim() === '') {
    throw new Error('Gemini returned an empty response.');
  }

  return text.trim();
}
