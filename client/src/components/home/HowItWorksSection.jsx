import React from 'react';
import { Compass, Sliders, MessageSquareCode, Award, LineChart, ChevronRight, Sparkles } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Explore',
      subtitle: '3D Spatial Immersion',
      description: 'Select a STEM concept and enter the volumetric 3D laboratory. Rotate and inspect the phenomenon from all angles.',
      icon: Compass,
      accent: 'cyan',
      badge: 'Step 1',
    },
    {
      step: '02',
      title: 'Experiment',
      subtitle: 'Hands-on Parameter Tuning',
      description: 'Vary live physical variables (current, velocity, mass, flux) and observe dynamic causal feedback in real-time.',
      icon: Sliders,
      accent: 'blue',
      badge: 'Step 2',
    },
    {
      step: '03',
      title: 'Ask AI',
      subtitle: 'Context-Aware Assistant',
      description: 'Stuck on an equation or concept? Ask your Gemini-powered AI assistant about the specific phenomenon on your screen.',
      icon: MessageSquareCode,
      accent: 'purple',
      badge: 'Step 3',
    },
    {
      step: '04',
      title: 'Take Quiz',
      subtitle: 'Adaptive Knowledge Check',
      description: 'Solve interactive spatial challenges, predict field directions, and test intuitive understanding without rote memorization.',
      icon: Award,
      accent: 'emerald',
      badge: 'Step 4',
    },
    {
      step: '05',
      title: 'Track Progress',
      subtitle: 'Continuous Mastery',
      description: 'Review your mastery analytics, identify knowledge gaps, and unlock advanced multi-variable simulations.',
      icon: LineChart,
      accent: 'amber',
      badge: 'Step 5',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 bg-[#05070D] border-t border-slate-800/80 overflow-hidden">
      {/* Background illumination line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none hidden lg:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Learning Pipeline</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            A structured 5-step experiential learning loop designed to take you from initial curiosity to rock-solid conceptual mastery.
          </p>
        </div>

        {/* Step Progression Ribbon / Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all duration-300 flex flex-col justify-between relative group"
              >
                {/* Arrow connector indicator between cards on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 items-center justify-center text-cyan-400 shadow-md">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}

                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/60">
                      {item.step}
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-800/80 text-slate-200 group-hover:text-cyan-400 group-hover:scale-110 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-mono text-cyan-400/80 mb-3">
                    {item.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Progress Dot */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400/60 group-hover:bg-cyan-400 group-hover:animate-ping transition-all"></span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Linear summary badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-5 py-2.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-400 font-mono">
            <span className="text-cyan-400 font-bold">Explore</span>
            <span>&rarr;</span>
            <span className="text-sky-400 font-bold">Experiment</span>
            <span>&rarr;</span>
            <span className="text-purple-400 font-bold">Ask AI</span>
            <span>&rarr;</span>
            <span className="text-emerald-400 font-bold">Take Quiz</span>
            <span>&rarr;</span>
            <span className="text-amber-400 font-bold">Track Progress</span>
          </div>
        </div>
      </div>
    </section>
  );
}
