"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Text } from "@react-three/drei";
import { useRef } from "react";
import { MathEquation, Fraction } from "../MathEquation";

// 3D Graph Component
function Graph3D({ data, model }: { data: any, model: 'sir' | 'sis' }) {
  const groupRef = useRef<any>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#60a5fa" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />
      
      {/* Grid */}
      <gridHelper args={[10, 20, '#334155', '#1e293b']} />
      
      {/* Axes with labels */}
      <Line points={[[-4, 0, 0], [4, 0, 0]]} color="#64748b" lineWidth={2} />
      <Line points={[[0, 0, 0], [0, 3, 0]]} color="#64748b" lineWidth={2} />
      
      {/* S Line - GREEN */}
      <Line points={data.sPoints} color="#10b981" lineWidth={4} />
      {data.sPoints.map((point: any, i: number) => i % 5 === 0 && (
        <mesh key={`s-${i}`} position={point}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
        </mesh>
      ))}
      
      {/* I Line - RED */}
      <Line points={data.iPoints} color="#ef4444" lineWidth={4} />
      {data.iPoints.map((point: any, i: number) => i % 5 === 0 && (
        <mesh key={`i-${i}`} position={point}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
        </mesh>
      ))}
      
      {/* R Line (SIR only) - BLUE */}
      {model === 'sir' && data.rPoints && (
        <>
          <Line points={data.rPoints} color="#3b82f6" lineWidth={4} />
          {data.rPoints.map((point: any, i: number) => i % 5 === 0 && (
            <mesh key={`r-${i}`} position={point}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </>
      )}
      
      <OrbitControls enableZoom={true} enablePan={false} minDistance={3} maxDistance={12} />
    </group>
  );
}

export default function Slide2Models() {
  const [activeModel, setActiveModel] = useState<'sir' | 'sis'>('sir');
  const [betaSlider, setBetaSlider] = useState(0.0004);
  const [gammaSlider, setGammaSlider] = useState(0.1);

  // Generate authentic epidemic 3D curves using proper SIR/SIS differential equations
  const generate3DData = (beta: number, gamma: number, model: 'sir' | 'sis') => {
    const N = 5000;
    let S = 4950, I = 50, R = 0;
    const sPoints: [number, number, number][] = [];
    const iPoints: [number, number, number][] = [];
    const rPoints: [number, number, number][] = [];
    const dt = 0.1; // Time step for better accuracy
    
    for (let day = 0; day <= 100; day += dt) {
      const x = (day / 100) * 6 - 3;
      
      if (model === 'sir') {
        // SIR Model: dS/dt = -βSI, dI/dt = βSI - γI, dR/dt = γI
        const dS = -beta * S * I * dt;
        const dI = (beta * S * I - gamma * I) * dt;
        const dR = gamma * I * dt;
        
        sPoints.push([x, (S / N) * 3, -0.2]);
        iPoints.push([x, (I / N) * 3, 0]);
        rPoints.push([x, (R / N) * 3, 0.2]);
        
        S += dS;
        I += dI;
        R += dR;
        
        // Prevent negative values
        S = Math.max(0, S);
        I = Math.max(0, I);
        R = Math.max(0, R);
      } else {
        // SIS Model: dS/dt = -βSI + γI, dI/dt = βSI - γI
        const dS = (-beta * S * I + gamma * I) * dt;
        const dI = (beta * S * I - gamma * I) * dt;
        
        sPoints.push([x, (S / N) * 3, -0.15]);
        iPoints.push([x, (I / N) * 3, 0.15]);
        
        S += dS;
        I += dI;
        
        // Prevent negative values
        S = Math.max(0, S);
        I = Math.max(0, Math.min(N, I));
      }
    }
    
    return { sPoints, iPoints, rPoints };
  };

  const graphData = useMemo(() => generate3DData(betaSlider, gammaSlider, activeModel), [betaSlider, gammaSlider, activeModel]);

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Elegant Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="p-3 bg-black/30 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦠</span>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Epidemic Models
            </h1>
          </div>
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => setActiveModel('sir')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeModel === 'sir' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              SIR
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => setActiveModel('sis')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeModel === 'sis' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              SIS
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Split Layout */}
      <div className="flex-1 flex">
        {/* Left Panel - Content */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="w-5/12 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-sm border-r border-white/5"
        >
          {activeModel === 'sir' ? (
            <>
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                <h2 className="text-3xl font-bold text-cyan-300 mb-3">SIR Model - Susceptible-Infected-Recovered</h2>
                <p className="text-lg text-slate-300 leading-relaxed mb-3">
                  The SIR model is a <span className="text-cyan-400 font-semibold">fundamental epidemiological framework</span> that divides a population into three distinct compartments based on disease status. This model assumes that once an individual recovers from the infection, they gain <span className="text-cyan-400 font-semibold">permanent immunity</span> and cannot be reinfected.
                </p>
                <p className="text-sm text-slate-400 mb-2">Flow: S → I → R (unidirectional with immunity)</p>
                <p className="text-sm text-slate-400">
                  <span className="text-cyan-300 font-semibold">Real-world applications:</span> Measles, mumps, rubella, and many computer viruses where patches provide permanent protection. Once a system is patched against a specific vulnerability, it cannot be infected by the same exploit again.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                    <span className="font-semibold text-green-300 text-xl">Susceptible (S)</span>
                  </div>
                  <p className="text-base text-slate-300 leading-relaxed mb-2">
                    Represents <span className="text-green-400 font-semibold">healthy, uninfected systems</span> that are vulnerable to infection. These systems have not yet encountered the malware and lack protective measures (patches, immunity) against it. In cybersecurity, this includes all unpatched systems in a network that are exposed to potential infection vectors.
                  </p>
                  <p className="text-sm text-slate-400 mb-2">
                    <span className="text-green-300 font-semibold">Key characteristics:</span> Can become infected upon contact with infected systems (I), rate of decrease depends on β (transmission rate) and current infection prevalence.
                  </p>
                  <p className="text-xs text-green-400 mt-1 font-mono">📊 Green declining curve on graph - decreases as systems get infected</p>
                </div>
                
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                    <span className="font-semibold text-red-300 text-xl">Infected (I)</span>
                  </div>
                  <p className="text-base text-slate-300 leading-relaxed mb-2">
                    Represents <span className="text-red-400 font-semibold">currently infected systems</span> with active malware spreading capability. These systems are compromised and can transmit the infection to susceptible systems. The infected compartment is the <span className="text-red-400 font-semibold">active transmission source</span> in the epidemic.
                  </p>
                  <p className="text-sm text-slate-400 mb-2">
                    <span className="text-red-300 font-semibold">Dynamics:</span> Increases when susceptible systems get infected (βSI term), decreases when infected systems are cleaned/patched (γI term). The peak represents maximum simultaneous infections - the most critical point requiring maximum security resources.
                  </p>
                  <p className="text-xs text-red-400 mt-1 font-mono">📊 Red curve rises then falls (see peak ⭐) - shows epidemic progression</p>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                    <span className="font-semibold text-blue-300 text-xl">Recovered (R)</span>
                  </div>
                  <p className="text-base text-slate-300 leading-relaxed mb-2">
                    Represents <span className="text-blue-400 font-semibold">systems that have been cleaned and patched</span> with permanent immunity. These systems have undergone malware removal, security patching, and now possess <span className="text-blue-400 font-semibold">permanent protection</span> against reinfection by the same malware strain. They cannot transmit the infection nor become infected again.
                  </p>
                  <p className="text-sm text-slate-400 mb-2">
                    <span className="text-blue-300 font-semibold">Growth mechanism:</span> Fed by the recovery flow (γI term) - the rate at which infected systems are remediated. The final R value represents the total attack surface that was successfully defended through patching and recovery efforts. Higher γ means faster accumulation of immune systems.
                  </p>
                  <p className="text-xs text-blue-400 mt-1 font-mono">📊 Blue curve rises monotonically as infections recover - never decreases</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <h3 className="text-xs font-bold text-purple-300 mb-2">📐 Equations → Graph Curves</h3>
                <div className="space-y-2">
                  <div>
                    <MathEquation className="text-green-300" size="sm">
                      <Fraction numerator={<span>dS</span>} denominator={<span>dt</span>} /> = −βSI
                    </MathEquation>
                    <p className="text-[9px] text-slate-500 mt-0.5">↓ Negative means S decreases (green ↘)</p>
                  </div>
                  <div>
                    <MathEquation className="text-red-300" size="sm">
                      <Fraction numerator={<span>dI</span>} denominator={<span>dt</span>} /> = βSI − γI
                    </MathEquation>
                    <p className="text-[9px] text-slate-500 mt-0.5">↗↘ Rise when βSI &gt; γI, fall otherwise (red curve)</p>
                  </div>
                  <div>
                    <MathEquation className="text-blue-300" size="sm">
                      <Fraction numerator={<span>dR</span>} denominator={<span>dt</span>} /> = γI
                    </MathEquation>
                    <p className="text-[9px] text-slate-500 mt-0.5">↗ Always positive, R grows (blue ↗)</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <h2 className="text-2xl font-bold text-purple-300 mb-3">SIS Model - Susceptible-Infected-Susceptible</h2>
                <p className="text-base text-slate-300 leading-relaxed mb-3">
                  The SIS model represents scenarios where <span className="text-purple-400 font-semibold">recovered individuals can be reinfected</span> - there is <span className="text-purple-400 font-semibold">no lasting immunity</span>. After treatment or recovery, systems return to the susceptible state and remain vulnerable to future infections. This creates a bidirectional flow between S and I compartments.
                </p>
                <p className="text-sm text-slate-400 mb-2">Flow: S ⇄ I (bidirectional, cyclical reinfection)</p>
                <p className="text-sm text-slate-400">
                  <span className="text-purple-300 font-semibold">Real-world applications:</span> Common cold, sexually transmitted diseases, and many types of malware where systems remain vulnerable even after cleanup (zero-day exploits, social engineering attacks, removable media infections). Systems can be repeatedly compromised if the underlying vulnerability persists or users repeat risky behaviors.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                    <span className="font-semibold text-green-300 text-base">Susceptible (S)</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-2">
                    In the SIS model, susceptible systems are <span className="text-green-400 font-semibold">perpetually vulnerable</span> - even after recovery from infection. Unlike SIR, there is no immunity mechanism, so cleaned systems immediately return to the susceptible pool. This represents scenarios where the underlying vulnerability cannot be permanently fixed.
                  </p>
                  <p className="text-xs text-slate-400">
                    <span className="text-green-300 font-semibold">Population dynamics:</span> Decreases via infection (−βSI) but increases via recovery (γI). This bidirectional flow creates an <span className="text-green-400 font-semibold">endemic equilibrium</span> where infections persist indefinitely at a steady state if R₀ &gt; 1.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                    <span className="font-semibold text-red-300 text-base">Infected (I)</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-2">
                    Systems currently infected that can spread malware to susceptible systems. Unlike SIR, cleaned systems <span className="text-red-400 font-semibold">return directly to susceptible state</span> (not to a recovered/immune state), enabling continuous reinfection cycles. This creates a persistent infection reservoir in the population.
                  </p>
                  <p className="text-xs text-slate-400">
                    <span className="text-red-300 font-semibold">Endemic behavior:</span> If R₀ &gt; 1, infections stabilize at an <span className="text-red-400 font-semibold">endemic equilibrium</span> I* = (1 − 1/R₀)N, where a constant fraction of the population remains infected indefinitely. The epidemic never completely dies out, requiring continuous security monitoring and intervention.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <h3 className="text-xs font-bold text-purple-300 mb-2">Differential Equation</h3>
                <MathEquation className="text-pink-300" size="sm">
                  <Fraction numerator={<span>dI</span>} denominator={<span>dt</span>} /> = βI(N − I) − γI
                </MathEquation>
              </div>

              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs font-semibold text-yellow-300 mb-1">⚠️ Endemic State</p>
                <p className="text-xs text-slate-400">Infections persist at equilibrium</p>
              </div>
            </>
          )}

          {/* Interactive Controls */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xs font-bold text-cyan-300 mb-3">Real-time Parameters</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-red-300">β (Infection Rate)</label>
                  <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">{betaSlider.toFixed(4)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.0001" 
                  max="0.0008" 
                  step="0.0001" 
                  value={betaSlider}
                  onChange={(e) => setBetaSlider(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700/50 rounded-full appearance-none cursor-pointer slider"
                  style={{ 
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(betaSlider - 0.0001) / 0.0007 * 100}%, rgba(15, 23, 42, 0.5) ${(betaSlider - 0.0001) / 0.0007 * 100}%, rgba(15, 23, 42, 0.5) 100%)` 
                  }}
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-green-300">γ (Recovery Rate)</label>
                  <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded">{gammaSlider.toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.05" 
                  max="0.3" 
                  step="0.01" 
                  value={gammaSlider}
                  onChange={(e) => setGammaSlider(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700/50 rounded-full appearance-none cursor-pointer slider"
                  style={{ 
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(gammaSlider - 0.05) / 0.25 * 100}%, rgba(15, 23, 42, 0.5) ${(gammaSlider - 0.05) / 0.25 * 100}%, rgba(15, 23, 42, 0.5) 100%)` 
                  }}
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-[10px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-purple-300">Tip:</span> Adjust sliders to see real-time changes in the 3D epidemic curves. Higher β = faster spread, higher γ = faster recovery.
            </p>
          </div>
        </motion.div>

        {/* Right Panel - 3D Visualization */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className="flex-1 relative"
        >
          <div className="absolute top-4 left-4 z-10">
            <div className="p-4 rounded-xl bg-black/90 backdrop-blur-xl border-2 border-cyan-400/30 shadow-2xl max-w-xs">
              <p className="text-base font-bold text-cyan-300 mb-3 flex items-center gap-2">
                <span>📊</span> Live Epidemic Simulation
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                    <span className="text-slate-300 font-medium">Susceptible (S)</span>
                  </div>
                  <span className="text-green-400 font-mono text-xs">Healthy systems</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                    <span className="text-slate-300 font-medium">Infected (I)</span>
                  </div>
                  <span className="text-red-400 font-mono text-xs">Active malware</span>
                </div>
                {activeModel === 'sir' && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                      <span className="text-slate-300 font-medium">Recovered (R)</span>
                    </div>
                    <span className="text-blue-400 font-mono text-xs">Patched + immune</span>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-400">
                <p className="mb-1">✓ Uses Euler method (dt=0.1)</p>
                <p>✓ Solves authentic {activeModel.toUpperCase()} differential equations</p>
              </div>
            </div>
          </div>
          
          <Canvas camera={{ position: [6, 4, 6], fov: 45 }} className="w-full h-full">
            <color attach="background" args={['#020617']} />
            <fog attach="fog" args={['#020617', 8, 20]} />
            <Graph3D data={graphData} model={activeModel} />
          </Canvas>
          
          <div className="absolute bottom-3 right-3 text-xs text-slate-500 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            Drag to rotate • Scroll to zoom
          </div>
        </motion.div>
      </div>
    </div>
  );
}
