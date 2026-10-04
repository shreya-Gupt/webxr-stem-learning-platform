import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const REACTIONS = {
  combustion: {
    name: 'Methane Combustion (Exothermic)',
    equation: 'CH₄ + 2 O₂  →  CO₂ + 2 H₂O',
    type: 'exothermic',
    eReactants: 60,
    eProducts: 20,
    baseEa: 40,
    deltaH: -890, // kJ/mol
    description: 'Combustion releases vast thermal energy as strong C=O and O-H bonds form in products.'
  },
  decomposition: {
    name: 'Thermal Decomposition of CaCO₃ (Endothermic)',
    equation: 'CaCO₃ (s)  →  CaO (s) + CO₂ (g)',
    type: 'endothermic',
    eReactants: 30,
    eProducts: 70,
    baseEa: 55,
    deltaH: +178, // kJ/mol
    description: 'Absorbs net heat from surrounding furnace to break strong ionic crystal carbonate bonds.'
  },
  photosynthesis: {
    name: 'Photosynthesis (Endothermic)',
    equation: '6 CO₂ + 6 H₂O + Photons  →  C₆H₁₂O₆ + 6 O₂',
    type: 'endothermic',
    eReactants: 25,
    eProducts: 85,
    baseEa: 70,
    deltaH: +2803, // kJ/mol
    description: 'Solar photons provide the activation and thermodynamic driving energy to synthesize glucose.'
  }
};

export default function ChemicalEnergySim({ onQuizClick }) {
  const [selectedKey, setSelectedKey] = useState('combustion');
  const [temperature, setTemperature] = useState(300); // Kelvin (250 to 600)
  const [hasCatalyst, setHasCatalyst] = useState(false);
  const [progress, setProgress] = useState(0); // 0 (Reactants) to 100 (Products)
  const [isRunning, setIsRunning] = useState(false);

  const reaction = REACTIONS[selectedKey];

  // Activation energy reduced by catalyst
  const effectiveEa = hasCatalyst ? Math.round(reaction.baseEa * 0.6) : reaction.baseEa;
  const peakEnergy = reaction.eReactants + effectiveEa;

  // Arrhenius rate calculation: k ~ A * exp(-Ea / (R * T))
  const R = 8.314; // J/(mol*K)
  const arrheniusFraction = useMemo(() => {
    const exponent = -(effectiveEa * 1000) / (R * temperature);
    return Math.min(100, Math.max(0.1, Math.exp(exponent / 2) * 100)).toFixed(1);
  }, [effectiveEa, temperature]);

  // Animation frame loop
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsRunning(false);
            return 100;
          }
          return prev + 1;
        });
      }, 40);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStart = () => {
    if (progress >= 100) setProgress(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setProgress(0);
  };

  // SVG coordinate path for Reaction Profile Curve
  // Width: 500, Height: 240
  // Reactants: x=50, y=240 - eReactants*2
  // Peak: x=250, y=240 - peakEnergy*2
  // Products: x=450, y=240 - eProducts*2
  const pathD = useMemo(() => {
    const yR = 240 - reaction.eReactants * 2;
    const yPeak = 240 - peakEnergy * 2;
    const yP = 240 - reaction.eProducts * 2;

    return `M 40 ${yR} C 160 ${yR}, 180 ${yPeak}, 250 ${yPeak} C 320 ${yPeak}, 340 ${yP}, 460 ${yP}`;
  }, [reaction, peakEnergy]);

  // Uncatalyzed curve for visual comparison when catalyst is active
  const uncatalyzedPathD = useMemo(() => {
    if (!hasCatalyst) return null;
    const yR = 240 - reaction.eReactants * 2;
    const yPeakUncat = 240 - (reaction.eReactants + reaction.baseEa) * 2;
    const yP = 240 - reaction.eProducts * 2;
    return `M 40 ${yR} C 160 ${yR}, 180 ${yPeakUncat}, 250 ${yPeakUncat} C 320 ${yPeakUncat}, 340 ${yP}, 460 ${yP}`;
  }, [reaction, hasCatalyst]);

  // Calculate current ball position along progress
  const currentX = 40 + (progress / 100) * 420;
  const currentY = useMemo(() => {
    const t = progress / 100;
    const yR = 240 - reaction.eReactants * 2;
    const yPeak = 240 - peakEnergy * 2;
    const yP = 240 - reaction.eProducts * 2;

    // Cubic bezier vertical interpolation
    return Math.pow(1 - t, 3) * yR +
      3 * Math.pow(1 - t, 2) * t * yPeak +
      3 * (1 - t) * Math.pow(t, 2) * yPeak +
      Math.pow(t, 3) * yP;
  }, [progress, reaction, peakEnergy]);

  return (
    <div className="space-y-6">
      {/* Top Presets Ribbon */}
      <div className="flex flex-wrap items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Reaction System:</span>
          {Object.entries(REACTIONS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => { setSelectedKey(key); handleReset(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedKey === key
                  ? item.type === 'exothermic'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {item.name.split(' (')[0]} ({item.type === 'exothermic' ? 'Exothermic' : 'Endothermic'})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={isRunning ? () => setIsRunning(false) : handleStart}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md flex items-center gap-1.5"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause' : progress >= 100 ? 'Replay Reaction' : 'Start Reaction'}</span>
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

      {/* Main Graph & Parameter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Reaction Coordinate Energy Profile SVG */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full h-[400px] sm:h-[440px] rounded-2xl overflow-hidden bg-[#070A12] border border-slate-800 shadow-2xl p-4 flex flex-col justify-between">
            {/* Top Reaction Equation Badge */}
            <div className="flex items-center justify-between z-10">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Chemical Equation: </span>
                <span className="text-white font-bold">{reaction.equation}</span>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                reaction.type === 'exothermic'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                  : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40'
              }`}>
                {reaction.type === 'exothermic' ? 'EXOTHERMIC (ΔH < 0)' : 'ENDOTHERMIC (ΔH > 0)'}
              </div>
            </div>

            {/* SVG Profile Diagram */}
            <div className="flex-1 flex items-center justify-center relative">
              <svg className="w-full h-full max-h-[300px]" viewBox="0 0 500 250">
                {/* Axes */}
                <line x1="30" y1="230" x2="480" y2="230" stroke="#334155" strokeWidth="2" />
                <line x1="30" y1="20" x2="30" y2="230" stroke="#334155" strokeWidth="2" />
                <text x="480" y="245" fill="#64748B" fontSize="10" fontFamily="monospace" textAnchor="end">
                  Reaction Coordinate →
                </text>
                <text x="35" y="25" fill="#64748B" fontSize="10" fontFamily="monospace" transform="rotate(-90, 35, 25)">
                  Potential Energy (kJ) →
                </text>

                {/* Energy Level Dash Lines */}
                <line
                  x1="30" y1={240 - reaction.eReactants * 2}
                  x2="250" y2={240 - reaction.eReactants * 2}
                  stroke="#64748B" strokeWidth="1" strokeDasharray="4 4"
                />
                <line
                  x1="250" y1={240 - reaction.eProducts * 2}
                  x2="480" y2={240 - reaction.eProducts * 2}
                  stroke="#64748B" strokeWidth="1" strokeDasharray="4 4"
                />

                {/* Uncatalyzed curve when catalyst active */}
                {uncatalyzedPathD && (
                  <path
                    d={uncatalyzedPathD}
                    fill="none"
                    stroke="#475569"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                )}

                {/* Primary Reaction Energy Coordinate Curve */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={reaction.type === 'exothermic' ? '#F59E0B' : '#00F0FF'}
                  strokeWidth="3.5"
                  className="transition-all duration-300"
                />

                {/* Activation Energy Barrier Height Arrow (E_a) */}
                <line
                  x1="250" y1={240 - reaction.eReactants * 2}
                  x2="250" y2={240 - peakEnergy * 2}
                  stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowhead)"
                />
                <text x="260" y={240 - (reaction.eReactants + effectiveEa / 2) * 2} fill="#C084FC" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  E_a ({effectiveEa} kJ)
                </text>

                {/* Enthalpy Difference (ΔH) Arrow */}
                <line
                  x1="450" y1={240 - reaction.eReactants * 2}
                  x2="450" y2={240 - reaction.eProducts * 2}
                  stroke={reaction.type === 'exothermic' ? '#F59E0B' : '#38BDF8'}
                  strokeWidth="2"
                />
                <text x="460" y={240 - (reaction.eReactants + reaction.eProducts) } fill="#E2E8F0" fontSize="11" fontFamily="monospace">
                  ΔH ({reaction.deltaH} kJ/mol)
                </text>

                {/* Animated Reaction State Particle */}
                <circle
                  cx={currentX}
                  cy={currentY}
                  r="7"
                  fill="#FFFFFF"
                  stroke="#00F0FF"
                  strokeWidth="2"
                  className="drop-shadow-lg"
                />
              </svg>
            </div>

            {/* Bottom Progress State Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800 pt-2 z-10">
              <span>Reactants: Bonds Intact</span>
              <span className="text-purple-300 font-bold">
                {progress < 30 ? 'Initial State' : progress <= 70 ? 'Transition State (Bonds Breaking)' : 'Products Formed (New Bonds)'}
              </span>
              <span>Products: Lower/Higher Well</span>
            </div>
          </div>

          {/* Telemetry Real-time Values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Enthalpy Change (ΔH)</p>
              <p className={`font-bold text-base mt-1 ${reaction.deltaH < 0 ? 'text-amber-400' : 'text-cyan-400'}`}>
                {reaction.deltaH} kJ/mol
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {reaction.deltaH < 0 ? 'Net Heat Released' : 'Net Heat Absorbed'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Activation Barrier (E_a)</p>
              <p className="text-purple-300 font-bold text-base mt-1">{effectiveEa} kJ/mol</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {hasCatalyst ? 'Catalyzed (-40% barrier)' : 'Uncatalyzed Baseline'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">System Temperature</p>
              <p className="text-white font-bold text-base mt-1">{temperature} K</p>
              <p className="text-[10px] text-slate-400 mt-0.5">({(temperature - 273.15).toFixed(0)} °C)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Arrhenius Activity Factor</p>
              <p className="text-emerald-400 font-bold text-base mt-1">{arrheniusFraction}%</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Fraction Overcoming E_a</p>
            </div>
          </div>
        </div>

        {/* Right: Controls & Reaction Tuning */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Reaction Kinetics Controls</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">Thermodynamics</span>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Temperature (T)</span>
              <span className="text-cyan-400">{temperature} K</span>
            </div>
            <input
              type="range" min="250" max="600" step="10" value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <p className="text-[10px] text-slate-400">
              Higher temperature increases average kinetic energy of molecules, raising the proportion with energy ≥ E_a.
            </p>
          </div>

          {/* Catalyst Toggle Switch */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-white">Chemical Catalyst</p>
              <p className="text-[11px] text-slate-400">Lowers E_a barrier without altering ΔH</p>
            </div>
            <button
              onClick={() => { setHasCatalyst(!hasCatalyst); handleReset(); }}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                hasCatalyst ? 'bg-purple-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  hasCatalyst ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reaction Progress Scrub Slider */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Manual Reaction Progress</span>
              <span className="text-purple-400">{progress}%</span>
            </div>
            <input
              type="range" min="0" max="100" value={progress}
              onChange={(e) => { setProgress(parseInt(e.target.value)); setIsRunning(false); }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          {/* Reaction Description Card */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Reaction Mechanism
            </p>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {reaction.description}
            </p>
          </div>
        </div>
      </div>

      {/* Educational Explanation & Arrhenius Law */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Bond Breaking vs Bond Forming
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Chemical reactions require energy input to stretch and break existing bonds (an endothermic step corresponding to <strong>Activation Energy E_a</strong>). When new product bonds form, energy is released:
          </p>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800">
            ΔH = Σ Bond Energy(Broken) - Σ Bond Energy(Formed)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            If formed bonds are stronger than broken bonds, the reaction is <strong>Exothermic (ΔH &lt; 0)</strong>. If product bonds are weaker, net heat must be absorbed, making it <strong>Endothermic (ΔH &gt; 0)</strong>.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            Arrhenius Kinetics & Catalysts
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Arrhenius equation describes how reaction rates depend on temperature and activation energy:
          </p>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-purple-300 border border-slate-800">
            k = A · e^(-E_a / RT)
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            A catalyst provides an alternative reaction pathway with a lower activation energy (E_a), greatly accelerating the reaction rate without being consumed or shifting ΔH.
          </p>
        </div>
      </div>

      {/* Action CTA: Take Concept Quiz */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/40">
        <div>
          <h4 className="text-sm font-bold text-white">Understand chemical reaction thermodynamics?</h4>
          <p className="text-xs text-slate-400">Complete the 5-question Chemical Energy quiz to test your kinetic comprehension.</p>
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
