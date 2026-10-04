import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  CheckCircle2,
  Gauge
} from 'lucide-react';

export default function HeartSim({ onQuizClick }) {
  const [bpm, setBpm] = useState(75);
  const [isRunning, setIsRunning] = useState(true);
  const [cycleTime, setCycleTime] = useState(0); // 0 to 1 representing one cardiac cycle

  // Cycle period in milliseconds based on BPM: T = 60,000 / BPM
  const periodMs = (60 / bpm) * 1000;

  // Animation cycle
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const loop = (now) => {
      const delta = now - lastTime;
      lastTime = now;

      if (isRunning) {
        setCycleTime((prev) => (prev + delta / periodMs) % 1.0);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, periodMs]);

  // Cardiac cycle phase determination
  // 0.00 - 0.20: Atrial Systole (Atria contract, AV valves open)
  // 0.20 - 0.55: Ventricular Systole (Ventricles contract, Semilunar valves open)
  // 0.55 - 1.00: Diastole (Relaxation and passive ventricular refilling)
  const phase = useMemo(() => {
    if (cycleTime < 0.20) {
      return {
        name: 'Atrial Systole',
        desc: 'Atria contract, pushing blood through open AV valves into ventricles.',
        atriaScale: 0.9,
        ventricleScale: 1.05,
        avValvesOpen: true,
        slValvesOpen: false,
      };
    } else if (cycleTime < 0.55) {
      return {
        name: 'Ventricular Systole',
        desc: 'Ventricles contract strongly; AV valves snap shut (Lub sound); Semilunar valves open.',
        atriaScale: 1.05,
        ventricleScale: 0.85,
        avValvesOpen: false,
        slValvesOpen: true,
      };
    } else {
      return {
        name: 'Complete Diastole',
        desc: 'Chambers relax; Semilunar valves close (Dub sound); Blood passively refills atria.',
        atriaScale: 1.0,
        ventricleScale: 1.0,
        avValvesOpen: true,
        slValvesOpen: false,
      };
    }
  }, [cycleTime]);

  // SVG Blood Particle Positions along path
  // Blue particles = Deoxygenated (RA -> RV -> Pulmonary Artery)
  // Red particles = Oxygenated (LA -> LV -> Aorta)
  const blueOffset = (cycleTime * 100) % 100;
  const redOffset = ((cycleTime + 0.5) * 100) % 100;

  // ECG Trace points synchronized with cardiac cycle (P wave -> QRS spike -> T wave)
  const ecgPoints = useMemo(() => {
    const pts = [];
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      let y = 35; // Baseline

      if (t > 0.08 && t < 0.18) {
        // P-Wave (Atrial depolarization)
        y -= Math.sin(((t - 0.08) / 0.1) * Math.PI) * 10;
      } else if (t >= 0.20 && t < 0.22) {
        // Q dip
        y += 6;
      } else if (t >= 0.22 && t < 0.28) {
        // R sharp upward spike (Ventricular depolarization)
        y -= 30;
      } else if (t >= 0.28 && t < 0.31) {
        // S dip
        y += 10;
      } else if (t > 0.42 && t < 0.58) {
        // T-Wave (Ventricular repolarization)
        y -= Math.sin(((t - 0.42) / 0.16) * Math.PI) * 14;
      }

      const x = t * 320;
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  }, []);

  const handleReset = () => {
    setBpm(75);
    setCycleTime(0);
    setIsRunning(true);
  };

  return (
    <div className="space-y-6">
      {/* Top BPM Presets Ribbon */}
      <div className="flex flex-wrap items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Heart Rate:</span>
          {[60, 75, 90, 120].map((rate) => (
            <button
              key={rate}
              onClick={() => setBpm(rate)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                bpm === rate
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {rate} BPM {rate === 60 ? '(Resting)' : rate === 120 ? '(Exercise)' : ''}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md flex items-center gap-1.5"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause Cycle' : 'Resume Heartbeat'}</span>
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

      {/* Main 4-Chamber Heart Canvas & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 4-Chamber Anatomical SVG Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full h-[440px] rounded-2xl overflow-hidden bg-[#070A12] border border-slate-800 shadow-2xl p-4 flex flex-col justify-between">
            {/* SVG 4-Chamber Diagram */}
            <div className="flex-1 flex items-center justify-center">
              <svg className="w-full h-full max-h-[340px]" viewBox="0 0 540 340">
                <defs>
                  {/* Deoxygenated Blood Gradient */}
                  <linearGradient id="deox-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E3A8A" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                  {/* Oxygenated Blood Gradient */}
                  <linearGradient id="ox-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#991B1B" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>

                {/* Central Septum Wall */}
                <line x1="270" y1="50" x2="270" y2="300" stroke="#475569" strokeWidth="8" strokeLinecap="round" />

                {/* ================= RIGHT HEART (DEOXYGENATED / BLUE) ================= */}
                {/* 1. Right Atrium (RA) */}
                <g transform={`translate(200, 110) scale(${phase.atriaScale})`} className="transition-transform duration-150">
                  <ellipse cx="0" cy="0" rx="55" ry="45" fill="url(#deox-grad)" stroke="#38BDF8" strokeWidth="2.5" />
                  <text textAnchor="middle" y="5" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="monospace">
                    Right Atrium
                  </text>
                  <text textAnchor="middle" y="20" fill="#93C5FD" fontSize="10" fontFamily="monospace">
                    (Vena Cava In)
                  </text>
                </g>

                {/* Tricuspid Valve (RA to RV) */}
                <g transform="translate(200, 165)">
                  <line
                    x1="-24" y1="0" x2="24" y2="0"
                    stroke={phase.avValvesOpen ? '#10B981' : '#F43F5E'}
                    strokeWidth="3.5"
                    strokeDasharray={phase.avValvesOpen ? '6 4' : 'none'}
                  />
                  <text x="-35" y="4" textAnchor="end" fill={phase.avValvesOpen ? '#34D399' : '#FB7185'} fontSize="9" fontFamily="monospace">
                    {phase.avValvesOpen ? 'Tricuspid: OPEN' : 'Tricuspid: CLOSED'}
                  </text>
                </g>

                {/* 2. Right Ventricle (RV) */}
                <g transform={`translate(200, 230) scale(${phase.ventricleScale})`} className="transition-transform duration-150">
                  <path
                    d="M -50 -35 C -60 30, -30 65, 0 70 C 30 65, 60 30, 50 -35 Z"
                    fill="url(#deox-grad)"
                    stroke="#38BDF8"
                    strokeWidth="3"
                  />
                  <text textAnchor="middle" y="15" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="monospace">
                    Right Ventricle
                  </text>
                  <text textAnchor="middle" y="30" fill="#93C5FD" fontSize="10" fontFamily="monospace">
                    (To Lungs)
                  </text>
                </g>

                {/* ================= LEFT HEART (OXYGENATED / RED) ================= */}
                {/* 3. Left Atrium (LA) */}
                <g transform={`translate(340, 110) scale(${phase.atriaScale})`} className="transition-transform duration-150">
                  <ellipse cx="0" cy="0" rx="55" ry="45" fill="url(#ox-grad)" stroke="#F87171" strokeWidth="2.5" />
                  <text textAnchor="middle" y="5" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="monospace">
                    Left Atrium
                  </text>
                  <text textAnchor="middle" y="20" fill="#FECACA" fontSize="10" fontFamily="monospace">
                    (Pulmonary Vein)
                  </text>
                </g>

                {/* Mitral / Bicuspid Valve (LA to LV) */}
                <g transform="translate(340, 165)">
                  <line
                    x1="-24" y1="0" x2="24" y2="0"
                    stroke={phase.avValvesOpen ? '#10B981' : '#F43F5E'}
                    strokeWidth="3.5"
                    strokeDasharray={phase.avValvesOpen ? '6 4' : 'none'}
                  />
                  <text x="35" y="4" textAnchor="start" fill={phase.avValvesOpen ? '#34D399' : '#FB7185'} fontSize="9" fontFamily="monospace">
                    {phase.avValvesOpen ? 'Mitral: OPEN' : 'Mitral: CLOSED'}
                  </text>
                </g>

                {/* 4. Left Ventricle (LV) - Thicker Myocardium */}
                <g transform={`translate(340, 230) scale(${phase.ventricleScale})`} className="transition-transform duration-150">
                  <path
                    d="M -50 -35 C -65 35, -35 75, 0 80 C 35 75, 65 35, 50 -35 Z"
                    fill="url(#ox-grad)"
                    stroke="#F87171"
                    strokeWidth="5" // Noticeable thick muscular wall
                  />
                  <text textAnchor="middle" y="15" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="monospace">
                    Left Ventricle
                  </text>
                  <text textAnchor="middle" y="30" fill="#FECACA" fontSize="10" fontFamily="monospace">
                    (To Systemic Aorta)
                  </text>
                </g>

                {/* Great Vessels Headers */}
                <text x="160" y="30" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  ← Vena Cava (Deoxygenated)
                </text>
                <text x="380" y="30" fill="#EF4444" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Aorta (Oxygenated) →
                </text>
              </svg>
            </div>

            {/* Bottom Phase Status Bar */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 animate-bounce" />
                <span className="text-white font-bold">{phase.name}</span>
              </div>
              <p className="text-slate-400 text-[11px] hidden sm:block">{phase.desc}</p>
              <span className="text-rose-400 font-bold">{bpm} BPM</span>
            </div>
          </div>

          {/* Real-time Telemetry & Hemodynamics Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Cardiac Output (CO)</p>
              <p className="text-rose-400 font-bold text-base mt-1">
                {((bpm * 70) / 1000).toFixed(1)} L/min
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">CO = HR × Stroke Vol (70mL)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Ventricular Pressure</p>
              <p className="text-cyan-300 font-bold text-base mt-1">
                {phase.name === 'Ventricular Systole' ? '120 mmHg (Peak)' : '80 mmHg (Diastolic)'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Left Ventricle Driving Force</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">AV Heart Sound</p>
              <p className="text-white font-bold text-base mt-1">
                {phase.name === 'Ventricular Systole' ? 'Lub (S1)' : cycleTime > 0.55 && cycleTime < 0.65 ? 'Dub (S2)' : 'Refilling'}
              </p>
              <p className="text-[10px] text-emerald-400 mt-0.5">Acoustic Valve Closure</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Cardiac Cycle Time</p>
              <p className="text-purple-300 font-bold text-base mt-1">
                {(periodMs / 1000).toFixed(2)} sec / beat
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">60 / {bpm} BPM</p>
            </div>
          </div>
        </div>

        {/* Right: ECG Waveform & Controls */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" />
              <span>Live Electrocardiogram (ECG)</span>
            </h3>
            <span className="text-[11px] font-mono text-rose-400">Lead II</span>
          </div>

          {/* Real-time Synchronized ECG Screen */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>P-QRS-T Wave</span>
              <span className="text-emerald-400">Normal Sinus Rhythm</span>
            </div>
            <div className="h-20 w-full overflow-hidden flex items-center relative">
              <svg className="w-full h-full" viewBox="0 0 320 60">
                {/* Background Grid */}
                <line x1="0" y1="35" x2="320" y2="35" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
                <path d={`M ${ecgPoints}`} fill="none" stroke="#10B981" strokeWidth="2.5" />
                {/* Moving Sweep Dot */}
                <circle cx={cycleTime * 320} cy={35} r="4" fill="#00F0FF" className="animate-ping" />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
              <span>P: Atrial Depol</span>
              <span>QRS: Ventricular Depol</span>
              <span>T: Vent Repol</span>
            </div>
          </div>

          {/* Heart Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Heart Rate (HR)</span>
              <span className="text-rose-400 font-bold">{bpm} Beats/Min</span>
            </div>
            <input
              type="range" min="45" max="150" step="5" value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          {/* Double Circulation Path Breakdown */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <p className="text-white font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Double Circulation Circuit
            </p>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="p-1.5 rounded bg-blue-950/40 border border-blue-900/50 text-blue-300">
                <strong>Pulmonary Circuit:</strong> RV → Pulmonary Artery → Lungs (Oxygenation) → Pulmonary Vein → LA
              </div>
              <div className="p-1.5 rounded bg-rose-950/40 border border-rose-900/50 text-rose-300">
                <strong>Systemic Circuit:</strong> LA → LV → Aorta → Systemic Organs (Oxygen delivery) → Vena Cava → RA
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Explanation & Hemodynamics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            The 4-Chamber Pumping Mechanism
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The human heart functions as a dual muscular pump. The <strong>right side</strong> handles low-pressure deoxygenated blood traveling to the lungs, while the <strong>left side</strong> handles high-pressure oxygenated blood distributed systemically:
          </p>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800">
            Cardiac Output = Heart Rate (HR) × Stroke Volume (SV)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The thicker myocardial wall of the left ventricle reflects the immense pressure required to overcome peripheral systemic vascular resistance.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            Electrical Conduction & Pacemaker (SA Node)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The heartbeat is initiated intrinsically by the <strong>Sinoatrial (SA) Node</strong> in the right atrium:
          </p>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>SA node spontaneous depolarization generates action potentials (P wave).</li>
            <li>Signal pauses briefly at the AV node, allowing atria to empty into ventricles.</li>
            <li>Bundle of His and Purkinje fibers rapidly propagate impulse across ventricles (QRS complex).</li>
            <li>Ventricles contract from apex upward, ejecting blood into great arteries.</li>
          </ul>
        </div>
      </div>

      {/* Action CTA: Take Concept Quiz */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/40">
        <div>
          <h4 className="text-sm font-bold text-white">Understand cardiovascular physiology & cardiac cycles?</h4>
          <p className="text-xs text-slate-400">Complete the 5-question Heart Working quiz to test your physiological understanding.</p>
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
