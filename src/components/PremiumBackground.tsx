"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Trail } from "@react-three/drei";
import * as THREE from "three";

function NetworkNode({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle breathing animation
      const t = state.clock.getElapsedTime();
      meshRef.current.scale.setScalar(scale + Math.sin(t * 2 + position[0]) * 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function ConnectingLines({ count = 10 }) {
  const lines = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      start: [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 5 - 5] as [number, number, number],
      end: [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 5 - 5] as [number, number, number],
      speed: Math.random() * 0.5 + 0.1
    }));
  }, [count]);

  return (
    <group>
      {lines.map((line, i) => (
        <MovingPacket key={i} {...line} />
      ))}
    </group>
  );
}

function MovingPacket({ start, end, speed }: { start: [number, number, number], end: [number, number, number], speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = (state.clock.getElapsedTime() * speed) % 1;
      ref.current.position.x = THREE.MathUtils.lerp(start[0], end[0], t);
      ref.current.position.y = THREE.MathUtils.lerp(start[1], end[1], t);
      ref.current.position.z = THREE.MathUtils.lerp(start[2], end[2], t);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05]} />
      <meshBasicMaterial color="#60a5fa" />
      <Trail width={2} length={8} color={new THREE.Color("#3b82f6")} attenuation={(t) => t * t}>
        <meshBasicMaterial color="#3b82f6" />
      </Trail>
    </mesh>
  );
}

export default function PremiumBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <fog attach="fog" args={['#020617', 5, 20]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <group>
          <NetworkNode position={[-4, 2, 0]} color="#3b82f6" scale={1.5} /> {/* Blue Node */}
          <NetworkNode position={[4, -2, -2]} color="#ef4444" scale={1.2} /> {/* Red Node */}
          <NetworkNode position={[0, 3, -5]} color="#22c55e" scale={1} />   {/* Green Node */}
          <ConnectingLines count={15} />
        </group>
      </Canvas>
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950/90 backdrop-blur-[1px]" />
    </div>
  );
}

