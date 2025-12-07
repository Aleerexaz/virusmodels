"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, Trail } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useMemo, ReactNode, ReactElement } from "react";
import * as THREE from "three";

type SceneVariant =
  | "scenario"
  | "vectors"
  | "questions"
  | "math"
  | "defense";

const baseCamera = { position: [0, 0, 8] as [number, number, number], fov: 45 };

function SceneContainer({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-3xl h-full min-h-104 w-full overflow-hidden border border-white/10 bg-slate-950/70 shadow-[0_0_60px_rgba(15,23,42,0.7)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[30px_30px] opacity-30 mix-blend-overlay" />
      <Canvas
        camera={baseCamera}
        gl={{ antialias: true, alpha: true }}
        className="absolute inset-0 h-full! w-full!"
        style={{ height: "100%", width: "100%" }}
      >
        <color attach="background" args={["#010718"]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 12, 10]} intensity={1} color="#60a5fa" />
        <pointLight position={[-12, -6, -10]} intensity={0.5} color="#f472b6" />
        <spotLight position={[0, 8, 6]} angle={0.6} penumbra={0.5} intensity={0.8} color="#38bdf8" />
        {children}
      </Canvas>
      <div className="pointer-events-none absolute inset-x-8 bottom-8 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );
}

function VirusCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.05;
      coreRef.current.scale.set(scale, scale, scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
    }
  });
  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={1.5} roughness={0.2} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.04, 32, 128]} />
        <meshStandardMaterial color="#fb7185" emissive="#fb7185" emissiveIntensity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 32, 128]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function NetworkNode({ position, delay }: { position: [number, number, number]; delay: number }) {
  const nodeRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (nodeRef.current) {
      const pulse = 0.4 + Math.abs(Math.sin(state.clock.elapsedTime * 1.5 + delay)) * 0.6;
      nodeRef.current.scale.setScalar(0.6 + pulse * 0.2);
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={nodeRef} position={position}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.9} roughness={0.3} />
      </mesh>
    </Float>
  );
}

function OrbitingPacket({
  radius,
  speed,
  height,
  color,
}: {
  radius: number;
  speed: number;
  height: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.set(Math.cos(t) * radius, height + Math.sin(t * 2) * 0.3, Math.sin(t) * radius);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} />
      <Trail width={2} length={8} color={new THREE.Color(color)} attenuation={(t) => t * t}>
        <meshBasicMaterial />
      </Trail>
    </mesh>
  );
}

function ParticleField() {
  const particles = useMemo(
    () =>
      new Array(60).fill(0).map(() => ({
        basePosition: [
          (Math.random() - 0.5) * 6,
          Math.random() * 3 - 1,
          (Math.random() - 0.5) * 6,
        ] as [number, number, number],
        size: 0.02 + Math.random() * 0.06,
        speed: 0.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );
  const groupRef = useRef<THREE.Group>(null);
  const refs = useRef<Array<THREE.Mesh | null>>([]);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.04;
    }
    refs.current.forEach((mesh, idx) => {
      if (mesh) {
        const config = particles[idx];
        mesh.position.y =
          config.basePosition[1] + Math.sin(state.clock.elapsedTime * config.speed + config.phase) * 0.2;
      }
    });
  });
  return (
    <group ref={groupRef}>
      {particles.map((particle, idx) => (
        <mesh
          key={`particle-${idx}`}
          position={particle.basePosition}
          ref={(el) => {
            refs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={0.3} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function NetworkGrid() {
  const gridRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>>(null);
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });
  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[10, 6, 30, 18]} />
      <meshStandardMaterial
        color="#0ea5e9"
        wireframe
        transparent
        opacity={0.55}
        emissive="#0ea5e9"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function ScenarioScene() {
  const nodes = useMemo(
    () =>
      new Array(10).fill(0).map((_, idx) => ({
        position: [
          Math.cos((idx / 10) * Math.PI * 2) * 3,
          Math.sin((idx / 10) * Math.PI * 2) * 1.2,
          Math.sin((idx / 10) * Math.PI * 2) * 0.8,
        ] as [number, number, number],
        delay: idx * 0.3,
      })),
    [],
  );

  return (
    <SceneContainer>
      <ParticleField />
      <NetworkGrid />
      <VirusCore />
      {nodes.map((node, idx) => (
        <NetworkNode key={`node-${idx}`} position={node.position} delay={node.delay} />
      ))}
      <OrbitingPacket radius={2.8} height={0.6} speed={0.8} color="#fb7185" />
      <OrbitingPacket radius={3.4} height={-0.2} speed={0.6} color="#34d399" />
      <OrbitingPacket radius={2.2} height={0.1} speed={1} color="#facc15" />
    </SceneContainer>
  );
}

function VectorsScene() {
  const packets = useMemo(() => {
    return new Array(6).fill(0).map((_, i) => ({
      start: new THREE.Vector3(Math.cos((i / 6) * Math.PI * 2) * 2, Math.sin((i / 6) * Math.PI * 2) * 2, -1),
      end: new THREE.Vector3(0, 0, 0),
      speed: 0.4 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <SceneContainer>
      <Float speed={1.5} rotationIntensity={0.1}>
        <mesh>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial color="#38bdf8" wireframe />
        </mesh>
      </Float>
      {packets.map((packet, idx) => (
        <Packet key={idx} {...packet} />
      ))}
    </SceneContainer>
  );
}

function Packet({
  start,
  end,
  speed,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = ((state.clock.elapsedTime * speed) % 1);
      ref.current.position.copy(start.clone().lerp(end, t));
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={2} />
      <Trail width={2} length={6} color={new THREE.Color("#f97316")} attenuation={(t) => t * t}>
        <meshBasicMaterial />
      </Trail>
    </mesh>
  );
}

function QuestionsScene() {
  const questionRefs = useMemo(() => new Array(3).fill(0), []);
  return (
    <SceneContainer>
      {questionRefs.map((_, idx) => (
        <Float
          key={idx}
          speed={1 + idx}
          rotationIntensity={0.2}
          floatIntensity={1}
        >
          <Text
            position={[Math.cos(idx * 2) * 2, Math.sin(idx * 2) * 1.5, 0]}
            fontSize={1.5}
            color="#c084fc"
          >
            ?
          </Text>
        </Float>
      ))}
    </SceneContainer>
  );
}

function MathPlane() {
  const planeRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (planeRef.current) {
      planeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });
  return (
    <>
      <Float speed={1} floatIntensity={0.5}>
        <mesh ref={planeRef}>
          <planeGeometry args={[6, 3]} />
          <meshStandardMaterial color="#1d4ed8" emissive="#1d4ed8" emissiveIntensity={0.8} transparent opacity={0.5} />
        </mesh>
      </Float>
      <Float speed={1.2} floatIntensity={0.4}>
        <Text position={[0, 0, 0.2]} fontSize={0.8} color="#e0f2fe">
          dI/dt = βSI - γI
        </Text>
      </Float>
    </>
  );
}

function MathScene() {
  return (
    <SceneContainer>
      <MathPlane />
    </SceneContainer>
  );
}

function DefenseCore() {
  const shieldRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (shieldRef.current) {
      shieldRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  return (
    <>
      <Float speed={1.5} floatIntensity={1}>
        <mesh ref={shieldRef}>
          <torusGeometry args={[2, 0.2, 16, 100]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.5} />
        </mesh>
      </Float>
      <Float speed={2} floatIntensity={1}>
        <mesh>
          <sphereGeometry args={[0.8, 64, 64]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.4} transparent opacity={0.5} />
        </mesh>
      </Float>
    </>
  );
}

function DefenseScene() {
  return (
    <SceneContainer>
      <DefenseCore />
    </SceneContainer>
  );
}

const sceneMap: Record<SceneVariant, () => ReactElement> = {
  scenario: ScenarioScene,
  vectors: VectorsScene,
  questions: QuestionsScene,
  math: MathScene,
  defense: DefenseScene,
};

export function SlideScene({ variant }: { variant: SceneVariant }) {
  const SceneComponent = sceneMap[variant];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={variant}
        className="h-full"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SceneComponent />
      </motion.div>
    </AnimatePresence>
  );
}

