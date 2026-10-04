import React, { useState } from 'react';
import { EyeOff, Eye, BookOpen, Layers, Sparkles, Move3d, AlertCircle, CheckCircle } from 'lucide-react';

export default function ProblemSection() {
  const [activeTab, setActiveTab] = useState('comparison');

  return (
    <section className="relative py-24 bg-[#070B14]/80 border-y border-slate-800/80 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs font-mono text-indigo-300">
            <Layers className="w-3.5 h-3.5" />
            <span>The Spatial Learning Barrier</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Some concepts are meant to be{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              experienced.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            For centuries, dynamic 3D physical phenomena have been squashed into flat 2D textbook drawings and abstract formulas. When spatial and temporal dimensions are lost, true comprehension turns into blind memorization.
          </p>
        </div>

        {/* Comparison Grid: Traditional vs WebXR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: The Traditional Struggle */}
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-red-500/20 hover:border-red-500/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                  <EyeOff className="w-6 h-6" />
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-red-400/80 bg-red-950/30 px-2.5 py-1 rounded border border-red-900/30">
                  Traditional Flat Learning
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                Static Diagrams & Isolated Equations
              </h3>
              
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Students struggle to mentally rotate electromagnetic fields, picture orbital electron clouds, or project wave superposition from static blackboard drawings.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-start gap-2.5 text-slate-400 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>No depth perception for orthogonal 3D vector fields</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-400 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Unable to experiment or vary parameters in real time</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-400 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>High cognitive load memorizing right-hand rules</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>Result: Shallow memorization</span>
              <span className="text-red-400 font-mono">High Drop-out Rate</span>
            </div>
          </div>

          {/* Card 2: The WebXR Solution */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-cyan-500/40 hover:border-cyan-400/60 shadow-xl shadow-cyan-950/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/20">
                  <Move3d className="w-6 h-6 animate-pulse" />
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  The WebXR Paradigm
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                Spatial Manipulation & Real-Time Physics
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Step inside the mathematics. Rotate magnetic flux rings, collide relativistic particles, bend light wavefronts, and directly feel how changes in one variable ripple through the entire system.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-start gap-2.5 text-slate-200 p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>360&deg; interactive orbital control and volumetric field lines</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200 p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Instant visual causality as sliders and values change</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200 p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Active contextual AI assistant answering live questions</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-cyan-900/40 flex items-center justify-between text-xs text-slate-400">
              <span>Result: Deep intuitive mastery</span>
              <span className="text-cyan-400 font-mono font-medium">Empowered Discovery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
