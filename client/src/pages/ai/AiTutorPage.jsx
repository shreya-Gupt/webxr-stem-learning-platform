import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Send, ArrowRight, CornerDownLeft } from 'lucide-react';
import { CONCEPTS_DATA } from '../../data/conceptsData';
import { Link } from 'react-router-dom';

export default function AiTutorPage() {
  const [selectedConcept, setSelectedConcept] = useState(CONCEPTS_DATA[0]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const makeGreeting = (concept) =>
    `Hello! I am your WebXR STEM AI assistant, powered by Google Gemini. I'm currently focused on **${concept.title}**. Ask me anything — definitions, formulas, real-world applications, or how to interpret the simulation!`;

  const [chat, setChat] = useState([
    { id: 1, sender: 'bot', text: makeGreeting(CONCEPTS_DATA[0]) },
  ]);

  // Reset conversation when the user switches concept
  const handleConceptChange = (slug) => {
    const found = CONCEPTS_DATA.find((c) => c.slug === slug);
    if (!found) return;
    setSelectedConcept(found);
    setChat([{ id: Date.now(), sender: 'bot', text: makeGreeting(found) }]);
    setInput('');
  };

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    const updatedChat = [...chat, userMsg];
    setChat(updatedChat);
    setInput('');
    setIsTyping(true);

    try {
      // Send history (excluding the freshly-added user message) so Gemini
      // has full conversation context for follow-up questions.
      const historyForBackend = updatedChat.slice(0, -1);

      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          concept: selectedConcept.title,
          subject: selectedConcept.subjectName || selectedConcept.subject || 'STEM',
          slug: selectedConcept.slug,
          params: selectedConcept.defaultParams || {},
          history: historyForBackend,
        }),
      });

      const data = await response.json();

      if (response.ok && data.answer) {
        setChat((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'bot', text: data.answer },
        ]);
      } else {
        setChat((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: data.error || 'AI assistant is temporarily unavailable. Please try again.',
            isError: true,
          },
        ]);
      }
    } catch {
      setChat((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Could not reach the AI service. Make sure the WebXR backend server is running (npm run dev inside /server).',
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSend(e);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300">
          <Bot className="w-3.5 h-3.5 text-purple-400" />
          <span>Multimodal STEM Intelligence · Powered by Google Gemini</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Learning Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Deep-dive into any concept with context-aware dialogue powered by Google Gemini.
          Switch concepts on the left to change the AI's focus.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Concept Selector & Theory */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase font-mono">
              Active Subject Focus
            </h3>
            <select
              value={selectedConcept.slug}
              onChange={(e) => handleConceptChange(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {CONCEPTS_DATA.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                <span>{selectedConcept.law}</span>
                <span>{selectedConcept.difficulty}</span>
              </div>
              <p className="font-mono text-white text-xs font-bold">{selectedConcept.formula}</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {selectedConcept.shortExplanation}
              </p>
            </div>

            <Link
              to={selectedConcept.route}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-white text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Launch {selectedConcept.title} Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Col: Interactive Conversation */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-bold text-white">Gemini STEM Assistant Session</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live · {selectedConcept.title}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
            {chat.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-4 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-sm'
                      : m.isError
                      ? 'bg-red-950/60 border border-red-800/60 text-red-300 rounded-tl-sm'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-[11px] font-mono">
                <div className="w-5 h-5 rounded-md bg-purple-950 text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 animate-spin" />
                </div>
                <span>Gemini is thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="pt-4 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask anything about ${selectedConcept.title}...`}
              disabled={isTyping}
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <p className="text-[9px] text-slate-600 mt-1.5 text-center">
            <CornerDownLeft className="inline w-2.5 h-2.5" /> Enter to send · Gemini AI · API key required in server/.env
          </p>
        </div>
      </div>
    </div>
  );
}
