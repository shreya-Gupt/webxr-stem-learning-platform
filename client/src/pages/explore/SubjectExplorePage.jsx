import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CONCEPTS_DATA, SUBJECTS_DATA } from '../../data/conceptsData';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
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
  Dna,
  Layers
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

const subjectThemeMap = {
  physics: {
    badge: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
    borderHover: 'hover:border-cyan-500/50',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    btnGradient: 'from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500'
  },
  chemistry: {
    badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
    borderHover: 'hover:border-emerald-500/50',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    btnGradient: 'from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500'
  },
  mathematics: {
    badge: 'bg-purple-950/60 text-purple-300 border-purple-500/30',
    borderHover: 'hover:border-purple-500/50',
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    btnGradient: 'from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500'
  },
  biology: {
    badge: 'bg-rose-950/60 text-rose-300 border-rose-500/30',
    borderHover: 'hover:border-rose-500/50',
    iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    btnGradient: 'from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500'
  }
};

export default function SubjectExplorePage() {
  const { subject } = useParams();
  const navigate = useNavigate();

  const currentSubject = SUBJECTS_DATA.find((s) => s.id === subject) || SUBJECTS_DATA[0];
  const subjectConcepts = CONCEPTS_DATA.filter((c) => c.subject === currentSubject.id);
  const theme = subjectThemeMap[currentSubject.id] || subjectThemeMap.physics;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/explore" className="hover:text-cyan-400 transition-colors">Explore</Link>
          <span>/</span>
          <span className="text-white font-medium">{currentSubject.name}</span>
        </div>

        <button
          onClick={() => navigate('/explore')}
          className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Subjects</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono ${theme.badge}`}>
              <span className="text-base">{currentSubject.emoji}</span>
              <span>{currentSubject.name} Curriculum ({subjectConcepts.length} Simulations)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {currentSubject.name} Simulation Labs
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {currentSubject.description}
            </p>
          </div>

          {/* Quick Subject Switcher */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {SUBJECTS_DATA.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(s.route)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  s.id === currentSubject.id
                    ? 'bg-slate-800 text-white border-slate-600 shadow-md'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span>{s.emoji}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjectConcepts.map((concept, index) => {
          const Icon = iconMap[concept.iconName] || Layers;

          return (
            <div
              key={concept.id}
              className={`p-6 rounded-2xl bg-slate-900/60 border border-slate-800 ${theme.borderHover} hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between group shadow-lg relative overflow-hidden`}
            >
              <div>
                {/* Top Row: Icon, Index, Difficulty */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3 rounded-xl border group-hover:scale-110 transition-transform duration-300 ${theme.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      0{index + 1}
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border bg-slate-950 text-cyan-300 border-slate-800">
                      {concept.difficulty}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {concept.title}
                </h3>

                {/* Mathematical Formula Preview */}
                <div className="font-mono text-[11px] text-slate-400 mb-3 bg-slate-950/70 px-2.5 py-1 rounded-md border border-slate-800/80 inline-block">
                  {concept.formula}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {concept.shortExplanation}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {concept.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Enter Simulation & Take Quiz */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate(concept.route)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r ${theme.btnGradient} shadow-md flex items-center justify-center gap-1.5 transition-all`}
                >
                  <span>Enter Simulation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate(`/quiz?topic=${concept.slug}`)}
                  className="py-2 px-3 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/50 transition-colors"
                  title="Take Module Quiz"
                >
                  Quiz
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
