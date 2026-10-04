import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, ArrowRight, Activity, Zap } from 'lucide-react';

// 3D Harmonic Mass-Spring Oscillator
function OscillatorMesh({ drivingFreq, naturalFreq, damping, isRunning }) {
  const massRef = useRef();
  const springRef = useRef();
  const timeRef = useRef(0);

  // Theoretical steady-state amplitude
  const amplitudeCalc = useMemo(() => {
    const f0 = 1.0; // Driving force magnitude
    const denom = Math.sqrt(
      Math.pow(Math.pow(naturalFreq, 2) - Math.pow(drivingFreq, 2), 2) +
      Math.pow(2 * damping * drivingFreq, 2)
    );
    return Math.min(3.5, f0 / (denom || 0.001));
  }, [drivingFreq, naturalFreq, damping]);

  useFrame((_, delta) => {
    if (!isRunning || !massRef.current) return;

    timeRef.current += delta;
    const t = timeRef.current;

    // Displacement x(t) = A * cos(ω*t - φ)
    const yDisp = amplitudeCalc * Math.cos(drivingFreq * 2.5 * t);
    massRef.current.position.y = yDisp;

    // Scale spring to match
    if (springRef.current) {
      springRef.current.scale.y = Math.max(0.2, (4 - yDisp) / 4);
    }
  });

  return (
    <group position={[0, 1.5, 0]}>
      {/* Top Fixed Mount */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Spring (represented by cylinder or spiral) */}
      <mesh ref={springRef} position={[0, 2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 4, 16]} />
        <meshStandardMaterial color="#94A3B8" wireframe />
      </mesh>

      {/* Oscillating Mass Block */}
      <mesh ref={massRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color={Math.abs(drivingFreq - naturalFreq) < 0.15 ? '#00F0FF' : '#818CF8'}
          emissive={Math.abs(drivingFreq - naturalFreq) < 0.15 ? '#00F0FF' : '#818CF8'}
          emissiveIntensity={Math.abs(drivingFreq - naturalFreq) < 0.15 ? 0.6 : 0.2}
        />
      </mesh>

      {/* Floor Grid */}
      <Grid position={[0, -4, 0]} args={[12, 12]} cellColor="#1E293B" sectionColor="#38BDF8" />
    </group>
  );
}

// 2D SVG Graph showing Amplitude vs Frequency curve A(ω)
function ResonanceCurve({ drivingFreq, naturalFreq, damping }) {
  const points = useMemo(() => {
    const pts = [];
    const steps = 60;
    const maxFreq = 2.5;

    for (let i = 0; i <= steps; i++) {
      const w = (i / steps) * maxFreq;
      const denom = Math.sqrt(
        Math.pow(Math.pow(naturalFreq, 2) - Math.pow(w, 2), 2) +
        Math.pow(2 * damping * w, 2)
      );
      const amp = Math.min(10, 1.0 / (denom || 0.001));
      // Normalize to SVG viewBox (width: 300, height: 120)
      const x = (w / maxFreq) * 300;
      const y = 110 - Math.min(100, amp * 12);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  }, [naturalFreq, damping]);

  // Current operating point on the curve
  const currentDenom = Math.sqrt(
    Math.pow(Math.pow(naturalFreq, 2) - Math.pow(drivingFreq, 2), 2) +
    Math.pow(2 * damping * drivingFreq, 2)
  );
  const currentAmp = Math.min(10, 1.0 / (currentDenom || 0.001));
  const currentX = (drivingFreq / 2.5) * 300;
  const currentY = 110 - Math.min(100, currentAmp * 12);

  const isResonating = Math.abs(drivingFreq - naturalFreq) < 0.15;

  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-300 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          Resonance Response: Amplitude vs. Frequency A(ω)
        </span>
        {isResonating && (
          <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 animate-pulse">
            PEAK RESONANCE ACTIVE
          </span>
        )}
      </div>

      <div className="relative w-full h-32 bg-slate-900/60 rounded-lg p-2 overflow-hidden border border-slate-800">
        <svg viewBox="0 0 300 120" className="w-full h-full">
          {/* Grid lines */}
          <line x1="0" y1="110" x2="300" y2="110" stroke="#334155" strokeWidth="1" />
          <line x1={(naturalFreq / 2.5) * 300} y1="0" x2={(naturalFreq / 2.5) * 300} y2="110" stroke="#64748B" strokeDasharray="3,3" />

          {/* Resonance Curve */}
          <polyline
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2.5"
            points={points}
          />

          {/* Operating Point Indicator */}
          <circle
            cx={currentX}
            cy={currentY}
            r="5"
            fill={isResonating ? '#00F0FF' : '#A855F7'}
            className={isResonating ? 'animate-ping' : ''}
          />
          <circle
            cx={currentX}
            cy={currentY}
            r="4"
            fill={isResonating ? '#00F0FF' : '#A855F7'}
          />
        </svg>

        <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
          <span>0 rad/s</span>
          <span className="text-cyan-400 font-bold">Natural ω₀ ({naturalFreq} rad/s)</span>
          <span>2.5 rad/s</span>
        </div>
      </div>
    </div>
  );
}

export default function OscillationResonanceSim({ onQuizClick }) {
  const [drivingFreq, setDrivingFreq] = useState(1.0);
  const [naturalFreq, setNaturalFreq] = useState(1.0);
  const [damping, setDamping] = useState(0.12);
  const [isRunning, setIsRunning] = useState(true);

  const isResonant = Math.abs(drivingFreq - naturalFreq) < 0.15;
  const qFactor = (naturalFreq / (2 * damping)).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-md border border-cyan-800">
            Harmonic Oscillator Mode
          </span>
          {isResonant && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Resonance Mode Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1.5"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isRunning ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={() => {
              setDrivingFreq(1.0);
              setNaturalFreq(1.0);
              setDamping(0.12);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D Visualizer & Resonance Graph */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden bg-[#070A12] border border-slate-800 shadow-2xl">
            <Canvas camera={{ position: [0, 2, 9], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 10, 10]} intensity={1.2} />
              <pointLight position={[-10, 5, -5]} color="#00F0FF" intensity={1} />

              <OscillatorMesh
                drivingFreq={drivingFreq}
                naturalFreq={naturalFreq}
                damping={damping}
                isRunning={isRunning}
              />

              <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.1} />
            </Canvas>

            <div className="absolute top-4 left-4 z-10 text-[11px] font-mono text-cyan-300 bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
              Interactive 3D Spring Mass &bull; Driven Oscillation
            </div>
          </div>

          {/* Integrated Amplitude vs Frequency Graph */}
          <ResonanceCurve
            drivingFreq={drivingFreq}
            naturalFreq={naturalFreq}
            damping={damping}
          />
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            Oscillator Parameters
          </h3>

          {/* Driving Frequency */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Driving Frequency (ω)</span>
              <span className="font-mono text-cyan-400">{drivingFreq.toFixed(2)} rad/s</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.2"
              step="0.05"
              value={drivingFreq}
              onChange={(e) => setDrivingFreq(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Natural Frequency */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Natural Frequency (ω₀)</span>
              <span className="font-mono text-purple-400">{naturalFreq.toFixed(2)} rad/s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={naturalFreq}
              onChange={(e) => setNaturalFreq(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          {/* Damping Coefficient */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Damping Factor (γ)</span>
              <span className="font-mono text-amber-400">{damping.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.04"
              max="0.40"
              step="0.02"
              value={damping}
              onChange={(e) => setDamping(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Telemetry Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Quality Factor (Q):</span>
              <span className="text-white font-bold">{qFactor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Frequency Offset:</span>
              <span className="text-cyan-400">{Math.abs(drivingFreq - naturalFreq).toFixed(2)} rad/s</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={onQuizClick}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <span>Take Module Quiz (5 Questions)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
