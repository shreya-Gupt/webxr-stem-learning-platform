import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONCEPTS_DATA, SUBJECTS_DATA } from '../../data/conceptsData';
import { 
  Zap, 
  Compass, 
  Waves, 
  Activity, 
  CircleDot, 
  Orbit, 
  Share2,
  FlaskConical,
  Flame,
  Heart,
  Atom,
  Binary,
  Dna,
  Sparkles, 
  ArrowUpRight, 
  ArrowRight,
  Layers,
  Star 
} from 'lucide-react';

const iconMap = {
  Zap,
  Compass,
  Waves,
  Activity,
  CircleDot,
  Orbit,
  Share2,
  FlaskConical,
  Flame,
  Heart,
  Atom,
  Binary,
  Dna
};

export default function ConceptsSection() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categories = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];

  const filtered = selectedFilter === 'All'
    ? CONCEPTS_DATA
    : CONCEPTS_DATA.filter((c) => c.subjectName === selectedFilter || c.subject === selectedFilter.toLowerCase());

  return (
    <section id="concepts" className="relative py-24 bg-[#070B14]">
      {/* Background ambient light */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Subject STEM Curriculum</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Featured STEM Concepts
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
              From quantum wavefunctions and chemical bonding to graph theory and cardiovascular mechanics, explore our full 11-lab STEM curriculum.
            </p>
          </div>

          {/* Subject Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === cat
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((concept, index) => {
            const Icon = iconMap[concept.iconName] || Layers;

            return (
              <div
                key={concept.id}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all duration-300 flex flex-col justify-between group shadow-lg relative overflow-hidden"
              >
                <div>
                  {/* Top: Icon, Subject Tag, Difficulty */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-800/80 text-cyan-400 border border-slate-700/60 group-hover:scale-110 group-hover:border-cyan-500/40 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 uppercase">
                        {concept.subject}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        #{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                    {concept.title}
                  </h3>

                  {/* Formula Preview */}
                  <div className="font-mono text-[11px] text-slate-400 mb-2.5 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800 inline-block truncate max-w-full">
                    {concept.formula}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                    {concept.shortExplanation}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {concept.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    {concept.difficulty}
                  </span>

                  <Link
                    to={concept.route}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Simulate Lab</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to Explore All Subjects */}
        <div className="mt-12 text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 shadow-md transition-all group"
          >
            <span>Browse All 4 STEM Subjects & 11 Simulations</span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
