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
      
      {/* S Line */}
      <Line points={data.sPoints} color="#10b981" lineWidth={4} />
      {data.sPoints.map((point: any, i: number) => i % 5 === 0 && (
        <mesh key={`s-${i}`} position={point}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
        </mesh>
      ))}
      
      {/* I Line */}
      <Line points={data.iPoints} color="#ef4444" lineWidth={4} />
      {data.iPoints.map((point: any, i: number) => i % 5 === 0 && (
        <mesh key={`i-${i}`} position={point}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
        </mesh>
      ))}
      
      {/* R Line (SIR only) */}
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
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);

  // Generate 3D points
  const generate3DData = (beta: number, gamma: number, model: 'sir' | 'sis') => {
    const N = 5000;
    let S = 4950, I = 50, R = 0;
    const sPoints: [number, number, number][] = [];
    const iPoints: [number, number, number][] = [];
    const rPoints: [number, number, number][] = [];
    
    for (let day = 0; day <= 30; day++) {
      const x = (day / 30) * 6 - 3;
      
      if (model === 'sir') {
        const newInfections = beta * S * I;
        const newRecoveries = gamma * I;
        
        sPoints.push([x, (S / N) * 3, 0]);
        iPoints.push([x, (I / N) * 3, 0.1]);
        rPoints.push([x, (R / N) * 3, -0.1]);
        
        S -= newInfections;
        I += newInfections - newRecoveries;
        R += newRecoveries;
      } else {
        const newInfections = beta * S * I;
        const newRecoveries = gamma * I;
        
        sPoints.push([x, (S / N) * 3, 0]);
        iPoints.push([x, (I / N) * 3, 0.1]);
        
        S += newRecoveries - newInfections;
        I += newInfections - newRecoveries;
      }
    }
    
    return { sPoints, iPoints, rPoints };
  };

  const graphData = useMemo(() => generate3DData(betaSlider, gammaSlider, activeModel), [betaSlider, gammaSlider, activeModel]);

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Elegant Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="p-3 md:p-4 bg-black/30 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xl md:text-2xl">🦠</span>
            <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Epidemic Models
            </h1>
          </div>
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => setActiveModel('sir')}
              className={`px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
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
              className={`px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
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

      {/* Split Layout - Stack on mobile */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel - Content - Hide on mobile when fullscreen */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className={`w-full md:w-5/12 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-sm border-b md:border-b-0 md:border-r border-white/5 max-h-[40vh] md:max-h-none ${isGraphFullscreen ? 'hidden md:flex md:flex-col' : ''}`}
        >
          {activeModel === 'sir' ? (
            <>
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                <h2 className="text-xl md:text-2xl font-bold text-cyan-300 mb-2">SIR Model</h2>
                <p className="text-sm md:text-base text-slate-400">Susceptible → Infected → Recovered (with permanent immunity)</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-2">
                  We divide all computers in a network into three compartments:
                </p>
                <ul className="text-sm md:text-base text-slate-400 space-y-1 list-disc list-inside">
                  <li><span className="font-semibold text-green-300">S(t)</span>: Susceptible (healthy but vulnerable)</li>
                  <li><span className="font-semibold text-red-300">I(t)</span>: Infected (actively carrying and spreading malware)</li>
                  <li><span className="font-semibold text-blue-300">R(t)</span>: Recovered (cleaned, patched, protected from re-infection)</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                    <span className="font-semibold text-green-300 text-base md:text-lg">S - Susceptible</span>
                  </div>
                  <p className="text-sm md:text-base text-slate-400">Healthy systems vulnerable to infection. Decreases as computers get infected.</p>
                </div>
                
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                    <span className="font-semibold text-red-300 text-base md:text-lg">I - Infected</span>
                  </div>
                  <p className="text-sm md:text-base text-slate-400">Systems with active malware. Increases through βSI, decreases through γI.</p>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                    <span className="font-semibold text-blue-300 text-base md:text-lg">R - Recovered</span>
                  </div>
                  <p className="text-sm md:text-base text-slate-400">Cleaned, patched systems with permanent immunity. Increases at rate of system repairs.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <h3 className="text-xs font-bold text-purple-300 mb-2">Mathematical Framework</h3>
                <div className="space-y-2">
                  <div className="p-2 rounded bg-green-900/20 border border-green-700/30">
                    <MathEquation className="text-green-300" size="sm">
                      <Fraction numerator={<span>dS</span>} denominator={<span>dt</span>} /> = −βSI
                    </MathEquation>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">Susceptible computers decrease as they get infected</p>
                  </div>
                  
                  <div className="p-2 rounded bg-red-900/20 border border-red-700/30">
                    <MathEquation className="text-red-300" size="sm">
                      <Fraction numerator={<span>dI</span>} denominator={<span>dt</span>} /> = βSI − γI
                    </MathEquation>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">New infections occur through βSI, recoveries through γI</p>
                  </div>
                  
                  <div className="p-2 rounded bg-blue-900/20 border border-blue-700/30">
                    <MathEquation className="text-blue-300" size="sm">
                      <Fraction numerator={<span>dR</span>} denominator={<span>dt</span>} /> = γI
                    </MathEquation>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">Recovered computers increase at rate of system repairs</p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs md:text-sm text-slate-400 mb-1.5"><span className="font-semibold text-purple-300">Where:</span></p>
                  <ul className="text-xs md:text-sm text-slate-400 space-y-1">
                    <li><span className="font-semibold text-red-300">β (beta)</span>: Infection rate - how easily malware spreads</li>
                    <li><span className="font-semibold text-green-300">γ (gamma)</span>: Recovery rate - how fast systems are cleaned</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-700/30">
                <h3 className="text-base md:text-lg font-bold text-cyan-300 mb-2 flex items-center gap-1">
                  <span>📊</span> Workplace Example - SIR
                </h3>
                <div className="space-y-2 text-sm md:text-base">
                  <p className="text-slate-300">A workplace has <span className="font-bold text-white">100 computers</span>:</p>
                  <ul className="text-slate-400 space-y-1 list-disc list-inside">
                    <li>90 susceptible, <span className="font-semibold text-red-300">10 infected</span></li>
                    <li>β = 0.04, γ = 0.02</li>
                  </ul>
                  
                  <div className="p-2 rounded bg-black/30 border border-white/10 mt-2">
                    <p className="text-xs md:text-sm text-slate-400 mb-1">At the start, β &gt; γ, meaning:</p>
                    <MathEquation className="text-red-300" size="sm">
                      <Fraction numerator={<span>dI</span>} denominator={<span>dt</span>} /> &gt; 0
                    </MathEquation>
                    <p className="text-xs md:text-sm text-yellow-300 mt-1 font-semibold">⚠️ Infection is increasing!</p>
                  </div>
                  
                  <div className="p-2 rounded bg-green-900/20 border border-green-700/30 mt-2">
                    <p className="text-xs md:text-sm text-slate-300 mb-1">If security improves and <span className="font-bold text-green-300">γ = 0.08</span>:</p>
                    <p className="text-xs md:text-sm text-slate-400">Now γ &gt; β</p>
                    <p className="text-xs md:text-sm text-green-300 mt-1 font-semibold">✅ Infection begins to decline</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <h2 className="text-xl md:text-2xl font-bold text-purple-300 mb-2">SIS Model</h2>
                <p className="text-sm md:text-base text-slate-400">S ⇄ I (Machines can be infected again)</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-2">
                  In real networks, a cleaned device can be infected again. Therefore, SIS uses only two compartments:
                </p>
                <ul className="text-sm md:text-base text-slate-400 space-y-1 list-disc list-inside">
                  <li><span className="font-semibold text-green-300">S(t)</span>: Susceptible (vulnerable to infection)</li>
                  <li><span className="font-semibold text-red-300">I(t)</span>: Infected (currently compromised)</li>
                </ul>
                <p className="text-sm md:text-base text-purple-300 mt-2 font-semibold">🔄 Recovered computers return to S(t) state</p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                    <span className="font-semibold text-green-300 text-base md:text-lg">S - Susceptible</span>
                  </div>
                  <p className="text-sm md:text-base text-slate-400">Systems that can be (re)infected. No permanent immunity after cleanup.</p>
                </div>
                
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                    <span className="font-semibold text-red-300 text-base md:text-lg">I - Infected</span>
                  </div>
                  <p className="text-sm md:text-base text-slate-400">Systems with active malware. Returns to S state after cleanup (no immunity).</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <h3 className="text-xs font-bold text-purple-300 mb-2">Mathematical Framework</h3>
                <div className="p-2 rounded bg-pink-900/20 border border-pink-700/30">
                  <MathEquation className="text-pink-300" size="sm">
                    <Fraction numerator={<span>dI</span>} denominator={<span>dt</span>} /> = βI(N − I) − γI
                  </MathEquation>
                  <p className="text-[10px] text-slate-400 mt-1">Rate of infection change over time</p>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-[10px] text-slate-400 mb-1.5"><span className="font-semibold text-purple-300">Where:</span></p>
                  <ul className="text-[10px] text-slate-400 space-y-1">
                    <li><span className="font-semibold text-pink-300">I(t)</span>: Number of infected systems at time t</li>
                    <li><span className="font-semibold text-cyan-300">N</span>: Total number of systems in network</li>
                    <li><span className="font-semibold text-red-300">β (beta)</span>: Infection rate parameter</li>
                    <li><span className="font-semibold text-green-300">γ (gamma)</span>: Recovery rate parameter</li>
                  </ul>
                  <p className="text-[10px] text-yellow-300 mt-2">
                    ⚠️ The term <span className="font-mono">I(N-I)</span> makes this model <span className="font-semibold">non-linear</span>
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-700/30">
                <h3 className="text-base md:text-lg font-bold text-purple-300 mb-2 flex items-center gap-1">
                  <span>☕</span> Cafe Network Example - SIS
                </h3>
                <div className="space-y-2 text-sm md:text-base">
                  <p className="text-slate-300">A cafe network has <span className="font-bold text-white">20 computers</span>:</p>
                  <ul className="text-slate-400 space-y-1 list-disc list-inside">
                    <li><span className="font-semibold text-red-300">4 infected</span>, 16 susceptible</li>
                    <li>β = 0.06, γ = 0.04</li>
                  </ul>
                  
                  <div className="p-2 rounded bg-black/30 border border-white/10 mt-2">
                    <p className="text-xs md:text-sm text-slate-400 mb-1">Calculate infection rate:</p>
                    <div className="space-y-1">
                      <MathEquation className="text-pink-300" size="sm">
                        <Fraction numerator={<span>dI</span>} denominator={<span>dt</span>} /> = βI(N − I) − γI
                      </MathEquation>
                      <MathEquation className="text-slate-300" size="sm">
                        = 0.06(4)(16) − 0.04(4)
                      </MathEquation>
                      <MathEquation className="text-slate-300" size="sm">
                        = 3.84 − 0.16
                      </MathEquation>
                      <MathEquation className="text-red-300 font-bold" size="sm">
                        = 3.68
                      </MathEquation>
                    </div>
                    <p className="text-xs md:text-sm text-yellow-300 mt-1 font-semibold">⚠️ Positive value → Infection is increasing!</p>
                  </div>
                  
                  <div className="p-2 rounded bg-green-900/20 border border-green-700/30 mt-2">
                    <p className="text-xs md:text-sm text-slate-300 mb-1">If antivirus is improved to <span className="font-bold text-green-300">γ = 0.30</span>:</p>
                    <div className="space-y-1">
                      <MathEquation className="text-slate-300" size="sm">
                        <Fraction numerator={<span>dI</span>} denominator={<span>dt</span>} /> = 0.06(4)(16) − 0.30(4)
                      </MathEquation>
                      <MathEquation className="text-slate-300" size="sm">
                        = 3.84 − 1.20
                      </MathEquation>
                      <MathEquation className="text-green-300 font-bold" size="sm">
                        = 2.64 (still positive but smaller)
                      </MathEquation>
                    </div>
                    <p className="text-xs md:text-sm text-green-300 mt-1 font-semibold">✅ Infection rate decreased significantly</p>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">Eventually infection will decline as γ approaches or exceeds β</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm md:text-base font-semibold text-yellow-300 mb-1">⚠️ Endemic State Possible</p>
                <p className="text-sm md:text-base text-slate-400">Unlike SIR, infections can persist indefinitely at equilibrium since recovered systems become susceptible again.</p>
              </div>
            </>
          )}

          {/* Interactive Controls */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/10 backdrop-blur-xl">
            <h3 className="text-base md:text-lg font-bold text-cyan-300 mb-3">Real-time Parameters</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm md:text-base font-medium text-red-300">β (Infection Rate)</label>
                  <span className="text-sm md:text-base font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">{betaSlider.toFixed(4)}</span>
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
                <div className="flex justify-between text-xs md:text-sm text-slate-500 mt-0.5">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm md:text-base font-medium text-green-300">γ (Recovery Rate)</label>
                  <span className="text-sm md:text-base font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded">{gammaSlider.toFixed(2)}</span>
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
                <div className="flex justify-between text-xs md:text-sm text-slate-500 mt-0.5">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              <span className="font-semibold text-purple-300">Tip:</span> Adjust sliders to see real-time changes in the 3D epidemic curves. Higher β = faster spread, higher γ = faster recovery.
            </p>
          </div>
        </motion.div>

        {/* Right Panel - 3D Visualization - Larger on mobile */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className={`flex-1 relative ${isGraphFullscreen ? 'fixed inset-0 z-50 md:relative' : 'min-h-[400px] md:min-h-0 md:h-auto'}`}
        >
          {/* Fullscreen Toggle Button - Mobile Only */}
          <button
            onClick={() => setIsGraphFullscreen(!isGraphFullscreen)}
            className="md:hidden absolute top-2 right-2 z-20 p-2 rounded-lg bg-cyan-500/90 hover:bg-cyan-600 text-white shadow-lg backdrop-blur"
          >
            {isGraphFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
          
          <div className="absolute top-2 md:top-4 left-2 md:left-4 z-10">
            <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-black/70 backdrop-blur-xl border border-white/10">
              <p className="text-[10px] md:text-xs font-semibold text-cyan-300 mb-1 md:mb-2 hidden md:block">3D Epidemic Curves</p>
              <div className="flex gap-2 md:gap-3 text-[10px] md:text-xs">
                <div className="flex items-center gap-1 md:gap-1.5">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                  <span className="text-slate-300 hidden sm:inline">Susceptible</span>
                  <span className="text-slate-300 sm:hidden">S</span>
                </div>
                <div className="flex items-center gap-1 md:gap-1.5">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                  <span className="text-slate-300 hidden sm:inline">Infected</span>
                  <span className="text-slate-300 sm:hidden">I</span>
                </div>
                {activeModel === 'sir' && (
                  <div className="flex items-center gap-1 md:gap-1.5">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                    <span className="text-slate-300 hidden sm:inline">Recovered</span>
                    <span className="text-slate-300 sm:hidden">R</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Canvas camera={{ position: [6, 4, 6], fov: 45 }} className="w-full h-full">
            <color attach="background" args={['#020617']} />
            <fog attach="fog" args={['#020617', 8, 20]} />
            <Graph3D data={graphData} model={activeModel} />
          </Canvas>
          
          <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 text-[8px] md:text-[10px] text-slate-500 bg-black/50 px-1.5 md:px-2 py-0.5 md:py-1 rounded backdrop-blur-sm">
            Drag to rotate • Scroll to zoom
          </div>
        </motion.div>
      </div>
    </div>
  );
}
