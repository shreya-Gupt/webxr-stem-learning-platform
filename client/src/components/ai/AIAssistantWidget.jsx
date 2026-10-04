import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CONCEPTS_DATA } from '../../data/conceptsData';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Minimize2,
  CornerDownLeft,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Quick-prompt suggestions per simulation slug
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_PROMPTS = {
  'projectile-circular-motion': [
    'Why does increasing the launch angle affect the range?',
    'What is centripetal acceleration in circular motion?',
    'Why is flight time inversely proportional to gravity?',
  ],
  'electric-magnetic-fields': [
    'Why does moving the magnet faster induce more voltage?',
    'Explain Lenz\'s Law and the negative sign.',
    'What is the shape of magnetic field lines around a wire?',
  ],
  'wave-functions-pes': [
    'What does the probability density |ψ(x)|² mean?',
    'How does quantum tunneling occur across a barrier?',
    'Why are energy levels quantized in a potential well?',
  ],
  'oscillation-resonance': [
    'Why does amplitude surge when driving frequency matches natural frequency?',
    'How does damping affect the resonance curve?',
    'What is the Quality Factor (Q)?',
  ],
  'collision': [
    'Why is total momentum always conserved in collisions?',
    'What does the coefficient of restitution (e) represent?',
    'Where does lost kinetic energy go in inelastic collisions?',
  ],
  'graph-theory': [
    "What is Dijkstra's algorithm and how does it find shortest path?",
    'What is the difference between BFS and DFS?',
    'What is an Eulerian path in a graph?',
  ],
  'vectors-3d': [
    'What does the dot product A · B tell us geometrically?',
    'How is the cross product A × B calculated?',
    'Why does swapping vectors in a cross product negate the result?',
  ],
  'chemical-bonding': [
    'Why does NaCl form an ionic bond instead of covalent?',
    'Why is water (H₂O) a polar covalent molecule?',
    'What is the Octet Rule and why are 8 electrons stable?',
  ],
  'chemical-energy': [
    'What is activation energy (E_a)?',
    'How does a catalyst speed up a reaction without shifting ΔH?',
    'What is the difference between exothermic and endothermic reactions?',
  ],
  'muscle-movement': [
    'Why are biceps and triceps called antagonistic muscle pairs?',
    'How do muscles cause movement across the elbow joint?',
    'What is the Sliding Filament Theory?',
  ],
  heart: [
    'What happens during ventricular contraction (systole)?',
    'Why is the left ventricle wall thicker than the right?',
    'How does blood flow through the 4 chambers of the heart?',
  ],
};

const DEFAULT_PROMPTS = [
  'How do 3D simulations aid scientific understanding?',
  'Where should I begin exploring WebXR?',
  'Explain the four STEM subject disciplines.',
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const messagesEndRef = useRef(null);

  // ── Detect active simulation from URL (/lab/<slug>) ──────────────────────
  const currentSlug = location.pathname.startsWith('/lab/')
    ? location.pathname.replace('/lab/', '')
    : null;

  const currentConcept = CONCEPTS_DATA.find((c) => c.slug === currentSlug) || null;
  const currentTopic = currentConcept ? currentConcept.title : 'WebXR STEM Platform';
  const currentSubject = currentConcept ? (currentConcept.subjectName || currentConcept.subject || 'General STEM') : 'General STEM';

  // ── State ─────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi! I'm WebXR AI. Need help understanding any scientific concept, simulation parameter, or equation?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Track the slug at the time of the last reset so we can detect simulation changes
  const lastSlugRef = useRef(currentSlug);

  // ── Reset conversation when the user navigates to a different simulation ──
  useEffect(() => {
    if (currentSlug !== lastSlugRef.current) {
      lastSlugRef.current = currentSlug;
      const greeting = currentConcept
        ? `Hi! I'm WebXR AI. We're now exploring **${currentConcept.title}** (${currentSubject}). What would you like to know about this simulation?`
        : "Hi! I'm WebXR AI. Need help understanding any scientific concept, simulation parameter, or equation?";
      setMessages([{ id: Date.now(), sender: 'bot', text: greeting }]);
    }
  }, [currentSlug, currentConcept, currentSubject]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // ── Quick prompts ─────────────────────────────────────────────────────────
  const quickPrompts =
    currentSlug && TOPIC_PROMPTS[currentSlug]
      ? TOPIC_PROMPTS[currentSlug]
      : DEFAULT_PROMPTS;

  // ── Send message handler ──────────────────────────────────────────────────
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      // Build the history we send to the backend — exclude the very last bot
      // greeting message (index 0) and the current user question (last item)
      // so the backend sees a clean alternating conversation.
      const historyForBackend = updatedMessages.slice(0, -1); // exclude the just-added user msg

      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          concept: currentTopic,
          subject: currentSubject,
          slug: currentSlug || '',
          // Pass simulation parameters if they are available on the concept object
          params: currentConcept?.defaultParams || {},
          // Send prior conversation so Gemini has context for follow-ups
          history: historyForBackend,
        }),
      });

      const data = await response.json();

      if (response.ok && data.answer) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', text: data.answer },
        ]);
      } else {
        // Backend returned an error object
        const errMsg =
          data.error ||
          'AI assistant is temporarily unavailable. Please try again.';
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', text: errMsg, isError: true },
        ]);
      }
    } catch (networkErr) {
      // Network failure — server not running or no internet
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: '⚠️ Backend server is not running.\n\nTo activate the AI assistant:\n1. Open a terminal\n2. Run: cd webXR/server\n3. Add your Gemini API key to server/.env\n4. Run: npm run dev\n\nOr from the webXR root folder, run: npm run dev (starts both servers at once).',
          isError: false,
          isSetup: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // ── Keyboard handler ──────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* ── Collapsed: floating bot button ─────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 text-white shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border border-cyan-300/40"
          aria-label="Open AI Learning Companion"
        >
          {/* Online pulse dot */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#05070D] rounded-full animate-pulse" />
          <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />

          {/* Hover tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900/90 text-[11px] text-slate-200 border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            AI STEM Assistant
          </span>
        </button>
      )}

      {/* ── Expanded: floating chat window ─────────────────────────────── */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[500px] bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">

          {/* Top Header */}
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  WebXR AI Assistant
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </h4>
                <p className="text-[10px] font-mono text-cyan-400 truncate max-w-[200px]">
                  Topic: {currentTopic}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Concept Prompts Strip */}
          <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="text-[10px] font-mono text-slate-400 uppercase shrink-0">Ask:</span>
            {quickPrompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isTyping}
                className="text-[10px] px-2 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-[12px] leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-none shadow-sm'
                      : msg.isSetup
                      ? 'bg-amber-950/60 border border-amber-700/60 text-amber-200 rounded-tl-none font-mono'
                      : msg.isError
                      ? 'bg-red-950/60 border border-red-800/60 text-red-300 rounded-tl-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-[11px] font-mono">
                <div className="w-5 h-5 rounded-md bg-cyan-950 text-cyan-400 flex items-center justify-center">
                  <Bot className="w-3 h-3 animate-spin" />
                </div>
                <span>Analyzing with Gemini AI...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about ${currentTopic}...`}
                disabled={isTyping}
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-60"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[9px] text-slate-600 mt-1.5 text-center">
              Powered by Google Gemini · <CornerDownLeft className="inline w-2.5 h-2.5" /> Enter to send
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
