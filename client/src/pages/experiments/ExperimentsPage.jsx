import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { 
  FlaskConical, 
  Sparkles, 
  Target, 
  Award, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  Sliders,
  Zap,
  Waves,
  CircleDot
} from 'lucide-react';

export default function ExperimentsPage() {
  const navigate = useNavigate();
  const { recordExperimentComplete } = useProgress();

  // Active challenge state for Faraday Maximum Voltage Challenge
  const [velocity, setVelocity] = useState(3.0);
  const [turns, setTurns] = useState(6);
  const [field, setField] = useState(2.0);
  const [result, setResult] = useState(null);

  const handleRunExperiment = () => {
    // Voltage calculation = turns * field * velocity * 0.5
    const voltage = (turns * field * velocity * 0.5).toFixed(2);
    const passed = parseFloat(voltage) >= 25.0;

    setResult({
      voltage,
      passed,
      feedback: passed
        ? 'Target achieved! By maximizing turns, field strength, and relative velocity, you maximized the flux derivative dΦ/dt.'
        : 'Goal not reached yet. Target is at least 25.00 V. Try increasing velocity, coil turns, or magnetic field strength.'
    });

    if (passed) {
      recordExperimentComplete('Max Voltage Faraday Challenge');
    }
  };

  const challengeMissions = [
    {
      id: 'faraday-max-voltage',
      title: 'Mission: Maximize Induced Voltage',
      concept: 'Electromagnetic Induction',
      goal: 'Achieve an induced potential difference (ℰ) of at least 25.00 Volts.',
      route: '/lab/electric-magnetic-fields',
      active: true
    },
    {
      id: 'wave-destructive-null',
      title: 'Mission: Quantum Tunneling Analysis',
      concept: 'Wave Functions & PES',
      goal: 'Adjust potential barrier height and width to observe exponential decay.',
      route: '/lab/wave-functions-pes',
      active: false
    },
    {
      id: 'elastic-energy-transfer',
      title: 'Mission: 100% Kinetic Energy Transfer',
      concept: 'Collision & Momentum',
      goal: 'Match mass ratios m₁ = m₂ with e = 1.0 to transfer all momentum to target object.',
      route: '/lab/collision',
      active: false
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Experiment Challenges</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          STEM Experiment Laboratory
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Put scientific principles to the test. Tweak independent variables, hit experimental targets, and earn research XP.
        </p>
      </div>

      {/* Spotlight Challenge: Active Interactive Experiment Sandbox */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6 mb-6">
          <div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase tracking-wider">
              Active Challenge 01
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Mission: Generate the Highest Induced Voltage
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Faraday's Law Challenge: Configure the physical apparatus to generate at least <strong className="text-cyan-400">25.00 V</strong> of induced electromotive force.
            </p>
          </div>

          <button
            onClick={() => navigate('/lab/electric-magnetic-fields')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-cyan-500 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Open 3D Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Challenge Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Magnet Velocity</span>
              <span className="font-mono text-cyan-400">{velocity.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.5"
              value={velocity}
              onChange={(e) => setVelocity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Coil Turns (N)</span>
              <span className="font-mono text-cyan-400">{turns} turns</span>
            </div>
            <input
              type="range"
              min="2"
              max="12"
              step="1"
              value={turns}
              onChange={(e) => setTurns(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Magnetic Field (B)</span>
              <span className="font-mono text-cyan-400">{field.toFixed(1)} T</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={field}
              onChange={(e) => setField(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* Run Button and Output Feedback */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleRunExperiment}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>RUN EXPERIMENT</span>
          </button>

          {result && (
            <div className={`p-3.5 rounded-xl border text-xs flex-1 ${
              result.passed
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}>
              <p className="font-bold flex items-center gap-1.5">
                {result.passed ? <CheckCircle2 className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                Measured Potential: {result.voltage} Volts {result.passed ? '(Target Met! +100 XP)' : '(Target: >= 25.00 V)'}
              </p>
              <p className="text-[11px] text-slate-300 mt-1">{result.feedback}</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Mission Challenges List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Upcoming Lab Missions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challengeMissions.slice(1).map((m) => (
            <div
              key={m.id}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {m.concept}
                </span>
                <h4 className="text-base font-bold text-white mt-2">{m.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{m.goal}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Stage 2 Challenge</span>
                <button
                  onClick={() => navigate(m.route)}
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <span>Launch Simulation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
