import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';

function RotatingShape() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[2, 0]} />
        <meshStandardMaterial
          color="#38BDF8"
          wireframe={false}
          roughness={0.2}
          metalness={0.8}
        />
        {/* Wireframe outer shell */}
        <lineSegments>
          <wireframeGeometry args={[new (require ? undefined : null) || undefined]} />
        </lineSegments>
      </mesh>
    </Float>
  );
}

// Separate clean wireframe overlay
function STEMPolyhedron() {
  const innerRef = useRef();
  const outerRef = useRef();

  useFrame((state, delta) => {
    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.3;
      innerRef.current.rotation.y += delta * 0.4;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x -= delta * 0.2;
      outerRef.current.rotation.y -= delta * 0.25;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.7}>
      <group>
        {/* Central Core */}
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color="#38BDF8"
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* Orbital Wireframe */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshStandardMaterial
            color="#818CF8"
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800 shadow-inner relative">
      <div className="absolute top-3 left-4 z-10 text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800/60 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        Three.js / React Three Fiber Live Canvas
      </div>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} color="#818CF8" intensity={1} />
        <STEMPolyhedron />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
      <div className="absolute bottom-3 right-4 z-10 text-[11px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
        Drag to rotate
      </div>
    </div>
  );
}
