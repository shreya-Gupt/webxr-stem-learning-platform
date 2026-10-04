import { askGemini } from '../services/geminiService.js';

/**
 * POST /api/ai/ask
 *
 * Body:
 * {
 *   question : string        — the student's question (required)
 *   concept  : string        — active simulation name (optional)
 *   subject  : string        — active subject (optional)
 *   slug     : string        — URL slug of active simulation (optional)
 *   params   : object        — active simulation parameter values (optional)
 *   history  : Array<{sender,text}> — prior conversation messages (optional)
 * }
 *
 * Response:
 * { answer: string }   on success
 * { error:  string }   on failure
 */
export async function askAI(req, res) {
  const { question, concept, subject, slug, params, history } = req.body;

  // ── Validate ────────────────────────────────────────────────────────────────
  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ error: 'A non-empty question is required.' });
  }

  // ── Call Gemini ─────────────────────────────────────────────────────────────
  try {
    const answer = await askGemini({
      question: question.trim(),
      concept:  concept  || 'General STEM',
      subject:  subject  || 'General STEM',
      params:   params   || {},
      history:  Array.isArray(history) ? history : [],
    });

    return res.status(200).json({ answer });

  } catch (err) {
    // Log in development so the developer can see the actual error
    if (process.env.NODE_ENV !== 'production') {
      console.error('[AI Controller] Gemini error:', err.message);
    }

    // Classify the error and return a clear message to the frontend
    let clientMessage = 'AI assistant is temporarily unavailable. Please try again.';

    if (err.message.includes('GEMINI_API_KEY is not configured')) {
      clientMessage = 'AI assistant is not yet configured. Please add your GEMINI_API_KEY to server/.env and restart the server.';
    } else if (err.message.includes('API_KEY_INVALID') || err.message.includes('invalid')) {
      clientMessage = 'AI assistant has an invalid API key. Please check your GEMINI_API_KEY in server/.env.';
    } else if (err.message.includes('quota') || err.message.includes('RESOURCE_EXHAUSTED')) {
      clientMessage = 'AI assistant has reached its rate limit. Please try again in a moment.';
    } else if (err.message.includes('network') || err.code === 'ECONNREFUSED') {
      clientMessage = 'Network error connecting to the AI service. Please check your internet connection.';
    }

    return res.status(503).json({ error: clientMessage });
  }
}
