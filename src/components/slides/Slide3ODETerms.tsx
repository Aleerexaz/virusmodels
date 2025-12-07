"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { useRef } from "react";
import { MathEquation, Fraction } from "../MathEquation";

// Authentic Beta/Gamma Visualization - Shows actual transmission/recovery rates over time
function Curve3D({ parameter, value }: { parameter: 'beta' | 'gamma', value: number }) {
  const groupRef = useRef<any>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  // Generate realistic epidemic curves based on parameter values
  const points: [number, number, number][] = [];
  const N = 5000;
  let S = 4950, I = 50;
  
  for (let day = 0; day <= 100; day += 2) {
    const x = (day / 100) * 8 - 4;
    
    if (parameter === 'beta') {
      const transmissionRate = value * S * I;
      const y = Math.min((transmissionRate / 1000) * 3, 4);
      const z = Math.sin(day * 0.1) * 0.5;
      points.push([x, y, z]);
      
      const dI = value * S * I * 0.02;
      S -= dI;
      I += dI;
      S = Math.max(0, S);
      I = Math.max(0, Math.min(N, I));
    } else {
      const recoveryRate = value * I;
      const y = Math.min((recoveryRate / 100) * 3, 4);
      const z = Math.cos(day * 0.1) * 0.5;
      points.push([x, y, z]);
      
      if (day < 50) {
        I += 10;
      }
      I -= value * I * 0.02;
      I = Math.max(0, I);
    }
  }

  return (
    <group ref={groupRef}>
      {/* Grid */}
      <gridHelper args={[10, 20, '#334155', '#1e293b']} />
      
      {/* Axes matching data range */}
      <Line points={[[-4, 0, 0], [4, 0, 0]]} color="#64748b" lineWidth={2} />
      <Line points={[[0, 0, 0], [0, 5, 0]]} color="#64748b" lineWidth={2} />
      
      <Line 
        points={points} 
        color={parameter === 'beta' ? '#ef4444' : '#10b981'} 
        lineWidth={3}
      />
      
      {points.map((point, i) => i % 8 === 0 && (
        <mesh key={i} position={point}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color={parameter === 'beta' ? '#ef4444' : '#10b981'} 
            emissive={parameter === 'beta' ? '#ef4444' : '#10b981'} 
            emissiveIntensity={0.6} 
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Slide3ODETerms() {
  const [activeParam, setActiveParam] = useState<'beta' | 'gamma'>('beta');
  const [betaValue, setBetaValue] = useState(0.0004);
  const [gammaValue, setGammaValue] = useState(0.1);

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Centered Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="p-3 md:p-4 bg-black/30 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
            <span className="text-xl md:text-2xl">📐</span>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              ODE Parameters: β & γ
            </h1>
          </div>
          <div className="flex gap-2 justify-center mt-2">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => setActiveParam('beta')}
              className={`px-4 md:px-5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeParam === 'beta' 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              Beta (β)
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => setActiveParam('gamma')}
              className={`px-4 md:px-5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeParam === 'gamma' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              Gamma (γ)
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Split Layout - Stack on mobile */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel - Content */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="w-full md:w-5/12 flex flex-col"
        >
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-sm border-b md:border-b-0 md:border-r border-white/5">
            {activeParam === 'beta' ? (
              <>
                <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20">
                  <h2 className="text-2xl font-bold text-red-300 mb-3">Beta (β) - Transmission Rate Parameter</h2>
                  <p className="text-base text-slate-300 leading-relaxed mb-3">
                    β (beta) is the <span className="text-red-400 font-semibold">transmission coefficient</span> that quantifies how quickly malware spreads through a network. It represents the <span className="text-red-400 font-semibold">probability of infection per contact</span> between susceptible and infected systems, scaled by the contact rate. This single parameter encapsulates the complex interaction dynamics that determine epidemic velocity.
                  </p>
                  <p className="text-sm text-slate-400 mb-2">
                    Mathematically, β combines three factors: <span className="text-red-300 font-semibold">(1)</span> how often systems interact (contact frequency), <span className="text-red-300 font-semibold">(2)</span> the probability that an interaction results in infection (exploit success rate), and <span className="text-red-300 font-semibold">(3)</span> population normalization. Higher β means each infected system infects more susceptible systems per unit time.
                  </p>
                  <div className="mt-2 p-2 bg-red-500/10 rounded border border-red-500/30">
                    <p className="text-xs text-red-300 font-mono">📊 Graph shows: β × S × I = Transmission Rate</p>
                    <p className="text-[10px] text-slate-400">Taller red curve = more infections happening per day at that moment</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                  <h3 className="text-base font-bold text-purple-300 mb-3">📐 Mathematical Definition of β</h3>
                  <MathEquation className="text-red-300" size="lg">
                    β = <Fraction numerator={<span>contact rate × transmission probability</span>} denominator={<span>population size (N)</span>} />
                  </MathEquation>
                  <p className="text-sm text-slate-300 leading-relaxed mt-3 mb-2">
                    This formula reveals that β is <span className="text-red-400 font-semibold">not a fixed biological constant</span> but depends on network topology, vulnerability characteristics, and security posture. The contact rate reflects how many potential infection opportunities exist per time unit, while transmission probability reflects exploit effectiveness.
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="text-red-300 font-semibold">In network security context:</span> Contact rate = network connectivity × scanning rate. Transmission probability = P(vulnerable system) × P(successful exploit | vulnerable). Higher network density, more active scanning, and more unpatched vulnerabilities all increase β, leading to faster epidemic spread.
                  </p>
                  <div className="mt-2 p-2 bg-purple-500/10 rounded">
                    <p className="text-[10px] text-purple-300">→ Watch graph: Higher β = Taller red transmission curves = More systems getting infected simultaneously at peak</p>
                  </div>
                </div>

                <div className="p-5 rounded-lg bg-red-500/5 border border-red-500/20">
                  <h3 className="text-lg font-semibold text-red-300 mb-3">🌍 Real-World Factors Affecting β</h3>
                  <ul className="space-y-3 text-base text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1 text-lg">•</span>
                      <div>
                        <p><strong className="text-red-400">Network Density & Topology:</strong> Highly connected networks (dense graphs) have more contact opportunities between nodes, dramatically increasing β. Star topologies concentrate infection risk at hubs, while mesh networks distribute it. Enterprise networks with flat architectures (no segmentation) have higher β than properly segmented networks.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1 text-lg">•</span>
                      <div>
                        <p><strong className="text-red-400">Vulnerability Prevalence:</strong> The proportion of unpatched, vulnerable systems is a <span className="text-red-400 font-semibold">critical multiplier</span> for β. If 90% of systems have an unpatched SMB vulnerability (like WannaCry exploited), β increases 9x compared to 10% vulnerable. Zero-day exploits maximize β since no patches exist initially.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1 text-lg">•</span>
                      <div>
                        <p><strong className="text-red-400">Attack Vector Efficiency:</strong> <span className="text-red-400 font-semibold">Worms</span> (self-propagating, automated) have much higher β than viruses requiring user action (opening email attachments). Network-based attacks have higher β than social engineering attacks. Drive-by downloads and watering hole attacks fall in between.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1 text-lg">•</span>
                      <div>
                        <p><strong className="text-red-400">Historical Example - WannaCry Ransomware:</strong> Had estimated β ≈ 0.0005-0.001 per day. This high value enabled it to infect <span className="text-red-400 font-semibold">230,000+ systems in 150+ countries within 4 days</span> in May 2017. It exploited EternalBlue (SMB vulnerability) for rapid automated spread, demonstrating how network-based worms maximize β.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-400/30">
                  <label className="block text-sm font-semibold text-red-300 mb-2">
                    🏚️ Adjust β Value: {betaValue.toFixed(5)}
                  </label>
                  <p className="text-[10px] text-slate-400 mb-2">→ Slide to see transmission rate change in real-time on graph</p>
                  <input
                    type="range"
                    min="0.0001"
                    max="0.001"
                    step="0.00001"
                    value={betaValue}
                    onChange={(e) => setBetaValue(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #f97316 ${(betaValue - 0.0001) / (0.001 - 0.0001) * 100}%, #1e293b ${(betaValue - 0.0001) / (0.001 - 0.0001) * 100}%, #1e293b 100%)`
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <h2 className="text-2xl font-bold text-green-300 mb-3">Gamma (γ) - Recovery Rate Parameter</h2>
                  <p className="text-base text-slate-300 leading-relaxed mb-3">
                    γ (gamma) represents the <span className="text-green-400 font-semibold">recovery coefficient</span> - the rate at which infected systems transition to recovered (SIR) or susceptible (SIS) states. It quantifies the <span className="text-green-400 font-semibold">inverse of the infectious period</span>: how quickly incident response teams detect, contain, and remediate infections. Higher γ means shorter infectious windows.
                  </p>
                  <p className="text-sm text-slate-400 mb-2">
                    γ encompasses the <span className="text-green-300 font-semibold">entire recovery pipeline</span>: detection time (threat intelligence, EDR alerts), analysis time (triage, forensics), containment time (isolation, quarantine), eradication time (malware removal), and recovery time (system restoration, patching). Each component contributes to the overall recovery rate. Faster any step = higher γ.
                  </p>
                  <div className="mt-2 p-2 bg-green-500/10 rounded border border-green-500/30">
                    <p className="text-xs text-green-300 font-mono">📊 Graph shows: γ × I = Recovery Rate</p>
                    <p className="text-[10px] text-slate-400">Taller green curve = more systems being cleaned per day - faster epidemic resolution</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                  <h3 className="text-base font-bold text-purple-300 mb-3">📐 Mathematical Definition of γ</h3>
                  <MathEquation className="text-green-300" size="lg">
                    γ = <Fraction numerator={<span>1</span>} denominator={<span>infectious period (D)</span>} />
                  </MathEquation>
                  <p className="text-sm text-slate-300 leading-relaxed mt-3 mb-2">
                    The infectious period D is the <span className="text-green-400 font-semibold">average time a system remains infected and capable of spreading malware</span> before being cleaned. If γ = 0.1 per day, then D = 1/γ = 10 days average infectious period. If γ = 0.5 per day, D = 2 days. This inverse relationship means improving any recovery process component directly increases γ and reduces D.
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="text-green-300 font-semibold">Practical interpretation:</span> γ = 0.1 means on average, 10% of currently infected systems are cleaned each day. γ = 0.2 means 20% per day. Higher γ accelerates epidemic resolution by shrinking the infected reservoir faster. <span className="text-green-400 font-semibold">Automated response systems</span> (SOAR, EDR) can increase γ from 0.1 (manual 10-day response) to 0.5+ (automated 2-day response).
                  </p>
                  <div className="mt-2 p-2 bg-purple-500/10 rounded">
                    <p className="text-[10px] text-purple-300">→ Watch graph: Higher γ = Steeper green recovery curves = Infections cleared faster = Shorter epidemic duration</p>
                  </div>
                </div>

                <div className="p-5 rounded-lg bg-green-500/5 border border-green-500/20">
                  <h3 className="text-lg font-semibold text-green-300 mb-3">🔧 Recovery Process & γ Optimization</h3>
                  <ul className="space-y-3 text-base text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1 text-lg">•</span>
                      <div>
                        <p><strong className="text-green-400">Detection Speed (EDR/XDR Systems):</strong> Modern <span className="text-green-400 font-semibold">Endpoint Detection and Response</span> platforms use behavioral analytics, machine learning, and threat intelligence to identify infections within <span className="text-green-400 font-semibold">minutes to hours</span> (vs. days/weeks for traditional antivirus). Real-time detection dramatically increases γ by shrinking the detection window from the infectious period.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1 text-lg">•</span>
                      <div>
                        <p><strong className="text-green-400">Automated Patching & Remediation:</strong> <span className="text-green-400 font-semibold">Zero-touch remediation</span> systems can automatically deploy security patches within hours of release, compared to manual patching cycles taking weeks. Automated configuration management (Ansible, Chef, Puppet) pushes remediation at scale. Each hour saved in patching delays adds to γ numerator.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1 text-lg">•</span>
                      <div>
                        <p><strong className="text-green-400">SOAR Platforms (Security Orchestration):</strong> <span className="text-green-400 font-semibold">Security Orchestration, Automation, and Response</span> platforms execute playbooks that coordinate multi-tool workflows: isolate host → collect forensics → terminate malicious processes → remove persistence → restore from backup. This reduces mean time to remediation (MTTR) from days to hours, significantly boosting γ.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1 text-lg">•</span>
                      <div>
                        <p><strong className="text-green-400">SIEM Analytics & Threat Hunting:</strong> <span className="text-green-400 font-semibold">Security Information and Event Management</span> aggregates logs from network devices, endpoints, and applications to provide centralized visibility. Advanced analytics (UEBA, anomaly detection) spot infections earlier. Proactive threat hunting discovers latent infections before they spread, increasing effective γ.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1 text-lg">•</span>
                      <div>
                        <p><strong className="text-green-400">Incident Response Team Expertise:</strong> Skilled security analysts and incident responders reduce <span className="text-green-400 font-semibold">decision latency</span> during triage, containment, and eradication phases. Mature incident response programs with defined playbooks, tabletop exercises, and continuous training achieve higher γ than ad-hoc response efforts.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1 text-lg">•</span>
                      <div>
                        <p><strong className="text-green-400">Real-World Benchmark:</strong> <span className="text-green-400 font-semibold">Enterprise environments with mature security operations</span> (EDR, SOAR, 24/7 SOC) can achieve γ ≈ 0.2-0.5 per day (2-5 day recovery), while organizations relying on manual processes may have γ ≈ 0.05-0.1 (10-20 day recovery). This 5x difference in γ translates to drastically different epidemic outcomes.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30">
                  <label className="block text-sm font-semibold text-green-300 mb-2">
                    Adjust γ Value: {gammaValue.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.01"
                    value={gammaValue}
                    onChange={(e) => setGammaValue(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #059669 ${(gammaValue - 0.05) / (0.5 - 0.05) * 100}%, #1e293b ${(gammaValue - 0.05) / (0.5 - 0.05) * 100}%, #1e293b 100%)`
                    }}
                  />
                </div>

                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm font-semibold text-blue-300 mb-1">💡 Key Insight</p>
                  <p className="text-sm text-slate-300">
                    The ratio β/γ determines if an outbreak will spread (R₀ = β/γ). 
                    Increasing γ is often more effective than decreasing β for epidemic control.
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Right Panel - 3D Visualization */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className="flex-1 relative bg-slate-950"
          style={{ minHeight: '600px' }}
        >
          <div className="absolute inset-0" style={{ zIndex: 0, background: '#0a0a1a', minHeight: '600px' }}>
            <Canvas 
              camera={{ position: [8, 5, 8], fov: 50 }}
              className="w-full h-full"
            >
              <color attach="background" args={["#0a0a1a"]} />
              <fog attach="fog" args={["#0a0a1a", 10, 25]} />
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={0.8} color="#60a5fa" />
              <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />
              
              {/* Center the graph better */}
              <group position={[0, 0, 0]}>
                <Curve3D 
                  parameter={activeParam} 
                  value={activeParam === 'beta' ? betaValue : gammaValue} 
                />
              </group>
              
              <OrbitControls 
                enableZoom={true}
                enablePan={false}
                minDistance={5}
                maxDistance={15}
              />
            </Canvas>
          </div>
          
          <div className="absolute top-4 left-4 p-4 rounded-xl bg-black/90 backdrop-blur-xl border-2 border-purple-400/30 shadow-2xl max-w-xs">
            <p className="text-base font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl">{activeParam === 'beta' ? '🔴' : '🟢'}</span>
              <span className={activeParam === 'beta' ? 'text-red-300' : 'text-green-300'}>
                {activeParam === 'beta' ? 'Transmission Rate (β)' : 'Recovery Rate (γ)'}
              </span>
            </p>
            <div className="text-sm text-slate-400 space-y-1.5">
              {activeParam === 'beta' ? (
                <>
                  <p className="text-slate-300">Shows infection spread rate over time</p>
                  <p>• Higher curve = faster transmission</p>
                  <p>• Depends on network connectivity</p>
                  <p>• Formula: β × S × I</p>
                </>
              ) : (
                <>
                  <p className="text-slate-300">Shows recovery speed over time</p>
                  <p>• Higher curve = faster cleanup</p>
                  <p>• Depends on detection systems</p>
                  <p>• Formula: γ × I</p>
                </>
              )}
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 p-3 rounded-lg bg-black/80 backdrop-blur-xl border border-white/10">
            <p className="text-sm text-slate-400">
              {activeParam === 'beta' 
                ? `β = ${betaValue.toFixed(5)} (transmission rate)` 
                : `γ = ${gammaValue.toFixed(2)} (recovery rate)`}
            </p>
          </div>
          
          {/* Graph Legend */}
          <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-black/80 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${activeParam === 'beta' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span className="text-xs text-slate-300">
                  {activeParam === 'beta' ? 'Transmission Curve' : 'Recovery Curve'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-slate-300">Grid</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}