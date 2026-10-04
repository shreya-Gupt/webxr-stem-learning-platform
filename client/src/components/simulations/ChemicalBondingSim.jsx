import React, { useState } from 'react';
import { 
  FlaskConical, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Atom, 
  Layers, 
  Zap, 
  Flame, 
  CheckCircle2 
} from 'lucide-react';

// Atomic Data
const ATOMS_CONFIG = {
  H: { name: 'Hydrogen', symbol: 'H', z: 1, valence: 1, shells: [1], color: '#E2E8F0', radius: 24, electronegativity: 2.20 },
  C: { name: 'Carbon', symbol: 'C', z: 6, valence: 4, shells: [2, 4], color: '#64748B', radius: 36, electronegativity: 2.55 },
  O: { name: 'Oxygen', symbol: 'O', z: 8, valence: 6, shells: [2, 6], color: '#EF4444', radius: 34, electronegativity: 3.44 },
  Na: { name: 'Sodium', symbol: 'Na', z: 11, valence: 1, shells: [2, 8, 1], color: '#A855F7', radius: 44, electronegativity: 0.93 },
  Cl: { name: 'Chlorine', symbol: 'Cl', z: 17, valence: 7, shells: [2, 8, 7], color: '#10B981', radius: 42, electronegativity: 3.16 },
};

export default function ChemicalBondingSim({ onQuizClick }) {
  const [bondType, setBondType] = useState('ionic'); // 'ionic' | 'covalent'
  const [selectedMolecule, setSelectedMolecule] = useState('NaCl'); // 'NaCl' | 'H2O' | 'O2' | 'CH4'
  const [isBonded, setIsBonded] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0); // 0 = separated, 1 = bonded

  const handleToggleBond = () => {
    setIsBonded(!isBonded);
  };

  const handleMoleculeSelect = (mol) => {
    setSelectedMolecule(mol);
    if (mol === 'NaCl') {
      setBondType('ionic');
    } else {
      setBondType('covalent');
    }
    setIsBonded(false);
  };

  const handleReset = () => {
    setIsBonded(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Preset Buttons */}
      <div className="flex flex-wrap items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Target Molecule:</span>
          <button
            onClick={() => handleMoleculeSelect('NaCl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedMolecule === 'NaCl'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Ionic: NaCl (Table Salt)
          </button>
          <button
            onClick={() => handleMoleculeSelect('H2O')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedMolecule === 'H2O'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Covalent: H₂O (Water)
          </button>
          <button
            onClick={() => handleMoleculeSelect('O2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedMolecule === 'O2'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Double Covalent: O₂ (Oxygen)
          </button>
          <button
            onClick={() => handleMoleculeSelect('CH4')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedMolecule === 'CH4'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Covalent: CH₄ (Methane)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleBond}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5 ${
              isBonded
                ? 'bg-rose-600 hover:bg-rose-500'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isBonded ? 'Break Bond' : 'Form Chemical Bond'}</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Atomic Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 2D Interactive Shell Visualizer */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full h-[440px] rounded-2xl overflow-hidden bg-[#070A12] border border-slate-800 shadow-2xl flex items-center justify-center p-4">
            {/* SVG Visualizer for Atom Electron Shells */}
            <svg className="w-full h-full" viewBox="0 0 640 400">
              <defs>
                <radialGradient id="glow-cyan" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="glow-purple" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Rendering for NaCl Ionic Bonding */}
              {selectedMolecule === 'NaCl' && (
                <g>
                  {/* Sodium (Na) Atom */}
                  <g transform={`translate(${isBonded ? 230 : 160}, 200)`} className="transition-transform duration-700">
                    {/* Concentric Bohr Shells */}
                    <circle r="40" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <circle r="65" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    {!isBonded && <circle r="90" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 4" />}

                    {/* Na Nucleus */}
                    <circle r="26" fill="#A855F7" className="drop-shadow-lg" />
                    <text textAnchor="middle" y="5" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="monospace">
                      {isBonded ? 'Na⁺' : 'Na'}
                    </text>

                    {/* Valence Electron (transferred when bonded) */}
                    {!isBonded && (
                      <g transform="translate(90, 0)">
                        <circle r="5" fill="#00F0FF" className="animate-pulse" />
                      </g>
                    )}
                  </g>

                  {/* Electron Transfer Arrow or Transferred Electron */}
                  {isBonded && (
                    <g transform="translate(325, 200)" className="animate-pulse">
                      <circle r="6" fill="#00F0FF" />
                      <line x1="-30" y1="0" x2="30" y2="0" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 2" />
                    </g>
                  )}

                  {/* Chlorine (Cl) Atom */}
                  <g transform={`translate(${isBonded ? 410 : 480}, 200)`} className="transition-transform duration-700">
                    <circle r="40" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <circle r="65" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <circle r="90" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />

                    {/* Cl Nucleus */}
                    <circle r="28" fill="#10B981" className="drop-shadow-lg" />
                    <text textAnchor="middle" y="5" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="monospace">
                      {isBonded ? 'Cl⁻' : 'Cl'}
                    </text>

                    {/* Cl 7 Valence Electrons (8 when bonded) */}
                    {[0, 45, 90, 135, 180, 225, 270, ...(isBonded ? [315] : [])].map((ang, i) => {
                      const rad = (ang * Math.PI) / 180;
                      const ex = Math.cos(rad) * 90;
                      const ey = Math.sin(rad) * 90;
                      return <circle key={i} cx={ex} cy={ey} r="5" fill={i === 7 ? '#00F0FF' : '#34D399'} />;
                    })}
                  </g>

                  {/* Ionic Bond Attraction Bracket */}
                  {isBonded && (
                    <g>
                      <rect x="180" y="70" width="280" height="260" rx="16" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
                      <text x="320" y="350" textAnchor="middle" fill="#C084FC" fontSize="12" fontFamily="monospace">
                        Ionic Electrostatic Attraction: [Na]⁺ [ :Cl: ]⁻
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* Rendering for H2O Covalent Bonding */}
              {selectedMolecule === 'H2O' && (
                <g>
                  {/* Central Oxygen (O) */}
                  <g transform="translate(320, 190)">
                    <circle r="55" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 4" />
                    <circle r="32" fill="#EF4444" />
                    <text textAnchor="middle" y="5" fill="#FFFFFF" fontSize="16" fontWeight="bold" fontFamily="monospace">O</text>

                    {/* Unshared Lone Pairs */}
                    <circle cx="0" cy="-55" r="5" fill="#F87171" />
                    <circle cx="-15" cy="-55" r="5" fill="#F87171" />
                    <circle cx="0" cy="55" r="5" fill="#F87171" />
                    <circle cx="-15" cy="55" r="5" fill="#F87171" />
                  </g>

                  {/* Left Hydrogen (H) */}
                  <g transform={`translate(${isBonded ? 230 : 140}, ${isBonded ? 250 : 250})`} className="transition-transform duration-700">
                    <circle r="40" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" />
                    <circle r="20" fill="#38BDF8" />
                    <text textAnchor="middle" y="5" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace">H</text>

                    {/* Shared Pair when bonded */}
                    {isBonded && (
                      <g transform="translate(45, -25)">
                        <circle cx="0" cy="-6" r="4.5" fill="#00F0FF" />
                        <circle cx="0" cy="6" r="4.5" fill="#F87171" />
                      </g>
                    )}
                  </g>

                  {/* Right Hydrogen (H) */}
                  <g transform={`translate(${isBonded ? 410 : 500}, ${isBonded ? 250 : 250})`} className="transition-transform duration-700">
                    <circle r="40" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" />
                    <circle r="20" fill="#38BDF8" />
                    <text textAnchor="middle" y="5" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace">H</text>

                    {/* Shared Pair when bonded */}
                    {isBonded && (
                      <g transform="translate(-45, -25)">
                        <circle cx="0" cy="-6" r="4.5" fill="#00F0FF" />
                        <circle cx="0" cy="6" r="4.5" fill="#F87171" />
                      </g>
                    )}
                  </g>

                  {isBonded && (
                    <text x="320" y="340" textAnchor="middle" fill="#38BDF8" fontSize="12" fontFamily="monospace">
                      Bent Geometry (~104.5°) | 2 Shared Covalent Pairs (O-H)
                    </text>
                  )}
                </g>
              )}

              {/* Rendering for O2 Double Covalent Bonding */}
              {selectedMolecule === 'O2' && (
                <g>
                  {/* Left Oxygen */}
                  <g transform={`translate(${isBonded ? 250 : 180}, 200)`} className="transition-transform duration-700">
                    <circle r="60" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 4" />
                    <circle r="30" fill="#EF4444" />
                    <text textAnchor="middle" y="5" fill="#FFFFFF" fontSize="15" fontWeight="bold" fontFamily="monospace">O</text>
                  </g>

                  {/* Right Oxygen */}
                  <g transform={`translate(${isBonded ? 390 : 460}, 200)`} className="transition-transform duration-700">
                    <circle r="60" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 4" />
                    <circle r="30" fill="#EF4444" />
                    <text textAnchor="middle" y="5" fill="#FFFFFF" fontSize="15" fontWeight="bold" fontFamily="monospace">O</text>
                  </g>

                  {/* Shared 4 Electrons (Double Bond: O=O) */}
                  {isBonded && (
                    <g transform="translate(320, 200)">
                      <circle cx="-6" cy="-18" r="5" fill="#00F0FF" />
                      <circle cx="6" cy="-18" r="5" fill="#F87171" />
                      <circle cx="-6" cy="18" r="5" fill="#00F0FF" />
                      <circle cx="6" cy="18" r="5" fill="#F87171" />
                      <text x="0" y="140" textAnchor="middle" fill="#EF4444" fontSize="12" fontFamily="monospace">
                        Double Covalent Bond (O = O) | 4 Shared Electrons
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* Rendering for CH4 Covalent Bonding */}
              {selectedMolecule === 'CH4' && (
                <g transform="translate(320, 200)">
                  {/* Central Carbon */}
                  <circle r="50" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />
                  <circle r="28" fill="#475569" />
                  <text textAnchor="middle" y="5" fill="#FFFFFF" fontSize="14" fontWeight="bold" fontFamily="monospace">C</text>

                  {/* 4 Hydrogens (Top, Bottom, Left, Right) */}
                  {[
                    { x: 0, y: isBonded ? -85 : -140, label: 'H' },
                    { x: 0, y: isBonded ? 85 : 140, label: 'H' },
                    { x: isBonded ? -85 : -140, y: 0, label: 'H' },
                    { x: isBonded ? 85 : 140, y: 0, label: 'H' },
                  ].map((pos, i) => (
                    <g key={i} transform={`translate(${pos.x}, ${pos.y})`} className="transition-transform duration-700">
                      <circle r="18" fill="#38BDF8" />
                      <text textAnchor="middle" y="4" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                        {pos.label}
                      </text>
                    </g>
                  ))}

                  {isBonded && (
                    <text x="0" y="150" textAnchor="middle" fill="#38BDF8" fontSize="12" fontFamily="monospace">
                      Tetrahedral Geometry (109.5°) | 4 Single Covalent C-H Bonds
                    </text>
                  )}
                </g>
              )}
            </svg>

            {/* Status Floating Pill */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-mono">
              <span className={`w-2.5 h-2.5 rounded-full ${isBonded ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-white">
                {isBonded ? `Stable Bond Formed (${selectedMolecule})` : 'Unbonded Reactant Atoms'}
              </span>
            </div>
          </div>

          {/* Telemetry & Thermodynamic Energy Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Bond Classification</p>
              <p className="text-cyan-300 font-bold text-base mt-1">
                {bondType === 'ionic' ? 'Ionic Electrostatic' : 'Covalent Shared'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {bondType === 'ionic' ? 'ΔEN = 2.23 (> 2.0)' : 'ΔEN < 1.7'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Valence Shell Status</p>
              <p className="text-emerald-400 font-bold text-base mt-1">
                {isBonded ? 'Complete Octet (8e⁻)' : 'Incomplete Shells'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {isBonded ? 'Noble Gas Configuration' : 'Reactive State'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Bond Energy Release</p>
              <p className="text-purple-300 font-bold text-base mt-1">
                {isBonded
                  ? selectedMolecule === 'NaCl' ? '-411 kJ/mol' : selectedMolecule === 'H2O' ? '-464 kJ/mol' : selectedMolecule === 'O2' ? '-498 kJ/mol' : '-414 kJ/mol'
                  : '0 kJ/mol'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Exothermic Formation</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Potential Energy (E)</p>
              <p className={`font-bold text-base mt-1 ${isBonded ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isBonded ? 'Minimum (Stable)' : 'High (Repulsive/Free)'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Lennard-Jones Well</p>
            </div>
          </div>
        </div>

        {/* Right: Lewis Structure & Atom Details Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Atom className="w-4 h-4 text-cyan-400" />
              <span>Lewis & Molecular Specs</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">{selectedMolecule}</span>
          </div>

          {/* Lewis Dot Representation Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
            <p className="text-[10px] text-slate-400 uppercase font-mono">Lewis Dot Formula</p>
            <div className="font-mono text-xl text-white font-bold tracking-widest py-2">
              {selectedMolecule === 'NaCl' && (isBonded ? '[Na]⁺ [:Cl: ]⁻' : 'Na·  +  ·Cl:::')}
              {selectedMolecule === 'H2O' && (isBonded ? 'H : Ö : H' : 'H·  +  ·Ö:  +  ·H')}
              {selectedMolecule === 'O2' && (isBonded ? ':Ö :: Ö:' : ':Ö·  +  ·Ö:')}
              {selectedMolecule === 'CH4' && (isBonded ? 'H₃C - H' : '·C·  +  4 H·')}
            </div>
            <p className="text-[11px] text-slate-400">
              {bondType === 'ionic'
                ? 'Electron transfer yields stable closed outer valence shell.'
                : 'Shared electron pairs complete octets for all bonded atoms.'}
            </p>
          </div>

          {/* Atomic Properties Table */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-white">Constituent Elements</p>
            <div className="space-y-1.5 text-xs font-mono">
              {selectedMolecule === 'NaCl' && (
                <>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-purple-300">Sodium (Na)</span>
                    <span className="text-slate-400">Z=11 | Valence: 1e⁻ | EN: 0.93</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-emerald-300">Chlorine (Cl)</span>
                    <span className="text-slate-400">Z=17 | Valence: 7e⁻ | EN: 3.16</span>
                  </div>
                </>
              )}
              {selectedMolecule === 'H2O' && (
                <>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-cyan-300">Hydrogen (H)</span>
                    <span className="text-slate-400">Z=1 | Valence: 1e⁻ | EN: 2.20</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-rose-300">Oxygen (O)</span>
                    <span className="text-slate-400">Z=8 | Valence: 6e⁻ | EN: 3.44</span>
                  </div>
                </>
              )}
              {selectedMolecule === 'O2' && (
                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-rose-300">Oxygen (O) × 2</span>
                  <span className="text-slate-400">Z=8 | Valence: 6e⁻ | EN: 3.44</span>
                </div>
              )}
              {selectedMolecule === 'CH4' && (
                <>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-slate-300">Carbon (C)</span>
                    <span className="text-slate-400">Z=6 | Valence: 4e⁻ | EN: 2.55</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-cyan-300">Hydrogen (H) × 4</span>
                    <span className="text-slate-400">Z=1 | Valence: 1e⁻ | EN: 2.20</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Energy Diagram Explanation */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs space-y-1.5">
            <p className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Thermodynamic Stabilization
            </p>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              When atoms approach each other and form a bond, the attractive potential energy drops into a deep energy well, releasing exothermic heat. Energy must be put in to break the bond.
            </p>
          </div>
        </div>
      </div>

      {/* Educational Explanation & Governing Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Ionic vs Covalent Bonding Mechanism
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The nature of a chemical bond is determined by the <strong>electronegativity difference (ΔEN)</strong> between the bonding atoms:
          </p>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800 space-y-1">
            <p>Ionic (ΔEN &gt; 2.0): Complete electron transfer creates cation (+) and anion (-).</p>
            <p className="text-slate-400">Polar Covalent (0.4 &lt; ΔEN &lt; 2.0): Unequal electron sharing (e.g. H₂O).</p>
            <p className="text-slate-400">Non-polar Covalent (ΔEN &lt; 0.4): Equal electron sharing (e.g. O₂, CH₄).</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            The Octet Rule & Stability
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Main-group elements react to achieve a stable electronic configuration matching noble gases with 8 valence electrons (ns² np⁶), or a duet (2 electrons, 1s²) in the case of Hydrogen.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bond formation lowers the total potential energy of the molecular system, satisfying the first and second laws of thermodynamics.
          </p>
        </div>
      </div>

      {/* Action CTA: Take Concept Quiz */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/40">
        <div>
          <h4 className="text-sm font-bold text-white">Mastered ionic and covalent molecular bonds?</h4>
          <p className="text-xs text-slate-400">Complete the 5-question Chemical Bonding quiz to test your molecular knowledge.</p>
        </div>
        <button
          onClick={onQuizClick}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
        >
          <span>Take Concept Quiz (5 Questions)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
