"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text, Line, Html } from "@react-three/drei";
import * as THREE from "three";

// 3D Node Component for Map
export function MapNode3D({ 
  position, 
  slideIndex, 
  config, 
  onClick 
}: { 
  position: [number, number, number], 
  slideIndex: number, 
  config: any,
  onClick: () => void 
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  const colorMap: any = {
    "from-rose-400 to-orange-500": "#fb923c",
    "from-blue-400 to-cyan-500": "#06b6d4",
    "from-purple-400 to-pink-500": "#d946ef",
    "from-green-400 to-emerald-500": "#10b981"
  };

  const color = colorMap[config.color] || "#3b82f6";

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group 
        ref={meshRef} 
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Outer Glow Ring */}
        <mesh>
          <torusGeometry args={[1.5, 0.05, 16, 100]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.6}
            toneMapped={false}
          />
        </mesh>

        {/* Main Geometric Shape */}
        <mesh castShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
            metalness={0.8}
            roughness={0.2}
            wireframe
          />
        </mesh>

        {/* Inner Sphere */}
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.5}
            transparent
            opacity={0.3}
            toneMapped={false}
          />
        </mesh>

        {/* Floating Particles Around Node */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 2;
          return (
            <mesh 
              key={i}
              position={[
                Math.cos(angle + Date.now() * 0.001) * radius,
                Math.sin(angle * 2 + Date.now() * 0.001) * 0.5,
                Math.sin(angle + Date.now() * 0.001) * radius
              ]}
            >
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
          );
        })}

        {/* Label */}
        <Html distanceFactor={10} position={[0, -2, 0]} center>
          <div 
            className={`bg-slate-900/90 backdrop-blur-xl px-4 py-2 rounded-xl border-2 transition-all cursor-pointer ${
              hovered ? 'border-white scale-110' : 'border-white/20'
            }`}
            style={{ 
              borderColor: hovered ? color : 'rgba(255,255,255,0.2)',
              boxShadow: hovered ? `0 0 20px ${color}` : 'none'
            }}
          >
            <div className="text-white font-bold text-xl mb-1">{config.icon} {config.title}</div>
            <div className="text-slate-300 text-sm">{config.subtitle}</div>
          </div>
        </Html>
      </group>
    </Float>
  );
}

// Connection Line Between Nodes
export function ConnectionLine({ 
  start, 
  end, 
  color 
}: { 
  start: [number, number, number], 
  end: [number, number, number], 
  color: string 
}) {
  const lineRef = useRef<any>(null);
  
  useFrame((state) => {
    if (lineRef.current) {
      const t = (Math.sin(state.clock.getElapsedTime() * 2) + 1) / 2;
      lineRef.current.material.opacity = 0.3 + t * 0.4;
    }
  });

  // Create curved path between nodes
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(...start),
    new THREE.Vector3(
      (start[0] + end[0]) / 2,
      Math.max(start[1], end[1]) + 2,
      (start[2] + end[2]) / 2
    ),
    new THREE.Vector3(...end)
  ]);

  const points = curve.getPoints(50);

  return (
    <>
      <Line
        ref={lineRef}
        points={points}
        color={color}
        lineWidth={3}
        transparent
        opacity={0.5}
      />
      {/* Traveling particle */}
      <TravelingParticle curve={curve} color={color} />
    </>
  );
}

// Particle traveling along connection line
function TravelingParticle({ curve, color }: { curve: THREE.CatmullRomCurve3, color: string }) {
  const particleRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (particleRef.current) {
      const t = (state.clock.getElapsedTime() * 0.1) % 1;
      const point = curve.getPoint(t);
      particleRef.current.position.copy(point);
    }
  });

  return (
    <mesh ref={particleRef}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.8}
        toneMapped={false}
      />
      <pointLight color={color} intensity={2} distance={3} />
    </mesh>
  );
}
