import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Dna,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export default function MuscleMovementSim({ onQuizClick }) {
  // Contraction percentages (0% relaxed to 100% fully contracted)
  const [bicepsContraction, setBicepsContraction] = useState(65);
  const [tricepsContraction, setTricepsContraction] = useState(15);
  const [isAutomated, setIsAutomated] = useState(false);

  // Compute elbow joint angle (degrees):
  // 170° = fully extended (arm straight)
  // 45° = fully flexed (biceps pulled hand toward shoulder)
  const elbowAngle = useMemo(() => {
    // Net pulling balance
    const netPull = (bicepsContraction - tricepsContraction) / 100;
    // Map netPull from [-1, 1] to [170, 45]
    const angle = 110 - netPull * 60;
    return Math.max(45, Math.min(170, Math.round(angle)));
  }, [bicepsContraction, tricepsContraction]);

  // Forces and biomechanical torque
  const bicepsForce = (bicepsContraction * 4.8).toFixed(1); // Newtons
  const tricepsForce = (tricepsContraction * 4.2).toFixed(1); // Newtons
  const radAngle = (elbowAngle * Math.PI) / 180;
  const torque = ((bicepsForce * 0.05 * Math.sin(radAngle)) - (tricepsForce * 0.03 * Math.sin(radAngle))).toFixed(2);

  // Automated flexion/extension workout cycle
  useEffect(() => {
    let interval;
    let step = 1;
    if (isAutomated) {
      interval = setInterval(() => {
        setBicepsContraction((prev) => {
          if (prev >= 90) step = -1.5;
          if (prev <= 15) step = 1.5;
          const nextB = prev + step;
          setTricepsContraction(100 - nextB);
          return Math.max(10, Math.min(95, nextB));
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAutomated]);

  const handleFlexion = () => {
    setIsAutomated(false);
    setBicepsContraction(85);
    setTricepsContraction(10);
  };

  const handleExtension = () => {
    setIsAutomated(false);
    setBicepsContraction(15);
    setTricepsContraction(85);
  };

  const handleReset = () => {
    setIsAutomated(false);
    setBicepsContraction(50);
    setTricepsContraction(50);
  };

  // SVG Geometry Coordinates
  // Shoulder Joint: (180, 100)
  // Elbow Joint: (180, 260)
  // Forearm length = 170 px
  // End of Forearm (Wrist):
  const shoulderX = 200;
  const shoulderY = 80;
  const elbowX = 200;
  const elbowY = 250;
  const forearmLength = 170;

  // Forearm angle from vertical downwards:
  // If angle is 170° -> points downwards; if 45° -> points up and left
  const forearmRad = ((180 - elbowAngle) * Math.PI) / 180;
  const wristX = elbowX + forearmLength * Math.sin(forearmRad);
  const wristY = elbowY - forearmLength * Math.cos(forearmRad);

  // Tendon attachment on forearm: ~35px from elbow
  const tendonInsertX = elbowX + 45 * Math.sin(forearmRad);
  const tendonInsertY = elbowY - 45 * Math.cos(forearmRad);

  return (
    <div className="space-y-6">
      {/* Top Preset Action Ribbon */}
      <div className="flex flex-wrap items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Arm Pose:</span>
          <button
            onClick={handleFlexion}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              elbowAngle < 80
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Flexion (Biceps Contracted)
          </button>
          <button
            onClick={handleExtension}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              elbowAngle > 140
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Extension (Triceps Contracted)
          </button>
          <button
            onClick={() => setIsAutomated(!isAutomated)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isAutomated
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isAutomated ? 'Pause Auto Cycle' : 'Auto Flex/Extend Cycle'}
          </button>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Arm</span>
        </button>
      </div>

      {/* Main Arm Anatomy Viewport & Parameter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 2D Biomechanical Arm Diagram */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full h-[440px] rounded-2xl overflow-hidden bg-[#070A12] border border-slate-800 shadow-2xl p-4 flex items-center justify-center">
            {/* SVG Anatomical Arm Simulation */}
            <svg className="w-full h-full" viewBox="0 0 540 380">
              <defs>
                <linearGradient id="bone-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#CBD5E1" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>
                <linearGradient id="biceps-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284C7" />
                  <stop offset="50%" stopColor="#00F0FF" />
                  <stop offset="100%" stopColor="#0369A1" />
                </linearGradient>
                <linearGradient id="triceps-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E11D48" />
                  <stop offset="50%" stopColor="#F43F5E" />
                  <stop offset="100%" stopColor="#BE123C" />
                </linearGradient>
              </defs>

              {/* Upper Arm Bone (Humerus) */}
              <line
                x1={shoulderX} y1={shoulderY}
                x2={elbowX} y2={elbowY}
                stroke="url(#bone-grad)"
                strokeWidth="24"
                strokeLinecap="round"
              />

              {/* Forearm Bone (Radius & Ulna) */}
              <line
                x1={elbowX} y1={elbowY}
                x2={wristX} y2={wristY}
                stroke="url(#bone-grad)"
                strokeWidth="18"
                strokeLinecap="round"
                className="transition-all duration-150"
              />

              {/* Biceps Muscle (Antagonist Front Puller) */}
              {/* Width bulges when contracted */}
              <path
                d={`M ${shoulderX + 6} ${shoulderY + 20} Q ${shoulderX + 35 + (bicepsContraction / 100) * 22} 165 ${tendonInsertX} ${tendonInsertY}`}
                fill="none"
                stroke="url(#biceps-grad)"
                strokeWidth={14 + (bicepsContraction / 100) * 16}
                strokeLinecap="round"
                className="transition-all duration-150 drop-shadow-md"
              />

              {/* Biceps Tendons (White Connective Tissue) */}
              <line x1={shoulderX} y1={shoulderY} x2={shoulderX + 8} y2={shoulderY + 20} stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
              <line x1={tendonInsertX - 6} y1={tendonInsertY - 6} x2={tendonInsertX} y2={tendonInsertY} stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />

              {/* Triceps Muscle (Antagonist Back Puller) */}
              <path
                d={`M ${shoulderX - 10} ${shoulderY + 20} Q ${shoulderX - 30 - (tricepsContraction / 100) * 18} 170 ${elbowX - 10} ${elbowY + 8}`}
                fill="none"
                stroke="url(#triceps-grad)"
                strokeWidth={12 + (tricepsContraction / 100) * 14}
                strokeLinecap="round"
                className="transition-all duration-150 drop-shadow-md"
              />
              <line x1={elbowX - 10} y1={elbowY + 8} x2={elbowX} y2={elbowY + 12} stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />

              {/* Shoulder Joint Pivot */}
              <circle cx={shoulderX} cy={shoulderY} r="18" fill="#475569" stroke="#94A3B8" strokeWidth="3" />
              <text x={shoulderX} y={shoulderY - 26} textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="monospace">Shoulder (Fixed)</text>

              {/* Elbow Hinge Joint Pivot */}
              <circle cx={elbowX} cy={elbowY} r="14" fill="#334155" stroke="#38BDF8" strokeWidth="3" />
              <text x={elbowX - 35} y={elbowY + 25} textAnchor="end" fill="#38BDF8" fontSize="11" fontFamily="monospace">Elbow Hinge</text>

              {/* Hand/Wrist Endpoint */}
              <circle cx={wristX} cy={wristY} r="12" fill="#E2E8F0" stroke="#00F0FF" strokeWidth="2" />
              <text x={wristX + 15} y={wristY + 5} fill="#FFFFFF" fontSize="11" fontFamily="monospace">Hand / Load</text>

              {/* Angle Arc Indicator */}
              <path
                d={`M ${elbowX} ${elbowY - 45} A 45 45 0 0 1 ${elbowX + 45 * Math.sin(forearmRad)} ${elbowY - 45 * Math.cos(forearmRad)}`}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              <text x={elbowX + 50} y={elbowY - 25} fill="#F59E0B" fontSize="12" fontFamily="monospace" fontWeight="bold">
                {elbowAngle}°
              </text>
            </svg>

            {/* State Indicator Badge */}
            <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-white">Biceps: {bicepsContraction >= 50 ? 'Active Contraction (Flexor)' : 'Relaxed / Stretched'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-white">Triceps: {tricepsContraction >= 50 ? 'Active Contraction (Extensor)' : 'Relaxed / Stretched'}</span>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Elbow Angle (θ)</p>
              <p className="text-amber-400 font-bold text-base mt-1">{elbowAngle}°</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {elbowAngle < 90 ? 'Flexed' : 'Extended'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Biceps Tension (F_b)</p>
              <p className="text-cyan-300 font-bold text-base mt-1">{bicepsForce} N</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Anterior Pull Force</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Triceps Tension (F_t)</p>
              <p className="text-rose-400 font-bold text-base mt-1">{tricepsForce} N</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Posterior Pull Force</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Net Joint Torque (τ)</p>
              <p className="text-emerald-400 font-bold text-base mt-1">{torque} N·m</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Rotational Elbow Effort</p>
            </div>
          </div>
        </div>

        {/* Right: Muscle Sliders & Biomechanical Controls */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Muscle Activation</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">Antagonistic Pair</span>
          </div>

          {/* Biceps Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyan-300 font-medium">Biceps Contraction (Flexor)</span>
              <span className="text-white">{bicepsContraction}%</span>
            </div>
            <input
              type="range" min="5" max="95" value={bicepsContraction}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setBicepsContraction(val);
                // Antagonistic reciprocal inhibition
                setTricepsContraction(Math.max(5, 100 - val));
                setIsAutomated(false);
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <p className="text-[10px] text-slate-400">
              Pulls tendon attached to radius, rotating forearm upward toward shoulder.
            </p>
          </div>

          {/* Triceps Slider */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-rose-400 font-medium">Triceps Contraction (Extensor)</span>
              <span className="text-white">{tricepsContraction}%</span>
            </div>
            <input
              type="range" min="5" max="95" value={tricepsContraction}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setTricepsContraction(val);
                setBicepsContraction(Math.max(5, 100 - val));
                setIsAutomated(false);
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
            <p className="text-[10px] text-slate-400">
              Pulls olecranon process at back of ulna, straightening the elbow joint.
            </p>
          </div>

          {/* Anatomical Labels Breakdown */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <p className="text-white font-bold flex items-center gap-1.5">
              <Dna className="w-3.5 h-3.5 text-cyan-400" /> Musculoskeletal Components
            </p>
            <div className="space-y-1 text-[11px] font-mono text-slate-400">
              <p><strong className="text-slate-200">Bone:</strong> Rigid lever arm (Humerus, Radius, Ulna)</p>
              <p><strong className="text-slate-200">Joint:</strong> Fulcrum of rotational motion (Hinge)</p>
              <p><strong className="text-slate-200">Tendon:</strong> High-tensile collagen cable transferring force</p>
              <p><strong className="text-slate-200">Muscle:</strong> Sliding filaments (Actin & Myosin) generating tension</p>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Explanation & Biomechanical Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Why Are Muscles Arranged in Antagonistic Pairs?
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Skeletal muscles can only <strong>actively pull (shorten by contraction)</strong>; they cannot actively push to elongate themselves.
          </p>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800">
            Nerve Signal → Ca²⁺ Release → Actin/Myosin Sliding → Tendon Tension → Joint Rotation
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Therefore, joints require opposing pairs: when the <strong>biceps (agonist)</strong> contracts to bend the arm, the <strong>triceps (antagonist)</strong> must relax and be passively stretched.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            Joint Biomechanics & Mechanical Advantage
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The human forearm operates as a <strong>Class 3 lever</strong>: the effort (biceps tendon) is applied between the fulcrum (elbow) and the load (hand):
          </p>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-purple-300 border border-slate-800">
            Torque τ = Force · r_tendon · sin(θ)
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            While this configuration requires greater muscle force than the object's weight, it maximizes the velocity and range of motion of the hand.
          </p>
        </div>
      </div>

      {/* Action CTA: Take Concept Quiz */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/40">
        <div>
          <h4 className="text-sm font-bold text-white">Understand human musculoskeletal mechanics?</h4>
          <p className="text-xs text-slate-400">Take the 5-question Muscle Movement quiz to test your anatomical understanding.</p>
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
