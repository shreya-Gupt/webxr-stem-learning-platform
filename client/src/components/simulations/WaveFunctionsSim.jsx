import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, ArrowRight, Atom, Sparkles } from 'lucide-react';

// 3D Wavefunction & Probability Density Mesh
function QuantumWaveMesh({ quantumN, barrierHeight, wellWidth, displayMode }) {
  // Generate points for ψ(x) and P(x) = |ψ(x)|²
  const { psiPoints, probPoints, potentialPoints } = useMemo(() => {
    const psi = [];
    const prob = [];
    const pot = [];

    const numPoints = 80;
    const halfL = wellWidth / 2;

    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * (wellWidth + 3) - (wellWidth + 3) / 2;

      // Infinite / Finite Well Approximation
      let yPsi = 0;
      let yPot = 0;

      if (x < -halfL || x > halfL) {
        yPot = barrierHeight;
        // Exponential decay in barrier (tunneling tail)
        const decay = Math.exp(-1.8 * (Math.abs(x) - halfL));
        yPsi = Math.sin((quantumN * Math.PI) / 2) * 0.4 * decay;
      } else {
        yPot = 0;
        // Standing wave eigenstate inside well
        const k = (quantumN * Math.PI) / wellWidth;
        yPsi = 1.2 * Math.sin(k * (x + halfL));
      }

      const yProb = yPsi * yPsi * 1.5;

      psi.push(new THREE.Vector3(x, yPsi, 0));
      prob.push(new THREE.Vector3(x, yProb, 0));
      pot.push(new THREE.Vector3(x, yPot, -0.2));
    }

    return { psiPoints: psi, probPoints: prob, potentialPoints: pot };
  }, [quantumN, barrierHeight, wellWidth]);

  return (
    <group>
      <Grid
        position={[0, -0.05, 0]}
        args={[16, 16]}
        cellSize={1}
        cellColor="#1E293B"
        sectionColor="#818CF8"
      />

      {/* Potential Energy Surface / Barrier Walls */}
      <mesh position={[-wellWidth / 2 - 0.75, barrierHeight / 2, 0]}>
        <boxGeometry args={[1.5, barrierHeight, 1]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.35} />
      </mesh>
      <mesh position={[wellWidth / 2 + 0.75, barrierHeight / 2, 0]}>
        <boxGeometry args={[1.5, barrierHeight, 1]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.35} />
      </mesh>

      {/* Wavefunction Line ψ(x) */}
      {(displayMode === 'both' || displayMode === 'psi') && (
        <Line points={psiPoints} color="#00F0FF" lineWidth={3} />
      )}

      {/* Probability Density Line |ψ(x)|² */}
      {(displayMode === 'both' || displayMode === 'prob') && (
        <Line points={probPoints} color="#A855F7" lineWidth={3} />
      )}
    </group>
  );
}

export default function WaveFunctionsSim({ onQuizClick }) {
  const [quantumN, setQuantumN] = useState(2); // Eigenmode: n = 1, 2, 3, 4
  const [barrierHeight, setBarrierHeight] = useState(3.0);
  const [wellWidth, setWellWidth] = useState(5.0);
  const [displayMode, setDisplayMode] = useState('both'); // 'both' | 'psi' | 'prob'

  const numNodes = quantumN - 1;
  const energyLevel = (Math.pow(quantumN, 2) * 1.8).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Mode Controls */}
      <div className="flex flex-wrap items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setDisplayMode('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              displayMode === 'both' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Show Both: ψ(x) & |ψ(x)|²
          </button>
          <button
            onClick={() => setDisplayMode('psi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              displayMode === 'psi' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Wavefunction ψ(x) Only
          </button>
          <button
            onClick={() => setDisplayMode('prob')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              displayMode === 'prob' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Probability Density |ψ(x)|² Only
          </button>
        </div>

        <button
          onClick={() => {
            setQuantumN(2);
            setBarrierHeight(3.0);
            setWellWidth(5.0);
          }}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Main Canvas & Controls Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden bg-[#070A12] border border-slate-800 shadow-2xl">
            <Canvas camera={{ position: [0, 2.5, 8], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, 5, -5]} color="#A855F7" intensity={1} />

              <QuantumWaveMesh
                quantumN={quantumN}
                barrierHeight={barrierHeight}
                wellWidth={wellWidth}
                displayMode={displayMode}
              />

              <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.1} />
            </Canvas>

            {/* Legend Overlay */}
            <div className="absolute top-4 left-4 z-10 flex gap-3 text-[11px] font-mono bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span> ψ(x) Wavefunction
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-0.5 bg-purple-400 inline-block"></span> |ψ(x)|² Probability Density
              </span>
            </div>
          </div>

          {/* Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs">
            <div>
              <p className="text-slate-500 text-[10px] uppercase">Principal Quantum State (n)</p>
              <p className="text-cyan-400 font-bold text-base mt-0.5">n = {quantumN}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase">Quantized Energy (E_n)</p>
              <p className="text-white font-bold text-base mt-0.5">{energyLevel} eV</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase">Internal Nodes</p>
              <p className="text-purple-400 font-bold text-base mt-0.5">{numNodes} nodes</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase">Well Width (L)</p>
              <p className="text-emerald-400 font-bold text-base mt-0.5">{wellWidth} nm</p>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            Quantum Parameters
          </h3>

          {/* Quantum Number */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Quantum State (n)</span>
              <span className="font-mono text-cyan-400">Level {quantumN}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(val => (
                <button
                  key={val}
                  onClick={() => setQuantumN(val)}
                  className={`py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    quantumN === val
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  n = {val}
                </button>
              ))}
            </div>
          </div>

          {/* Barrier Height */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Potential Barrier V₀</span>
              <span className="font-mono text-purple-400">{barrierHeight.toFixed(1)} eV</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="5.0"
              step="0.5"
              value={barrierHeight}
              onChange={(e) => setBarrierHeight(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          {/* Well Width */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Well Width (L)</span>
              <span className="font-mono text-purple-400">{wellWidth} nm</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="8.0"
              step="0.5"
              value={wellWidth}
              onChange={(e) => setWellWidth(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-[11px] text-slate-300 leading-relaxed">
            <p className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Born Interpretation Note
            </p>
            Notice how |ψ(x)|² is always strictly positive, illustrating where an electron has the highest statistical likelihood of detection upon measurement.
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
