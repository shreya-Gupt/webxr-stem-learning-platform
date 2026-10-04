import React from 'react';
import { Box, Sliders, Bot, Award, Sparkles, ChevronRight, Compass, Gauge } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      title: "3D Simulations",
      subtitle: "Volumetric Physics in WebGL",
      description: "Step directly inside invisible electromagnetic vector fields, atomic lattices, and curved spacetime. Rotate, zoom, and inspect phenomena from any vantage point.",
      icon: Box,
      accent: "cyan",
      badge: "Spatial Engine",
      stat: "60 FPS WebGL",
      highlightClass: "group-hover:border-cyan-500/50 group-hover:shadow-neon-cyan",
      iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    {
      title: "Interactive Experiments",
      subtitle: "Hands-on Parameter Control",
      description: "Manipulate mass, magnetic flux, velocity, and damping coefficients in real time. Observe instantaneous physical cause-and-effect with interactive control panels.",
      icon: Sliders,
      accent: "blue",
      badge: "Virtual Laboratory",
      stat: "Real-time Math",
      highlightClass: "group-hover:border-sky-500/50 group-hover:shadow-lg group-hover:shadow-sky-500/20",
      iconBg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    },
    {
      title: "AI Assistant",
      subtitle: "Context-Aware Companion",
      description: "Powered by Google Gemini to analyze your exact viewport. Ask about projectile trajectories, ionic bonds, Dijkstra pathfinding, or cardiac systole, and receive tailored guidance.",
      icon: Bot,
      accent: "purple",
      badge: "Gemini AI Driven",
      stat: "Instant STEM Q&A",
      highlightClass: "group-hover:border-purple-500/50 group-hover:shadow-neon-purple",
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      title: "Adaptive Quizzes",
      subtitle: "Intuitive Knowledge Checks",
      description: "Move beyond multiple choice. Predict field orientations, manipulate vectors to solve puzzles, and earn mastery badges calibrated to your understanding.",
      icon: Award,
      accent: "emerald",
      badge: "Spatial Mastery",
      stat: "Adaptive Scoring",
      highlightClass: "group-hover:border-emerald-500/50 group-hover:shadow-neon-green",
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  ];

  return (
    <section id="features" className="relative py-24 bg-[#05070D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Deep STEM Mastery
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Every layer of WebXR is built to transform abstract mathematical theories into concrete physical intuition through interactive sensory feedback.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`group p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:bg-slate-900/80 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${item.highlightClass}`}
              >
                {/* Ambient corner flare on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* Top row: Icon and Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-xl border ${item.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono tracking-wide px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5 mb-3 font-mono">
                    {item.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Metric */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">{item.stat}</span>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-medium">
                    Explore <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
