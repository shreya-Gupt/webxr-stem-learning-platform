import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Play, RotateCcw, ArrowRight, Compass, Sparkles, Binary, CheckCircle2 } from 'lucide-react';

// Custom 3D Vector Arrow Mesh (cylinder shaft + cone tip)
function VectorArrow({ start = [0, 0, 0], end = [0, 1, 0], color = '#00F0FF', radius = 0.08, headLength = 0.5, headRadius = 0.2 }) {
  const dir = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const d = e.clone().sub(s);
    const len = d.length();
    return { dir: d.normalize(), length: len };
  }, [start, end]);

  if (dir.length < 0.05) return null;

  const shaftLength = Math.max(0.01, dir.length - headLength);
  const midPoint = new THREE.Vector3(...start).add(dir.dir.clone().multiplyScalar(shaftLength / 2));
  const headPos = new THREE.Vector3(...start).add(dir.dir.clone().multiplyScalar(shaftLength + headLength / 2));

  // Compute orientation quaternion
  const up = new THREE.Vector3(0, 1, 0);
  const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.dir);

  return (
    <group>
      {/* Shaft */}
      <mesh position={midPoint.toArray()} quaternion={quat}>
        <cylinderGeometry args={[radius, radius, shaftLength, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {/* Arrowhead */}
      <mesh position={headPos.toArray()} quaternion={quat}>
        <coneGeometry args={[headRadius, headLength, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function Vectors3DSim({ onQuizClick }) {
  // Vector A components
  const [ax, setAx] = useState(3);
  const [ay, setAy] = useState(2);
  const [az, setAz] = useState(1);

  // Vector B components
  const [bx, setBx] = useState(1);
  const [by, setBy] = useState(4);
  const [bz, setBz] = useState(-2);

  // Operation mode
  const [operation, setOperation] = useState('add'); // 'add' | 'subtract' | 'cross' | 'dot'

  // Exact calculations
  const magA = Math.sqrt(ax * ax + ay * ay + az * az);
  const magB = Math.sqrt(bx * bx + by * by + bz * bz);

  const dotProduct = ax * bx + ay * by + az * bz;
  const cosTheta = magA > 0 && magB > 0 ? Math.max(-1, Math.min(1, dotProduct / (magA * magB))) : 1;
  const angleDeg = (Math.acos(cosTheta) * (180 / Math.PI)).toFixed(1);

  // Cross Product: A × B
  const crossX = ay * bz - az * by;
  const crossY = az * bx - ax * bz;
  const crossZ = ax * by - ay * bx;
  const magCross = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);

  // Resultant vector coordinates based on chosen operation
  const resultant = useMemo(() => {
    if (operation === 'add') {
      return [ax + bx, ay + by, az + bz];
    } else if (operation === 'subtract') {
      return [ax - bx, ay - by, az - bz];
    } else if (operation === 'cross') {
      // Scale down if too large for viewport
      const scale = magCross > 8 ? 8 / magCross : 1;
      return [crossX * scale, crossY * scale, crossZ * scale];
    }
    return [0, 0, 0];
  }, [operation, ax, ay, az, bx, by, bz, crossX, crossY, crossZ, magCross]);

  const magResultant = Math.sqrt(
    resultant[0] * resultant[0] + resultant[1] * resultant[1] + resultant[2] * resultant[2]
  );

  const handleReset = () => {
    setAx(3); setAy(2); setAz(1);
    setBx(1); setBy(4); setBz(-2);
    setOperation('add');
  };

  return (
    <div className="space-y-6">
      {/* Operation Ribbon */}
      <div className="flex flex-wrap items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Operation:</span>
          <button
            onClick={() => setOperation('add')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              operation === 'add'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Addition (A + B)
          </button>
          <button
            onClick={() => setOperation('subtract')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              operation === 'subtract'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Subtraction (A - B)
          </button>
          <button
            onClick={() => setOperation('dot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              operation === 'dot'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Dot Product (A · B)
          </button>
          <button
            onClick={() => setOperation('cross')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              operation === 'cross'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Cross Product (A × B)
          </button>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Vectors</span>
        </button>
      </div>

      {/* Main 3D Coordinate Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D Coordinate Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full h-[420px] sm:h-[460px] rounded-2xl overflow-hidden bg-[#070A12] border border-slate-800 shadow-2xl">
            <Canvas camera={{ position: [9, 8, 12], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 10, 10]} intensity={1.2} />
              <pointLight position={[-10, -5, -5]} color="#00F0FF" intensity={0.8} />

              {/* Floor Reference Grid */}
              <Grid
                position={[0, 0, 0]}
                args={[20, 20]}
                cellSize={1}
                cellColor="#1E293B"
                sectionColor="#334155"
              />

              {/* XYZ Coordinate Axes */}
              <VectorArrow start={[0, 0, 0]} end={[8, 0, 0]} color="#EF4444" radius={0.03} headLength={0.4} headRadius={0.12} />
              <VectorArrow start={[0, 0, 0]} end={[0, 8, 0]} color="#10B981" radius={0.03} headLength={0.4} headRadius={0.12} />
              <VectorArrow start={[0, 0, 0]} end={[0, 0, 8]} color="#3B82F6" radius={0.03} headLength={0.4} headRadius={0.12} />

              {/* Vector A (Cyan) */}
              <VectorArrow start={[0, 0, 0]} end={[ax, ay, az]} color="#00F0FF" radius={0.09} headLength={0.6} headRadius={0.22} />

              {/* Vector B (Purple) */}
              <VectorArrow
                start={operation === 'add' ? [ax, ay, az] : [0, 0, 0]}
                end={operation === 'add' ? [ax + bx, ay + by, az + bz] : [bx, by, bz]}
                color="#A855F7"
                radius={0.09}
                headLength={0.6}
                headRadius={0.22}
              />

              {/* Resultant Vector (Emerald / Amber) */}
              {operation !== 'dot' && (
                <VectorArrow
                  start={[0, 0, 0]}
                  end={resultant}
                  color={operation === 'add' ? '#10B981' : operation === 'subtract' ? '#F59E0B' : '#EC4899'}
                  radius={0.11}
                  headLength={0.7}
                  headRadius={0.26}
                />
              )}

              <OrbitControls enableZoom={true} />
            </Canvas>

            {/* Legend Badge */}
            <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-cyan-400 rounded-full" />
                <span className="text-white">Vector A ({ax}, {ay}, {az})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-purple-400 rounded-full" />
                <span className="text-white">Vector B ({bx}, {by}, {bz})</span>
              </div>
              {operation !== 'dot' && (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-emerald-400 rounded-full" />
                  <span className="text-emerald-300">
                    Resultant ({resultant[0].toFixed(1)}, {resultant[1].toFixed(1)}, {resultant[2].toFixed(1)})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Calculated Values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Magnitude |A|</p>
              <p className="text-cyan-300 font-bold text-base mt-1">{magA.toFixed(2)}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">√(Ax² + Ay² + Az²)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Magnitude |B|</p>
              <p className="text-purple-300 font-bold text-base mt-1">{magB.toFixed(2)}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">√(Bx² + By² + Bz²)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Dot Product (A · B)</p>
              <p className="text-white font-bold text-base mt-1">{dotProduct.toFixed(2)}</p>
              <p className="text-[10px] text-emerald-400 mt-0.5">Angle θ = {angleDeg}°</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Cross Product |A × B|</p>
              <p className="text-pink-400 font-bold text-base mt-1">{magCross.toFixed(2)}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Parallelogram Area</p>
            </div>
          </div>
        </div>

        {/* Right: Component Parameter Sliders */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Vector Sliders</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">Euclidean ℝ³</span>
          </div>

          {/* Vector A Sliders */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-cyan-300">Vector A Components</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Ax (X-axis)</span>
                <span className="text-cyan-400">{ax}</span>
              </div>
              <input
                type="range" min="-6" max="6" step="1" value={ax}
                onChange={(e) => setAx(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Ay (Y-axis)</span>
                <span className="text-cyan-400">{ay}</span>
              </div>
              <input
                type="range" min="-6" max="6" step="1" value={ay}
                onChange={(e) => setAy(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Az (Z-axis)</span>
                <span className="text-cyan-400">{az}</span>
              </div>
              <input
                type="range" min="-6" max="6" step="1" value={az}
                onChange={(e) => setAz(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* Vector B Sliders */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <p className="text-xs font-bold text-purple-300">Vector B Components</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Bx (X-axis)</span>
                <span className="text-purple-400">{bx}</span>
              </div>
              <input
                type="range" min="-6" max="6" step="1" value={bx}
                onChange={(e) => setBx(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">By (Y-axis)</span>
                <span className="text-purple-400">{by}</span>
              </div>
              <input
                type="range" min="-6" max="6" step="1" value={by}
                onChange={(e) => setBy(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Bz (Z-axis)</span>
                <span className="text-purple-400">{bz}</span>
              </div>
              <input
                type="range" min="-6" max="6" step="1" value={bz}
                onChange={(e) => setBz(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>

          {/* Equations Preview Box */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
            <p className="text-[10px] text-slate-500 uppercase">Cross Product Vector</p>
            <p className="text-pink-400">
              A × B = ({crossX}, {crossY}, {crossZ})
            </p>
          </div>
        </div>
      </div>

      {/* Educational Explanation & Mathematical Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Scalar (Dot) Product Principles
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The dot product produces a scalar value that quantifies how much two vectors point in the same direction:
          </p>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800">
            A · B = AxBx + AyBy + AzBz = |A||B| cos(θ)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            If A · B = 0, the two vectors are strictly orthogonal (perpendicular). If positive, they share an acute angle (&lt; 90°); if negative, an obtuse angle (&gt; 90°).
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Binary className="w-4 h-4 text-purple-400" />
            Vector (Cross) Product Mechanics
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The cross product yields a 3D vector perpendicular to both vectors, governed by the right-hand rule:
          </p>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-purple-300 border border-slate-800">
            A × B = (AyBz - AzBy)î - (AxBz - AzBx)ĵ + (AxBy - AyBx)k̂
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The magnitude |A × B| = |A||B| sin(θ) physically corresponds to the area of the parallelogram spanned by the two vectors.
          </p>
        </div>
      </div>

      {/* Action CTA: Take Concept Quiz */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/40">
        <div>
          <h4 className="text-sm font-bold text-white">Understand 3D vector linear algebra?</h4>
          <p className="text-xs text-slate-400">Take the 5-question 3D Vector quiz to test your analytical mastery.</p>
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
