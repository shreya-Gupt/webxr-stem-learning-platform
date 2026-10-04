import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, ArrowRight, Sparkles, Scale, Activity } from 'lucide-react';

function SphereMesh({ position, color, radius, name }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
}

export default function CollisionSim({ onQuizClick }) {
  const [mass1, setMass1] = useState(3.0);
  const [mass2, setMass2] = useState(2.0);
  const [vel1Init, setVel1Init] = useState(4.0);
  const [vel2Init, setVel2Init] = useState(-3.0);
  const [restitution, setRestitution] = useState(1.0); // 0 = inelastic, 1 = elastic

  const [isRunning, setIsRunning] = useState(false);
  const [hasCollided, setHasCollided] = useState(false);

  const [pos1, setPos1] = useState(-6);
  const [pos2, setPos2] = useState(6);
  const [curVel1, setCurVel1] = useState(4.0);
  const [curVel2, setCurVel2] = useState(-3.0);

  // Radii proportional to cube root of mass
  const r1 = 0.45 * Math.cbrt(mass1);
  const r2 = 0.45 * Math.cbrt(mass2);

  // Exact physics calculations
  const pInitial = mass1 * vel1Init + mass2 * vel2Init;
  const ke1Init = 0.5 * mass1 * vel1Init * vel1Init;
  const ke2Init = 0.5 * mass2 * vel2Init * vel2Init;
  const keInitial = ke1Init + ke2Init;

  // Post collision analytical theoretical values
  const v1FinalTheoretical =
    ((mass1 - restitution * mass2) * vel1Init + (1 + restitution) * mass2 * vel2Init) /
    (mass1 + mass2);
  const v2FinalTheoretical =
    ((mass2 - restitution * mass1) * vel2Init + (1 + restitution) * mass1 * vel1Init) /
    (mass1 + mass2);

  const pFinalTheoretical = mass1 * v1FinalTheoretical + mass2 * v2FinalTheoretical;
  const keFinalTheoretical =
    0.5 * mass1 * Math.pow(v1FinalTheoretical, 2) + 0.5 * mass2 * Math.pow(v2FinalTheoretical, 2);
  const energyLossTheoretical = Math.max(0, keInitial - keFinalTheoretical);

  // Animation frame loop
  useEffect(() => {
    let animId;
    const dt = 0.02;

    if (isRunning) {
      animId = setInterval(() => {
        setPos1((p1) => {
          setPos2((p2) => {
            const nextP1 = p1 + curVel1 * dt;
            const nextP2 = p2 + curVel2 * dt;

            // Check collision
            if (!hasCollided && nextP1 + r1 >= nextP2 - r2) {
              setHasCollided(true);
              setCurVel1(v1FinalTheoretical);
              setCurVel2(v2FinalTheoretical);
              return p2;
            }

            // Boundary stop if too far
            if (Math.abs(nextP1) > 14 || Math.abs(nextP2) > 14) {
              setIsRunning(false);
            }

            return nextP2;
          });
          return p1 + curVel1 * dt;
        });
      }, 20);
    }

    return () => clearInterval(animId);
  }, [isRunning, hasCollided, curVel1, curVel2, r1, r2, v1FinalTheoretical, v2FinalTheoretical]);

  const handleStart = () => {
    if (pos1 >= pos2 - (r1 + r2)) {
      handleReset();
    }
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setHasCollided(false);
    setPos1(-6);
    setPos2(6);
    setCurVel1(vel1Init);
    setCurVel2(vel2Init);
  };

  const setPreset = (type) => {
    if (type === 'elastic') {
      setRestitution(1.0);
    } else if (type === 'partial') {
      setRestitution(0.5);
    } else if (type === 'inelastic') {
      setRestitution(0.0);
    }
    handleReset();
  };

  return (
    <div className="space-y-6">
      {/* Top Presets & Controls Header */}
      <div className="flex flex-wrap items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-1">Collision Type:</span>
          <button
            onClick={() => setPreset('elastic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              restitution === 1.0
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Perfect Elastic (e = 1.0)
          </button>
          <button
            onClick={() => setPreset('partial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              restitution > 0 && restitution < 1
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Partially Inelastic (e = 0.5)
          </button>
          <button
            onClick={() => setPreset('inelastic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              restitution === 0.0
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Completely Inelastic (e = 0.0)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={isRunning ? () => setIsRunning(false) : handleStart}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md flex items-center gap-1.5"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause' : 'Start Simulation'}</span>
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

      {/* Main Viewport & Parameter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D Physics Viewport */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full h-[400px] sm:h-[440px] rounded-2xl overflow-hidden bg-[#070A12] border border-slate-800 shadow-2xl">
            <Canvas camera={{ position: [0, 4, 14], fov: 50 }}>
              <ambientLight intensity={0.7} />
              <pointLight position={[0, 10, 10]} intensity={1.2} />
              <pointLight position={[-10, 5, -5]} color="#00F0FF" intensity={0.8} />
              <pointLight position={[10, 5, -5]} color="#EF4444" intensity={0.8} />

              <Grid
                position={[0, -0.6, 0]}
                args={[28, 12]}
                cellSize={1}
                cellColor="#1E293B"
                sectionColor="#38BDF8"
              />

              {/* Guiding Linear Track */}
              <mesh position={[0, -0.55, 0]}>
                <boxGeometry args={[26, 0.08, 1.2]} />
                <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
              </mesh>

              {/* Sphere 1 (Cyan) */}
              <SphereMesh
                position={[pos1, r1 - 0.5, 0]}
                color="#00F0FF"
                radius={r1}
                name="Object 1"
              />

              {/* Sphere 2 (Rose/Purple) */}
              <SphereMesh
                position={[pos2, r2 - 0.5, 0]}
                color="#F43F5E"
                radius={r2}
                name="Object 2"
              />

              <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.1} />
            </Canvas>

            {/* Collision Indicator Alert Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-700 text-xs font-mono">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  hasCollided ? 'bg-amber-400 animate-ping' : isRunning ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
              />
              <span className="text-white">
                {hasCollided
                  ? 'Post-Collision Trajectory'
                  : isRunning
                  ? 'Objects In Motion'
                  : 'Ready to Collide'}
              </span>
            </div>
          </div>

          {/* Real-time Telemetry & Physics Balance Panel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Total Momentum (P)</p>
              <p className="text-cyan-300 font-bold text-base mt-1">
                {hasCollided ? pFinalTheoretical.toFixed(2) : pInitial.toFixed(2)} kg·m/s
              </p>
              <p className="text-[10px] text-emerald-400 mt-0.5">Strictly Conserved (ΔP = 0)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Initial Kinetic Energy</p>
              <p className="text-white font-bold text-base mt-1">{keInitial.toFixed(1)} J</p>
              <p className="text-[10px] text-slate-400 mt-0.5">½m₁v₁² + ½m₂v₂²</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Post-Collision KE</p>
              <p
                className={`font-bold text-base mt-1 ${
                  restitution === 1.0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {keFinalTheoretical.toFixed(1)} J
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {restitution === 1.0 ? '100% Conserved' : `${((keFinalTheoretical / (keInitial || 1)) * 100).toFixed(0)}% Retained`}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">KE Dissipated (Heat)</p>
              <p className="text-rose-400 font-bold text-base mt-1">
                {energyLossTheoretical.toFixed(1)} J
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {restitution === 1.0 ? 'No Energy Lost' : 'Internal Thermal/Sound'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Parameter Sliders Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Collision Parameters</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">1D Linear Model</span>
          </div>

          {/* Mass 1 Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-300 font-medium">Mass 1 (m₁)</span>
              <span className="font-mono text-white">{mass1.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.5"
              value={mass1}
              onChange={(e) => {
                setMass1(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Velocity 1 Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-300 font-medium">Initial Velocity 1 (v₁)</span>
              <span className="font-mono text-white">{vel1Init.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.5"
              value={vel1Init}
              onChange={(e) => {
                setVel1Init(parseFloat(e.target.value));
                setCurVel1(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Mass 2 Slider */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-rose-400 font-medium">Mass 2 (m₂)</span>
              <span className="font-mono text-white">{mass2.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.5"
              value={mass2}
              onChange={(e) => {
                setMass2(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
          </div>

          {/* Velocity 2 Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-rose-400 font-medium">Initial Velocity 2 (v₂)</span>
              <span className="font-mono text-white">{vel2Init.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min="-8.0"
              max="-0.5"
              step="0.5"
              value={vel2Init}
              onChange={(e) => {
                setVel2Init(parseFloat(e.target.value));
                setCurVel2(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
          </div>

          {/* Coefficient of Restitution Slider */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Restitution (e)</span>
              <span className="font-mono text-purple-400">{restitution.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={restitution}
              onChange={(e) => {
                setRestitution(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          {/* Theoretical Post-Collision Velocities preview */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
            <p className="text-[10px] text-slate-500 uppercase">Computed Post-Collision Speeds</p>
            <p className="text-cyan-300">v₁' = {v1FinalTheoretical.toFixed(2)} m/s</p>
            <p className="text-rose-400">v₂' = {v2FinalTheoretical.toFixed(2)} m/s</p>
          </div>
        </div>
      </div>

      {/* Educational Explanation & Governing Equations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            What is Happening Physically?
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            In any isolated system without external friction, Newton’s third law dictates that action and reaction forces during contact are equal and opposite. Consequently, <strong>total linear momentum is always conserved</strong>:
          </p>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800">
            m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Whether mechanical kinetic energy is conserved depends on the <strong>coefficient of restitution (e)</strong>. In a perfectly elastic collision (e = 1), zero kinetic energy is lost. In an inelastic collision (e = 0), maximum kinetic energy is dissipated into internal thermal vibrations and sound.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            Analytical Velocity Formulas
          </h4>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-purple-300 border border-slate-800 space-y-1.5">
            <p>e = (v₂' - v₁') / (v₁ - v₂)</p>
            <p className="text-slate-400 text-[11px]">v₁' = [(m₁ - e·m₂)v₁ + (1+e)m₂v₂] / (m₁ + m₂)</p>
            <p className="text-slate-400 text-[11px]">v₂' = [(m₂ - e·m₁)v₂ + (1+e)m₁v₁] / (m₁ + m₂)</p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Notice that when m₁ = m₂ and e = 1, the two bodies completely exchange their velocities upon impact.
          </p>
        </div>
      </div>

      {/* Action CTA: Take Concept Quiz */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/40">
        <div>
          <h4 className="text-sm font-bold text-white">Ready to test your collision mechanics knowledge?</h4>
          <p className="text-xs text-slate-400">Complete the 5-question concept assessment to earn XP.</p>
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
