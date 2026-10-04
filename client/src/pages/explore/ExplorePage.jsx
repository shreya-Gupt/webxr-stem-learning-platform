import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONCEPTS_DATA, SUBJECTS_DATA } from '../../data/conceptsData';
import { 
  Orbit, 
  Zap, 
  Waves, 
  Activity, 
  Share2, 
  CircleDot, 
  Compass,
  FlaskConical,
  Flame,
  Heart,
  Atom,
  Binary,
  Dna,
  ArrowRight, 
  Sparkles,
  Layers,
  Award
} from 'lucide-react';

const iconMap = {
  Orbit,
  Zap,
  Waves,
  Activity,
  CircleDot,
  Share2,
  Compass,
  FlaskConical,
  Flame,
  Heart,
  Atom,
  Binary,
  Dna
};

const subjectColorConfig = {
  physics: {
    borderHover: 'hover:border-cyan-500/60',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    btnGradient: 'from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500',
    glow: 'from-cyan-500/10'
  },
  chemistry: {
    borderHover: 'hover:border-emerald-500/60',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    btnGradient: 'from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500',
    glow: 'from-emerald-500/10'
  },
  mathematics: {
    borderHover: 'hover:border-purple-500/60',
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    btnGradient: 'from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500',
    glow: 'from-purple-500/10'
  },
  biology: {
    borderHover: 'hover:border-rose-500/60',
    iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    btnGradient: 'from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500',
    glow: 'from-rose-500/10'
  }
};

export default function ExplorePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'physics' | 'chemistry' | 'mathematics' | 'biology'

  const filteredConcepts = activeTab === 'all'
    ? CONCEPTS_DATA
    : CONCEPTS_DATA.filter((c) => c.subject === activeTab);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive STEM Curriculum</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore STEM Disciplines
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Select a subject category below to dive into interactive 3D simulations, real-time physics calculations, and self-testing quizzes.
        </p>
      </div>

      {/* ================= FOUR MAIN SUBJECT CARDS ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Core Disciplines</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">4 Main Subjects</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBJECTS_DATA.map((subject) => {
            const config = subjectColorConfig[subject.id] || subjectColorConfig.physics;

            return (
              <div
                key={subject.id}
                className={`p-6 rounded-3xl bg-slate-900/70 border border-slate-800 ${config.borderHover} hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between group shadow-xl relative overflow-hidden`}
              >
                {/* Subtle corner glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${config.glow} to-transparent pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                <div>
                  {/* Top: Emoji Icon & Simulation Count */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl p-3 rounded-2xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform duration-300">
                      {subject.emoji}
                    </div>

                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                      {subject.simCount} Labs
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {subject.name.toUpperCase()}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                    {subject.description}
                  </p>
                </div>

                {/* Explore Subject Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => navigate(subject.route)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${config.btnGradient} shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg transition-all`}
                  >
                    <span>Explore Subject</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= ALL 11 SIMULATIONS DIRECTORY ================= */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>All Interactive Labs ({CONCEPTS_DATA.length} Available)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Filter by discipline or launch any simulation directly.</p>
          </div>

          {/* Subject Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All (11)
            </button>
            {SUBJECTS_DATA.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === s.id
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{s.emoji}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Simulation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcepts.map((concept, index) => {
            const Icon = iconMap[concept.iconName] || Layers;
            const config = subjectColorConfig[concept.subject] || subjectColorConfig.physics;

            return (
              <div
                key={concept.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-cyan-950/30 relative overflow-hidden"
              >
                <div>
                  {/* Top Row: Icon, Index, Subject Tag, Difficulty */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border group-hover:scale-110 transition-transform duration-300 ${config.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 uppercase">
                        {concept.subject}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">
                        #{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                    {concept.title}
                  </h3>

                  {/* Formula Preview */}
                  <div className="font-mono text-[11px] text-slate-400 mb-2.5 bg-slate-950/70 px-2.5 py-1 rounded-md border border-slate-800/80 inline-block">
                    {concept.formula}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                    {concept.shortExplanation}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {concept.tags.slice(0, 3).map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate(concept.route)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md flex items-center justify-center gap-1.5 transition-all group-hover:shadow-cyan-500/20"
                  >
                    <span>Enter Simulation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => navigate(`/quiz?topic=${concept.slug}`)}
                    className="py-2 px-3 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/50 transition-colors flex items-center gap-1"
                    title="Take Module Quiz"
                  >
                    <Award className="w-3 h-3 text-purple-400" />
                    <span>Quiz</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
