import React, { useState } from 'react';
import { Bot, Sparkles, Send, CornerDownLeft, Lightbulb, CheckCircle2, MessageSquare } from 'lucide-react';

export default function AiTutorSection() {
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  const sampleConversations = [
    {
      question: "Why does moving the magnet faster increase the induced current in Faraday's Law?",
      simulationContext: "Faraday Induction Lab &bull; Flux rate: 4.8 Wb/s",
      response: {
        shortAnswer: "Because induced electromotive force (EMF) is directly proportional to the time rate of change of magnetic flux, not the static strength of the magnet alone.",
        breakdown: [
          "Faraday's Law states: ℰ = -dΦ_B / dt",
          "When you increase velocity (v), the magnetic flux lines pass through the coil's cross-sectional area over a smaller Δt interval.",
          "This higher time derivative (dΦ/dt) generates greater electrical potential across the conductor, driving a larger current (I = ℰ / R)."
        ],
        tip: "Notice the blue particle flow speeding up on your 3D canvas right as the velocity slider increases!"
      }
    },
    {
      question: "What does the negative sign in Lenz's law physically mean?",
      simulationContext: "Faraday Induction Lab &bull; Conservation of Energy Check",
      response: {
        shortAnswer: "The negative sign represents Nature's opposition to flux changes, enforcing the Conservation of Energy.",
        breakdown: [
          "If the induced current supported the flux change instead of opposing it, you would create a perpetual motion machine that generates infinite energy from nothing.",
          "The induced current produces its own magnetic field (B_induced) that resists the incoming magnet, requiring you to do mechanical work to push it forward."
        ],
        tip: "In the 3D lab, watch the red field vectors actively push back against your incoming north pole."
      }
    },
    {
      question: "How does this relate to real-world power generation?",
      simulationContext: "Applied Physics &bull; Hydroelectric & Wind Turbines",
      response: {
        shortAnswer: "This exact principle is the foundation of almost all electrical power grids on Earth.",
        breakdown: [
          "Hydroelectric dams, wind turbines, and steam generators all use kinetic energy to rotate massive copper coils through magnetic fields.",
          "The continuous mechanical rotation produces sinusoidal oscillating flux, generating alternating current (AC) electricity for homes and cities."
        ],
        tip: "Toggle 'AC Generator Mode' in the 3D simulation to see continuous sine wave induction."
      }
    }
  ];

  const currentChat = sampleConversations[activePromptIndex];

  return (
    <section id="ai-tutor" className="relative py-24 bg-[#070B14] border-t border-slate-800/80 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-purple-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Explanatory Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Contextual Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Meet your AI learning{' '}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                companion.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Never get stuck on abstract theory again. While you interact with any 3D simulation, your AI assistant actively tracks the exact parameters on your screen.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Simulation-Aware Guidance</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ask questions about the exact phenomenon you are observing. The AI interprets your active slider values and 3D camera angle.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 mt-1">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Intuition Before Formulas</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Explanations build conceptual understanding first, followed by clear step-by-step mathematical proofs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Socratic Dialogue</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    The assistant guides you with targeted questions so you discover the physical principles yourself.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive AI Assistant Terminal Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl shadow-purple-950/20 overflow-hidden flex flex-col">
              {/* Terminal Window Bar */}
              <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    WebXR Gemini STEM Assistant
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Context Active
                  </span>
                </div>
              </div>

              {/* Sample Prompt Selector Tabs */}
              <div className="p-3 bg-slate-950/50 border-b border-slate-800 flex flex-wrap gap-2">
                <span className="text-[11px] text-slate-400 font-mono self-center px-1">
                  Ask Assistant:
                </span>
                {sampleConversations.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePromptIndex(i)}
                    className={`text-xs px-3 py-1 rounded-lg transition-all ${
                      activePromptIndex === i
                        ? 'bg-purple-600 text-white font-medium shadow-sm'
                        : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    Question {i + 1}
                  </button>
                ))}
              </div>

              {/* Chat Messages Body */}
              <div className="p-6 space-y-5 text-xs sm:text-sm">
                {/* Active Context Tag */}
                <div className="text-center">
                  <span className="font-mono text-[11px] text-cyan-400 bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-800/40">
                    Live Lab Context: {currentChat.simulationContext}
                  </span>
                </div>

                {/* Student Query Bubble */}
                <div className="flex items-start justify-end gap-3">
                  <div className="max-w-md p-3.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">
                    <p className="font-medium text-xs sm:text-sm">{currentChat.question}</p>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    You
                  </div>
                </div>

                {/* AI Tutor Response Bubble */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-cyan-500 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="space-y-3 max-w-lg p-4 rounded-2xl rounded-tl-sm bg-slate-950/80 border border-slate-800 text-slate-300">
                    <p className="font-medium text-slate-100 leading-relaxed">
                      {currentChat.response.shortAnswer}
                    </p>

                    <div className="space-y-1.5 pl-3 border-l-2 border-purple-500/40 font-mono text-xs text-slate-300">
                      {currentChat.response.breakdown.map((item, idx) => (
                        <p key={idx} className="leading-relaxed">&bull; {item}</p>
                      ))}
                    </div>

                    <div className="pt-2 flex items-start gap-2 text-cyan-300 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-800/30 text-xs">
                      <Sparkles className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                      <span>{currentChat.response.tip}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input Bar Preview */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    readOnly
                    value="Ask anything about the simulation on your screen..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-400 focus:outline-none cursor-default"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500">
                    Gemini 1.5 Pro
                  </span>
                </div>
                <button className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
