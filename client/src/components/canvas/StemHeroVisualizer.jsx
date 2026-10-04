import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Orbit, 
  Atom, 
  FlaskConical, 
  Binary, 
  Dna, 
  Heart, 
  Share2, 
  Compass, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const PREVIEWS = [
  {
    id: 'physics',
    subject: 'Physics',
    emoji: '⚛️',
    color: '#00F0FF',
    accentBorder: 'border-cyan-500/40',
    accentText: 'text-cyan-400',
    title: 'Kinematics & Field Dynamics',
    route: '/lab/projectile-circular-motion',
    formula: 'R = (v₀² sin 2θ) / g  |  ℰ = -N(dΦ/dt)',
    description: '3D Projectile Trajectories & Electromagnetic Flux',
    renderVisual: () => (
      <svg className="w-full h-full" viewBox="0 0 400 240">
        <defs>
          <linearGradient id="traj-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[60, 120, 180].map((y) => (
          <line key={y} x1="30" y1={y} x2="370" y2={y} stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
        ))}
        {/* Ground */}
        <line x1="30" y1="200" x2="370" y2="200" stroke="#334155" strokeWidth="2" />
        {/* Parabolic Trajectory Path */}
        <path d="M 50 200 Q 200 40 350 200" fill="none" stroke="url(#traj-grad)" strokeWidth="3.5" />
        {/* Trajectory Guide Dots */}
        {[0.2, 0.4, 0.6, 0.8].map((t, idx) => {
          const x = 50 + (350 - 50) * t;
          const y = (1 - t) * (1 - t) * 200 + 2 * (1 - t) * t * 40 + t * t * 200;
          return <circle key={idx} cx={x} cy={y} r="3" fill="#38BDF8" opacity="0.6" />;
        })}
        {/* Projectile Sphere at Peak */}
        <circle cx="200" cy="80" r="8" fill="#00F0FF" className="animate-pulse" />
        {/* Velocity Vector Arrow */}
        <line x1="200" y1="80" x2="250" y2="60" stroke="#00F0FF" strokeWidth="2" />
        <polygon points="250,56 256,60 250,64" fill="#00F0FF" />
        {/* Range Label */}
        <text x="200" y="220" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="monospace">
          Maximum Range R = 45.2 m (Launch θ = 45°)
        </text>
      </svg>
    )
  },
  {
    id: 'chemistry',
    subject: 'Chemistry',
    emoji: '🧪',
    color: '#10B981',
    accentBorder: 'border-emerald-500/40',
    accentText: 'text-emerald-400',
    title: 'Chemical Bonding & Reaction Energy',
    route: '/lab/chemical-bonding',
    formula: 'ΔEN = |EN_A - EN_B|  |  Octet Rule',
    description: 'Valence Electron Transfer & Covalent Sharing',
    renderVisual: () => (
      <svg className="w-full h-full" viewBox="0 0 400 240">
        {/* Na Atom Shells */}
        <g transform="translate(140, 120)">
          <circle r="30" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <circle r="50" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle r="20" fill="#A855F7" />
          <text textAnchor="middle" y="4" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">Na⁺</text>
        </g>
        {/* Transferred Electron moving */}
        <g transform="translate(200, 120)">
          <circle r="5" fill="#00F0FF" className="animate-pulse" />
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#00F0FF" strokeWidth="2" strokeDasharray="3 3" />
        </g>
        {/* Cl Atom Shells */}
        <g transform="translate(260, 120)">
          <circle r="30" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <circle r="50" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle r="22" fill="#10B981" />
          <text textAnchor="middle" y="4" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">Cl⁻</text>
          {/* Valence electron dots */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => {
            const rad = (ang * Math.PI) / 180;
            return <circle key={i} cx={Math.cos(rad) * 50} cy={Math.sin(rad) * 50} r="4" fill={i === 7 ? '#00F0FF' : '#34D399'} />;
          })}
        </g>
        <text x="200" y="210" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
          Ionic Electrostatic Bond: [Na]⁺ [:Cl:]⁻
        </text>
      </svg>
    )
  },
  {
    id: 'mathematics',
    subject: 'Mathematics',
    emoji: '📐',
    color: '#A855F7',
    accentBorder: 'border-purple-500/40',
    accentText: 'text-purple-400',
    title: 'Graph Theory & 3D Vectors',
    route: '/lab/graph-theory',
    formula: 'G = (V, E)  |  A · B = |A||B| cos θ',
    description: 'Dijkstra Pathfinding & Euclidean Vector Spaces',
    renderVisual: () => (
      <svg className="w-full h-full" viewBox="0 0 400 240">
        {/* Graph Edges */}
        <line x1="80" y1="120" x2="160" y2="60" stroke="#A855F7" strokeWidth="3" />
        <line x1="80" y1="120" x2="160" y2="180" stroke="#334155" strokeWidth="2" />
        <line x1="160" y1="60" x2="240" y2="60" stroke="#A855F7" strokeWidth="3" />
        <line x1="160" y1="60" x2="240" y2="180" stroke="#334155" strokeWidth="2" />
        <line x1="160" y1="180" x2="240" y2="180" stroke="#334155" strokeWidth="2" />
        <line x1="240" y1="60" x2="320" y2="120" stroke="#A855F7" strokeWidth="3" />
        <line x1="240" y1="180" x2="320" y2="120" stroke="#334155" strokeWidth="2" />
        {/* Nodes */}
        {[
          { x: 80, y: 120, label: 'A', fill: '#064E3B', stroke: '#10B981' },
          { x: 160, y: 60, label: 'B', fill: '#3B0764', stroke: '#A855F7' },
          { x: 160, y: 180, label: 'C', fill: '#0F172A', stroke: '#475569' },
          { x: 240, y: 60, label: 'D', fill: '#3B0764', stroke: '#A855F7' },
          { x: 240, y: 180, label: 'E', fill: '#0F172A', stroke: '#475569' },
          { x: 320, y: 120, label: 'F', fill: '#881337', stroke: '#F43F5E' },
        ].map((n, i) => (
          <g key={i} transform={`translate(${n.x}, ${n.y})`}>
            <circle r="16" fill={n.fill} stroke={n.stroke} strokeWidth="2.5" />
            <text textAnchor="middle" y="4" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">{n.label}</text>
          </g>
        ))}
        <text x="200" y="215" textAnchor="middle" fill="#A855F7" fontSize="10" fontFamily="monospace">
          Dijkstra Shortest Path: A → B → D → F (Cost: 11)
        </text>
      </svg>
    )
  },
  {
    id: 'biology',
    subject: 'Biology',
    emoji: '🧬',
    color: '#F43F5E',
    accentBorder: 'border-rose-500/40',
    accentText: 'text-rose-400',
    title: 'Cardiovascular & Musculoskeletal Mechanics',
    route: '/lab/heart',
    formula: 'CO = HR · SV  |  Cardiac Cycle (Systole & Diastole)',
    description: '4-Chamber Heart Cycle & Antagonistic Arm Movement',
    renderVisual: () => (
      <svg className="w-full h-full" viewBox="0 0 400 240">
        {/* Septum */}
        <line x1="200" y1="50" x2="200" y2="180" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        {/* Right Atrium (Blue) */}
        <ellipse cx="150" cy="80" rx="35" ry="28" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="2" />
        <text x="150" y="84" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">Right Atrium</text>
        {/* Right Ventricle */}
        <path d="M 120 115 C 110 160, 130 180, 150 185 C 170 180, 190 160, 180 115 Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
        <text x="150" y="145" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">Right Ventricle</text>
        {/* Left Atrium (Red) */}
        <ellipse cx="250" cy="80" rx="35" ry="28" fill="#991B1B" stroke="#F87171" strokeWidth="2" />
        <text x="250" y="84" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">Left Atrium</text>
        {/* Left Ventricle (Thick myocardium) */}
        <path d="M 220 115 C 210 165, 230 185, 250 190 C 270 185, 290 165, 280 115 Z" fill="#EF4444" stroke="#F87171" strokeWidth="4" />
        <text x="250" y="145" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">Left Ventricle</text>
        {/* ECG pulse waveform preview at bottom */}
        <path d="M 80 215 L 170 215 L 180 200 L 190 230 L 200 195 L 210 220 L 220 215 L 320 215" fill="none" stroke="#10B981" strokeWidth="2" />
        <circle cx="200" cy="195" r="3" fill="#00F0FF" className="animate-ping" />
      </svg>
    )
  }
];

export default function StemHeroVisualizer() {
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-cycle through the 4 STEM subjects every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % PREVIEWS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = PREVIEWS[activeIdx];

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Subject Tab Selectors */}
      <div className="flex items-center justify-between gap-1.5 p-1.5 mb-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        {PREVIEWS.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setActiveIdx(idx)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeIdx === idx
                ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{item.emoji}</span>
            <span className="hidden sm:inline">{item.subject}</span>
          </button>
        ))}
      </div>

      {/* Visualizer Frame */}
      <div className={`relative h-[320px] rounded-3xl overflow-hidden bg-[#070A12] border ${current.accentBorder} shadow-2xl transition-all duration-500 p-4 flex flex-col justify-between group`}>
        {/* Top Header of Active Subject */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">{current.emoji}</span>
            <div>
              <p className={`text-xs font-bold font-mono uppercase tracking-wider ${current.accentText}`}>
                {current.subject} Discipline
              </p>
              <h4 className="text-sm font-bold text-white leading-tight">
                {current.title}
              </h4>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            Live Preview
          </span>
        </div>

        {/* Central Graphic Area */}
        <div className="flex-1 flex items-center justify-center relative my-1">
          {current.renderVisual()}
        </div>

        {/* Bottom Annotation & Quick Navigation Button */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 z-10 text-xs">
          <div className="font-mono text-[10px] text-slate-400 truncate max-w-[240px]">
            {current.formula}
          </div>

          <Link
            to={current.route}
            className="flex items-center gap-1 text-xs font-semibold text-white hover:text-cyan-300 transition-colors bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-cyan-400 shadow-sm"
          >
            <span>Launch Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
