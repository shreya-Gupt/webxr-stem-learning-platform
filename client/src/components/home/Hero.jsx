import React from 'react';
import { Link } from 'react-router-dom';
import StemHeroVisualizer from '../canvas/StemHeroVisualizer';
import { ArrowRight, Compass, FlaskConical, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-36 md:pb-24 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-48 right-10 w-[400px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtitle, CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Tag / Category Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-medium text-cyan-300 shadow-sm shadow-cyan-900/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Multi-Disciplinary STEM Visualization Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-white">
              See What You{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent underline decoration-cyan-500/30 decoration-wavy decoration-2">
                Can't See.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Interactive 3D learning for the concepts that are hardest to visualize.
              Bridge the gap between abstract mathematical formulas and intuitive spatial understanding.
            </p>

            {/* Action Buttons: Real navigation to /explore and /experiments */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/explore"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <Compass className="w-4 h-4 text-cyan-100 group-hover:rotate-45 transition-transform" />
                <span>Explore the Lab</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/experiments"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FlaskConical className="w-4 h-4 text-cyan-400" />
                <span>Try an Experiment</span>
              </Link>
            </div>

            {/* Corrected Homepage Statistics: 4 STEM Subjects, 11 Simulations, AI Assistant */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-white">4</p>
                <p className="text-[11px] text-slate-400 font-medium">STEM Subjects</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">11</p>
                <p className="text-[11px] text-slate-400 font-medium">Interactive Simulations</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-indigo-400">AI</p>
                <p className="text-[11px] text-slate-400 font-medium">Context-Aware Assistant</p>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Subject STEM Visualizer */}
          <div className="lg:col-span-6 relative">
            <StemHeroVisualizer />
          </div>
        </div>
      </div>
    </section>
  );
}
