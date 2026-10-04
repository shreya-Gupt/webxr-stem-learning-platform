import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Compass, ArrowRight } from 'lucide-react';

// 3D Canvas for Projectile Motion
function ProjectileMesh({ velocity, angle, gravity, isRunning, onResetRef }) {
  const ballRef = useRef();
  const timeRef = useRef(0);
  const [trail, setTrail] = useState([]);

  const rad = (angle * Math.PI) / 180;
  const vx = velocity * Math.cos(rad);
  const vy = velocity * Math.sin(rad);
  const totalTime = (2 * vy) / gravity;

  useFrame((_, delta) => {
    if (!isRunning || !ballRef.current) return;

    timeRef.current += delta * 1.2;
    const t = timeRef.current;

    if (t <= totalTime) {
      const x = (vx * t) * 0.15 - 4;
      const y = Math.max(0, (vy * t - 0.5 * gravity * t * t) * 0.15);
      ballRef.current.position.set(x, y, 0);

      // Add to trail
      if (Math.floor(t * 30) % 2 === 0) {
        setTrail(prev => [...prev.slice(-40), new THREE.Vector3(x, y, 0)]);
      }
    } else {
      // Loop or pause at end
      timeRef.current = 0;
      setTrail([]);
    }
  });

  return (
    <group>
      {/* Ground Grid */}
      <Grid
        position={[0, 0, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={1}
        cellColor="#1E293B"
        sectionSize={5}
        sectionColor="#38BDF8"
        fadeDistance={25}
      />

      {/* Projectile Sphere */}
      <mesh ref={ballRef} position={[-4, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.6} />
      </mesh>

      {/* Trajectory Trail */}
      {trail.length > 1 && (
        <Line points={trail} color="#38BDF8" lineWidth={2} dashed={false} />
      )}

      {/* Launch Cannon Base */}
      <mesh position={[-4, 0.1, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.2, 16]} />
        <meshStandardMaterial color="#64748B" />
      </mesh>
    </group>
  );
}

// 3D Canvas for Circular Motion
function CircularMesh({ radius, angularVelocity, isRunning }) {
  const ballRef = useRef();
  const arrowRef = useRef();
  const angleRef = useRef(0);

  const scaledRadius = radius * 0.25;

  useFrame((_, delta) => {
    if (!isRunning || !ballRef.current) return;

    angleRef.current += angularVelocity * delta;
    const theta = angleRef.current;

    const x = Math.cos(theta) * scaledRadius;
    const z = Math.sin(theta) * scaledRadius;

    ballRef.current.position.set(x, 0.3, z);
  });

  return (
    <group>
      {/* Central Orbit Anchor */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
        <meshStandardMaterial color="#64748B" />
      </mesh>

      {/* Circular Orbit Path Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[scaledRadius - 0.02, scaledRadius + 0.02, 64]} />
        <meshBasicMaterial color="#38BDF8" opacity={0.4} transparent />
      </mesh>

      {/* Rotating Body */}
      <mesh ref={ballRef} position={[scaledRadius, 0.3, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={0.6} />
      </mesh>

      <Grid
        position={[0, -0.05, 0]}
        args={[16, 16]}
        cellSize={1}
        cellThickness={1}
        cellColor="#1E293B"
        sectionColor="#818CF8"
      />
    </group>
  );
}

export default function ProjectileCircularSim({ onQuizClick }) {
  const [mode, setMode] = useState('projectile'); // 'projectile' | 'circular'
  const [velocity, setVelocity] = useState(25);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.8);
  const [radius, setRadius] = useState(10);
  const [angularVelocity, setAngularVelocity] = useState(3.0);
  const [isRunning, setIsRunning] = useState(true);

  // Calculations for Projectile
  const rad = (angle * Math.PI) / 180;
  const range = ((velocity * velocity * Math.sin(2 * rad)) / gravity).toFixed(1);
  const maxHeight = ((velocity * velocity * Math.pow(Math.sin(rad), 2)) / (2 * gravity)).toFixed(1);
  const flightTime = ((2 * velocity * Math.sin(rad)) / gravity).toFixed(2);

  // Calculations for Circular Motion
  const tangentialVelocity = (radius * angularVelocity).toFixed(1);
  const centripetalAcceleration = (Math.pow(angularVelocity, 2) * radius).toFixed(1);
  const centripetalForce = (1.5 * centripetalAcceleration).toFixed(1); // assuming mass = 1.5 kg

  const handleReset = () => {
    if (mode === 'projectile') {
      setVelocity(25);
      setAngle(45);
      setGravity(9.8);
    } else {
      setRadius(10);
      setAngularVelocity(3.0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('projectile')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'projectile'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Projectile Motion
          </button>
          <button
            onClick={() => setMode('circular')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'circular'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Circular Motion
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1.5"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isRunning ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas & Controls Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D Visualizer Area */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden bg-[#070A12] border border-slate-800 shadow-2xl">
            <Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 15, 10]} intensity={1.5} />
              <pointLight position={[-10, 5, -5]} color="#38BDF8" intensity={1} />

              {mode === 'projectile' ? (
                <ProjectileMesh
                  velocity={velocity}
                  angle={angle}
                  gravity={gravity}
                  isRunning={isRunning}
                />
              ) : (
                <CircularMesh
                  radius={radius}
                  angularVelocity={angularVelocity}
                  isRunning={isRunning}
                />
              )}

              <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.1} />
            </Canvas>

            {/* Canvas Badge */}
            <div className="absolute top-4 left-4 z-10 text-[11px] font-mono text-cyan-300 bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
              Interactive 3D WebGL &bull; Drag to inspect orbit
            </div>
          </div>

          {/* Live Telemetry / Values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs">
            {mode === 'projectile' ? (
              <>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase">Horizontal Range</p>
                  <p className="text-cyan-400 font-bold text-base mt-0.5">{range} m</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase">Max Height</p>
                  <p className="text-white font-bold text-base mt-0.5">{maxHeight} m</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase">Flight Time</p>
                  <p className="text-emerald-400 font-bold text-base mt-0.5">{flightTime} s</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase">Initial Speed</p>
                  <p className="text-purple-400 font-bold text-base mt-0.5">{velocity} m/s</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase">Orbit Radius</p>
                  <p className="text-cyan-400 font-bold text-base mt-0.5">{radius} m</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase">Angular Velocity (ω)</p>
                  <p className="text-purple-400 font-bold text-base mt-0.5">{angularVelocity} rad/s</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase">Tangential Speed (v)</p>
                  <p className="text-emerald-400 font-bold text-base mt-0.5">{tangentialVelocity} m/s</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase">Centripetal Force (Fc)</p>
                  <p className="text-amber-400 font-bold text-base mt-0.5">{centripetalForce} N</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            {mode === 'projectile' ? 'Projectile Variables' : 'Circular Motion Variables'}
          </h3>

          {mode === 'projectile' ? (
            <>
              {/* Velocity */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Launch Velocity (v₀)</span>
                  <span className="font-mono text-cyan-400">{velocity} m/s</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="1"
                  value={velocity}
                  onChange={(e) => setVelocity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Angle */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Launch Angle (θ)</span>
                  <span className="font-mono text-cyan-400">{angle}°</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="85"
                  step="1"
                  value={angle}
                  onChange={(e) => setAngle(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Gravity */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Gravity (g)</span>
                  <span className="font-mono text-cyan-400">{gravity} m/s²</span>
                </div>
                <input
                  type="range"
                  min="1.6"
                  max="20.0"
                  step="0.2"
                  value={gravity}
                  onChange={(e) => setGravity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </>
          ) : (
            <>
              {/* Radius */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Radius (r)</span>
                  <span className="font-mono text-purple-400">{radius} m</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="1"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>

              {/* Angular Velocity */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Angular Velocity (ω)</span>
                  <span className="font-mono text-purple-400">{angularVelocity} rad/s</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8.0"
                  step="0.5"
                  value={angularVelocity}
                  onChange={(e) => setAngularVelocity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
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
