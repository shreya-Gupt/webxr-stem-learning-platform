import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import PhysicsVisualizer from '../canvas/PhysicsVisualizer';
import { Play, Pause, RotateCcw, Zap, Compass, ArrowRight, Gauge } from 'lucide-react';

// 3D Dipole Electric Field Lines
function ElectricDipoleMesh({ chargeA, chargeB, separation }) {
  const lines = useMemo(() => {
    const list = [];
    const numLines = 16;
    const posA = new THREE.Vector3(-separation / 2, 0, 0);
    const posB = new THREE.Vector3(separation / 2, 0, 0);

    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const points = [];
      const steps = 30;

      for (let j = 0; j <= steps; j++) {
        const t = j / steps;
        // Arc interpolation between positive and negative charges
        const x = THREE.MathUtils.lerp(posA.x, posB.x, t);
        const y = Math.sin(t * Math.PI) * Math.cos(angle) * (1.5 + separation * 0.3);
        const z = Math.sin(t * Math.PI) * Math.sin(angle) * (1.5 + separation * 0.3);
        points.push(new THREE.Vector3(x, y, z));
      }
      list.push(new THREE.CatmullRomCurve3(points));
    }
    return list;
  }, [separation]);

  return (
    <group>
      {/* Positive Charge (Red) */}
      <mesh position={[-separation / 2, 0, 0]}>
        <sphereGeometry args={[0.45 * Math.abs(chargeA), 32, 32]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.5} />
      </mesh>

      {/* Negative Charge (Blue) */}
      <mesh position={[separation / 2, 0, 0]}>
        <sphereGeometry args={[0.45 * Math.abs(chargeB), 32, 32]} />
        <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={0.5} />
      </mesh>

      {/* Field Lines */}
      {lines.map((curve, idx) => (
        <mesh key={idx}>
          <tubeGeometry args={[curve, 30, 0.02, 6, false]} />
          <meshBasicMaterial color="#A855F7" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// 3D Current-Carrying Conductor & Concentric Magnetic Field Lines
function ConductorMagneticMesh({ current }) {
  const circles = useMemo(() => {
    const list = [];
    const radii = [0.8, 1.4, 2.0, 2.7];
    for (let r of radii) {
      list.push(r);
    }
    return list;
  }, []);

  return (
    <group>
      {/* Current-carrying vertical wire */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 6, 32]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Concentric circular magnetic field loops */}
      {circles.map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[r - 0.02, r + 0.02, 64]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={Math.max(0.2, (current / 5) * (1 - i * 0.18))}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ElectricMagneticSim({ onQuizClick }) {
  const [subMode, setSubMode] = useState('induction'); // 'induction' | 'dipole' | 'wire'

  // Induction Parameters
  const [magnetVelocity, setMagnetVelocity] = useState(2.5);
  const [coilTurns, setCoilTurns] = useState(6);
  const [magnetStrength, setMagnetStrength] = useState(1.5);
  const [direction, setDirection] = useState(1);

  // Field Parameters
  const [chargeA, setChargeA] = useState(1.0);
  const [chargeB, setChargeB] = useState(-1.0);
  const [separation, setSeparation] = useState(3.0);
  const [current, setCurrent] = useState(4.0);

  // Computed EMF = -N (dPhi/dt) ~ -N * strength * velocity * direction
  const inducedEmf = (coilTurns * magnetStrength * magnetVelocity * 0.5 * direction).toFixed(2);
  const galvanometerDeflection = Math.min(100, Math.max(-100, inducedEmf * 8));

  return (
    <div className="space-y-6">
      {/* Submode Switcher */}
      <div className="flex flex-wrap items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSubMode('induction')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              subMode === 'induction'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Electromagnetic Induction (Faraday)
          </button>
          <button
            onClick={() => setSubMode('dipole')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              subMode === 'dipole'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Electric Dipole Field
          </button>
          <button
            onClick={() => setSubMode('wire')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              subMode === 'wire'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Current-Carrying Wire (B-Field)
          </button>
        </div>

        <button
          onClick={() => {
            setMagnetVelocity(2.5);
            setCoilTurns(6);
            setMagnetStrength(1.5);
            setDirection(1);
          }}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Main Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visualizer Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden bg-[#070A12] border border-slate-800 shadow-2xl">
            {subMode === 'induction' ? (
              <PhysicsVisualizer />
            ) : (
              <Canvas camera={{ position: [0, 3, 7], fov: 45 }}>
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 10, 10]} intensity={1.2} />
                <pointLight position={[-10, -5, -5]} color="#00F0FF" intensity={1} />

                {subMode === 'dipole' ? (
                  <ElectricDipoleMesh
                    chargeA={chargeA}
                    chargeB={chargeB}
                    separation={separation}
                  />
                ) : (
                  <ConductorMagneticMesh current={current} />
                )}

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
              </Canvas>
            )}
          </div>

          {/* Galvanometer & Live Values */}
          {subMode === 'induction' ? (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-slate-400 text-[10px] uppercase">Galvanometer Needle</p>
                  <div className="w-44 h-3 bg-slate-950 rounded-full border border-slate-700 relative mt-1 overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 w-2 bg-cyan-400 rounded-full transition-all duration-150"
                      style={{ left: `calc(50% + ${galvanometerDeflection * 0.4}%)` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-500 text-[10px] block">Induced EMF (ℰ)</span>
                  <span className="text-emerald-400 font-bold text-base">{inducedEmf} V</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Current Flow</span>
                  <span className="text-cyan-400 font-bold text-base">
                    {direction === 1 ? 'Counter-Clockwise' : 'Clockwise'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div>
                <p className="text-slate-500 text-[10px] uppercase">Field Strength</p>
                <p className="text-cyan-400 font-bold text-base mt-0.5">
                  {subMode === 'dipole' ? `${(1.2 * separation).toFixed(2)} N/C` : `${(current * 0.8).toFixed(2)} μT`}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase">Force Nature</p>
                <p className="text-purple-400 font-bold text-base mt-0.5">
                  {subMode === 'dipole' ? 'Attractive (+ and -)' : 'Orthogonal Torque'}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase">Field Symmetry</p>
                <p className="text-emerald-400 font-bold text-base mt-0.5">
                  {subMode === 'dipole' ? 'Axisymmetric' : 'Cylindrical'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            {subMode === 'induction' ? 'Induction Parameters' : 'Field Parameters'}
          </h3>

          {subMode === 'induction' ? (
            <>
              {/* Velocity */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Magnet Velocity</span>
                  <span className="font-mono text-cyan-400">{magnetVelocity} m/s</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="6.0"
                  step="0.5"
                  value={magnetVelocity}
                  onChange={(e) => setMagnetVelocity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Coil Turns */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Coil Turns (N)</span>
                  <span className="font-mono text-cyan-400">{coilTurns}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={coilTurns}
                  onChange={(e) => setCoilTurns(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Magnet Direction Toggle */}
              <div>
                <span className="text-xs text-slate-300 block mb-1.5">Magnet Direction</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDirection(1)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono transition-all ${
                      direction === 1 ? 'bg-cyan-500 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    North Inward (+v)
                  </button>
                  <button
                    onClick={() => setDirection(-1)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono transition-all ${
                      direction === -1 ? 'bg-cyan-500 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    North Outward (-v)
                  </button>
                </div>
              </div>
            </>
          ) : subMode === 'dipole' ? (
            <>
              {/* Separation */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Charge Separation</span>
                  <span className="font-mono text-purple-400">{separation} m</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="5.0"
                  step="0.5"
                  value={separation}
                  onChange={(e) => setSeparation(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>
            </>
          ) : (
            <>
              {/* Current */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Conductor Current (I)</span>
                  <span className="font-mono text-amber-400">{current} A</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={current}
                  onChange={(e) => setCurrent(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </>
          )}

          {/* Action to Quiz */}
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
