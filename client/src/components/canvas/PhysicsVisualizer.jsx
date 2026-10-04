import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCw, Eye } from 'lucide-react';

// Animated magnetic field lines flowing through the induction ring
function MagneticFieldLines({ isRunning }) {
  const groupRef = useRef();

  // Generate scientific field line curves passing through the induction coil
  const curves = useMemo(() => {
    const list = [];
    const numLines = 14;
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const radius = 1.6 + Math.sin(i * 1.5) * 0.4;
      const height = 3.2;

      // An oval/toroidal loop representing magnetic dipole flux lines
      const points = [];
      const steps = 40;
      for (let j = 0; j <= steps; j++) {
        const t = (j / steps) * Math.PI * 2;
        const x = Math.cos(angle) * (radius * Math.sin(t));
        const y = height * Math.cos(t);
        const z = Math.sin(angle) * (radius * Math.sin(t));
        points.push(new THREE.Vector3(x, y, z));
      }
      list.push(new THREE.CatmullRomCurve3(points, true));
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    if (isRunning && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {curves.map((curve, idx) => (
        <mesh key={idx}>
          <tubeGeometry args={[curve, 40, 0.015, 6, true]} />
          <meshBasicMaterial
            color={idx % 2 === 0 ? '#00F0FF' : '#818CF8'}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// Flowing electrons/charges in the induction ring
function OrbitingCharges({ isRunning }) {
  const particlesRef = useRef();
  const count = 36;

  const [positions, angles] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ang = new Float32Array(count);
    const radius = 2.0;

    for (let i = 0; i < count; i++) {
      ang[i] = (i / count) * Math.PI * 2;
      pos[i * 3] = Math.cos(ang[i]) * radius;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = Math.sin(ang[i]) * radius;
    }
    return [pos, ang];
  }, [count]);

  useFrame((state, delta) => {
    if (!particlesRef.current || !isRunning) return;

    const pos = particlesRef.current.geometry.attributes.position.array;
    const radius = 2.0;

    for (let i = 0; i < count; i++) {
      angles[i] += delta * 1.8;
      pos[i * 3] = Math.cos(angles[i]) * radius;
      pos[i * 3 + 1] = Math.sin(angles[i] * 3) * 0.08;
      pos[i * 3 + 2] = Math.sin(angles[i]) * radius;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#38BDF8"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Induction Ring (Coil) & Core
function InductionApparatus({ isRunning }) {
  const coreRef = useRef();

  useFrame((state, delta) => {
    if (isRunning && coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.15;
    }
  });

  return (
    <group>
      {/* Conducting Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.08, 24, 64]} />
        <meshStandardMaterial
          color="#1E293B"
          metalness={0.9}
          roughness={0.2}
          emissive="#00F0FF"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Center Magnetic Core Cylinder */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 2.8, 32]} />
        <meshStandardMaterial
          color="#0F172A"
          metalness={0.8}
          roughness={0.3}
          wireframe={false}
        />
      </mesh>

      {/* North / South Pole Indicator Rings */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.03, 16, 32]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      <mesh position={[0, -1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.03, 16, 32]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>

      {/* Dynamic Magnetic Field Lines */}
      <MagneticFieldLines isRunning={isRunning} />

      {/* Flowing Induced Current Particles */}
      <OrbitingCharges isRunning={isRunning} />
    </group>
  );
}

export default function PhysicsVisualizer() {
  const [isRunning, setIsRunning] = useState(true);
  const [showVectors, setShowVectors] = useState(true);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] rounded-2xl overflow-hidden glass-panel border border-slate-800/80 shadow-2xl shadow-cyan-950/20 group">
      {/* Top HUD: Live Physics Metadata */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 text-xs font-mono text-cyan-300 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>FARADAY FLUX &bull; &nabla; &times; E = -&part;B/&part;t</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-slate-900/70 px-3 py-1 rounded-md border border-slate-800">
          <span>&Phi;<sub>B</sub> = 2.4 Wb</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">&Epsilon;<sub>ind</sub> = 4.8V</span>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 2.5, 5.5], fov: 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-8, -8, -5]} intensity={1.2} color="#00F0FF" />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#818CF8" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <InductionApparatus isRunning={isRunning} />
        </Float>

        <OrbitControls
          enableZoom={false}
          autoRotate={isRunning}
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>

      {/* Bottom Interactive Controls HUD */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-cyan-500 text-xs font-medium text-slate-200 transition-colors"
            title={isRunning ? "Pause Simulation" : "Play Simulation"}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulate</span>
              </>
            )}
          </button>

          <span className="text-[11px] text-slate-400 hidden sm:inline-block">
            Rotate 360&deg; &bull; Real-time 3D
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-cyan-400/90 font-mono bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          Electromagnetic Induction Lab
        </div>
      </div>
    </div>
  );
}
