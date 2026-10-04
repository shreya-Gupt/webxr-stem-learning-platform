import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass, ShieldCheck, Laptop, Cpu } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="relative py-28 bg-[#05070D] overflow-hidden">
      {/* Centered intense glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-950/40">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Next-Generation STEM Education</span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
          Ready to experience STEM{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            differently?
          </span>
        </h2>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
          Stop staring at motionless 2D diagrams. Step into the virtual laboratory, control physical parameters in real time, and develop spatial intuition that lasts.
        </p>

        {/* Primary CTA Button: Functional React Router Link to /explore */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/explore"
            className="group relative px-9 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700 pointer-events-none" />
            <Compass className="w-5 h-5 text-cyan-100 group-hover:rotate-90 transition-transform duration-500" />
            <span>Enter WebXR Lab</span>
            <ArrowRight className="w-5 h-5 text-cyan-200 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Trust Highlights */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-cyan-400" />
            <span>Runs directly in modern browsers</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>WebGL 2.0 accelerated</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>12 Core STEM Modules</span>
          </div>
        </div>
      </div>
    </section>
  );
}
