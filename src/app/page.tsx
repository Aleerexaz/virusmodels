"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { MapNode3D, ConnectionLine } from "@/components/Map3DComponents";

// Dynamic imports
const PremiumBackground = dynamic(() => import("@/components/PremiumBackground"), { ssr: false });
const Slide1Introduction = dynamic(() => import("@/components/slides/Slide1Introduction"), { ssr: false });
const Slide2Models = dynamic(() => import("@/components/slides/Slide2Models_new"), { ssr: false });
const Slide3ODETerms = dynamic(() => import("@/components/slides/Slide3ODETerms"), { ssr: false });
const Slide4Predictions = dynamic(() => import("@/components/slides/Slide4Predictions"), { ssr: false });

// Configuration for slides
const SLIDE_CONFIG = [
  { 
    id: "intro", 
    component: Slide1Introduction, 
    title: "The Virus Outbreak", 
    subtitle: "Understanding the Digital Epidemic",
    icon: "🦠",
    color: "from-rose-400 to-orange-500",
    position: { x: 20, y: 60 }
  },
  { 
    id: "models", 
    component: Slide2Models, 
    title: "Mathematical Models", 
    subtitle: "SIR & SIS Frameworks",
    icon: "📊",
    color: "from-blue-400 to-cyan-500",
    position: { x: 40, y: 35 }
  },
  { 
    id: "ode", 
    component: Slide3ODETerms, 
    title: "Understanding Parameters", 
    subtitle: "β, γ and Real Networks",
    icon: "⚙️",
    color: "from-purple-400 to-pink-500",
    position: { x: 60, y: 60 }
  },
  { 
    id: "predict", 
    component: Slide4Predictions, 
    title: "Predictions & Defense", 
    subtitle: "R₀ and Security Strategy",
    icon: "🛡️",
    color: "from-green-400 to-emerald-500",
    position: { x: 80, y: 35 }
  },
];

export default function Home() {
  const [selectedSlide, setSelectedSlide] = useState<number | null>(null);
  const [isMapView, setIsMapView] = useState(true);


  const handleBackToMap = () => {
    setSelectedSlide(null);
    setIsMapView(true);
  };

  const handleSlideSelect = (index: number) => {
    setSelectedSlide(index);
    setIsMapView(false);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      
      {/* 3D Background Layer */}
      <PremiumBackground />

      {/* Map View - Full 3D Digital Interface */}
      {isMapView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative z-10 w-full h-full"
        >
          {/* Title Overlay */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-6 left-0 right-0 text-center z-20 pointer-events-none"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl">
              Mathematical World of Virus Modeling
            </h1>
            <p className="text-lg text-cyan-200 max-w-3xl mx-auto font-medium drop-shadow-lg">
              Navigate the 3D digital realm where mathematics meets cybersecurity
            </p>
          </motion.div>

          {/* 3D Map Canvas */}
          <Canvas 
            camera={{ position: [0, 5, 18], fov: 50 }}
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, #1e293b 0%, #020617 100%)' }}
          >
            <color attach="background" args={['#020617']} />
            <fog attach="fog" args={['#020617', 15, 35]} />
            
            {/* Enhanced Lighting */}
            <ambientLight intensity={0.4} />
            <pointLight position={[15, 15, 10]} intensity={1.5} color="#3b82f6" />
            <pointLight position={[-15, 15, -10]} intensity={1.5} color="#a855f7" />
            <pointLight position={[0, 10, 15]} intensity={1} color="#06b6d4" />
            <spotLight position={[0, 20, 0]} intensity={0.5} angle={0.6} penumbra={1} color="#ffffff" />
            
            {/* Background Stars */}
            <Stars radius={150} depth={60} count={5000} factor={3} saturation={0} fade speed={0.5} />
            
            {/* Grid Floor - Lower and larger */}
            <gridHelper args={[60, 60, '#1e3a8a', '#0f172a']} position={[0, -5, 0]} />
            
            {/* 3D Network Nodes - Better spacing in a curved path */}
            <MapNode3D 
              position={[-10, 1, 0]} 
              slideIndex={0} 
              config={SLIDE_CONFIG[0]}
              onClick={() => handleSlideSelect(0)}
            />
            <MapNode3D 
              position={[-3, 2, -3]} 
              slideIndex={1} 
              config={SLIDE_CONFIG[1]}
              onClick={() => handleSlideSelect(1)}
            />
            <MapNode3D 
              position={[3, 1.5, -2]} 
              slideIndex={2} 
              config={SLIDE_CONFIG[2]}
              onClick={() => handleSlideSelect(2)}
            />
            <MapNode3D 
              position={[10, 0.5, 0]} 
              slideIndex={3} 
              config={SLIDE_CONFIG[3]}
              onClick={() => handleSlideSelect(3)}
            />
            
            {/* Connecting Lines Between Nodes */}
            <ConnectionLine start={[-10, 1, 0]} end={[-3, 2, -3]} color="#f87171" />
            <ConnectionLine start={[-3, 2, -3]} end={[3, 1.5, -2]} color="#3b82f6" />
            <ConnectionLine start={[3, 1.5, -2]} end={[10, 0.5, 0]} color="#10b981" />
            
            {/* Camera Controls */}
            <OrbitControls 
              enableZoom={true} 
              enablePan={true} 
              minDistance={12} 
              maxDistance={30}
              maxPolarAngle={Math.PI / 2.2}
              autoRotate={true}
              autoRotateSpeed={0.5}
            />
          </Canvas>

          {/* Instructions Overlay */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-12 left-0 right-0 z-20 pointer-events-none"
          >
            <div className="flex justify-center gap-8 text-cyan-300">
              <div className="flex items-center gap-3 bg-slate-950/70 backdrop-blur-xl px-6 py-3 rounded-full border border-cyan-500/30">
                <span className="text-3xl">🔄</span>
                <span className="text-lg font-medium">Drag to rotate</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-950/70 backdrop-blur-xl px-6 py-3 rounded-full border border-purple-500/30">
                <span className="text-3xl">🔍</span>
                <span className="text-lg font-medium">Scroll to zoom</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-950/70 backdrop-blur-xl px-6 py-3 rounded-full border border-blue-500/30">
                <span className="text-3xl">👆</span>
                <span className="text-lg font-medium">Click nodes to explore</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Slide Content View */}
      {!isMapView && selectedSlide !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 w-full h-full"
        >
          {/* Back Button - Moved to bottom-left corner */}
          <motion.button
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            onClick={handleBackToMap}
            className="absolute bottom-8 left-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-800/95 border-2 border-cyan-400/50 hover:border-cyan-400 backdrop-blur-xl transition-all shadow-2xl shadow-cyan-500/20 text-sm"
          >
            <span className="text-xl">🗺️</span>
            <span className="font-semibold">Back to Map</span>
          </motion.button>

          {/* Slide Component */}
          {(() => {
            const ActiveComponent = SLIDE_CONFIG[selectedSlide].component;
            return <ActiveComponent />;
          })()}

          {/* Navigation Arrows */}
          <div className="absolute bottom-8 right-8 z-50 flex gap-4">
            {selectedSlide > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedSlide(selectedSlide - 1)}
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur flex items-center justify-center transition-all"
              >
                <span className="text-2xl">←</span>
              </motion.button>
            )}
            {selectedSlide < SLIDE_CONFIG.length - 1 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedSlide(selectedSlide + 1)}
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur flex items-center justify-center transition-all"
              >
                <span className="text-2xl">→</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </main>
  );
}
