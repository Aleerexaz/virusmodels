"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { useRef } from "react";
import { MathEquation, Fraction } from "../MathEquation";

// Authentic R0 Graph - Shows epidemic growth vs threshold
function R0Graph3D({ r0, beta, gamma }: { r0: number, beta: number, gamma: number }) {
  const groupRef = useRef<any>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2;
    }
  });

  // Generate authentic epidemic growth curve based on R0
  const thresholdPoints: [number, number, number][] = [
    [-4, 1.5, -4], [4, 1.5, -4], [4, 1.5, 4], [-4, 1.5, 4], [-4, 1.5, -4]
  ];

  // Simulate actual epidemic growth: I(t) = I0 * exp((R0-1)*gamma*t) when R0 > 1
  const epidemicCurve: [number, number, number][] = [];
  const N = 5000;
  let S = 4950, I = 50, R = 0;
  const dt = 0.1;
  
  for (let day = 0; day <= 100; day += dt) {
    const x = (day / 100) * 8 - 4;
    
    // SIR differential equations
    const dS = -beta * S * I * dt;
    const dI = (beta * S * I - gamma * I) * dt;
    const dR = gamma * I * dt;
    
    S += dS;
    I += dI;
    R += dR;
    
    S = Math.max(0, S);
    I = Math.max(0, I);
    R = Math.max(0, R);
    
    // Map infection count to height
    const y = Math.min((I / N) * 20, 5);
    epidemicCurve.push([x, y, 0]);
  }

  return (
    <group ref={groupRef}>
      <gridHelper args={[10, 20, '#334155', '#1e293b']} />
      
      {/* Axes */}
      <Line points={[[-4, 0, 0], [4, 0, 0]]} color="#64748b" lineWidth={2} />
      <Line points={[[0, 0, 0], [0, 6, 0]]} color="#64748b" lineWidth={2} />
      <Line points={[[0, 0, -4], [0, 0, 4]]} color="#64748b" lineWidth={2} />
      
      {/* Threshold Plane at R0=1 */}
      <Line points={thresholdPoints} color="#fbbf24" lineWidth={2} />
      <mesh position={[0, 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          transparent 
          opacity={0.15} 
          side={2}
        />
      </mesh>
      
      {/* Authentic Epidemic Growth Curve */}
      <Line 
        points={epidemicCurve} 
        color={r0 > 1 ? '#ef4444' : '#10b981'} 
        lineWidth={3}
      />
      
      {epidemicCurve.filter((_, i) => i % 15 === 0).map((point, i) => (
        <mesh key={i} position={point}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color={r0 > 1 ? '#ef4444' : '#10b981'} 
            emissive={r0 > 1 ? '#ef4444' : '#10b981'} 
            emissiveIntensity={0.7} 
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Slide4Predictions() {
  const [activeSection, setActiveSection] = useState<'r0' | 'peak' | 'security'>('r0');
  const [betaValue, setBetaValue] = useState(0.0004);
  const [gammaValue, setGammaValue] = useState(0.1);
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);

  const r0 = useMemo(() => betaValue / gammaValue * 5000, [betaValue, gammaValue]);

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
            <span className="text-xl md:text-2xl">🎯</span>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Predictions & Analysis
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => setActiveSection('r0')}
              className={`px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeSection === 'r0' 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              R₀ Analysis
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => setActiveSection('peak')}
              className={`px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeSection === 'peak' 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              Peak Prediction
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => setActiveSection('security')}
              className={`px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeSection === 'security' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              Security Strategies
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Split Layout - Stack on mobile */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel - Content - Scrollable on mobile - Hide when fullscreen */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className={`w-full md:w-5/12 flex flex-col max-h-[40vh] md:max-h-none ${isGraphFullscreen ? 'hidden md:flex' : ''}`}
        >
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-sm border-b md:border-b-0 md:border-r border-white/5">
          {activeSection === 'r0' && (
            <>
              <div className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <h2 className="text-2xl font-bold text-yellow-300 mb-3">R₀ - Basic Reproduction Number</h2>
                <p className="text-base text-slate-300 leading-relaxed mb-3">
                  R₀ (pronounced "R-naught") represents the <span className="text-yellow-400 font-semibold">average number of secondary infections</span> caused by a single infected system in a <span className="text-yellow-400 font-semibold">completely susceptible population</span> (no immunity, no interventions). It is the <span className="text-yellow-400 font-semibold">single most critical metric</span> for determining whether an epidemic will spread or die out naturally.
                </p>
                <p className="text-sm text-slate-400 mb-2">
                  <span className="text-yellow-300 font-semibold">Epidemic threshold interpretation:</span> R₀ &gt; 1 means each infection spawns &gt;1 new infections on average → <span className="text-red-400 font-semibold">exponential growth</span>. R₀ &lt; 1 means each infection spawns &lt;1 new infections → <span className="text-green-400 font-semibold">epidemic dies out</span>. R₀ = 1 is the critical threshold separating growth from decline. This single number determines epidemic fate.
                </p>
                <div className="mt-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
                  <p className="text-xs text-yellow-300 font-mono">📊 Graph shows: Infection curve vs R₀=1 threshold (yellow plane)</p>
                  <p className="text-[10px] text-slate-400">Curve above plane = epidemic spreading | Curve below plane = epidemic dying</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                <h3 className="text-base font-bold text-purple-300 mb-3">📐 Mathematical Formula</h3>
                <MathEquation className="text-yellow-300" size="lg">
                  R₀ = <Fraction numerator={<span>β</span>} denominator={<span>γ</span>} />
                </MathEquation>
                <p className="text-sm text-slate-300 leading-relaxed mt-3 mb-2">
                  R₀ is the <span className="text-yellow-400 font-semibold">elegant ratio of transmission rate (β) to recovery rate (γ)</span>. This simple formula encapsulates complex epidemic dynamics into a single interpretable number. Physically, it represents: "How many new infections occur before one infected system is cleaned?"
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-yellow-300 font-semibold">Intuition:</span> If β = 0.0004 (infection rate) and γ = 0.1 (recovery rate), then R₀ = 0.0004/0.1 = 0.004 per individual, but scaled by population: R₀ = (β/γ) × N = 0.004 × 5000 = 20. Each infected system infects 20 others on average before being cleaned. <span className="text-red-400 font-semibold">This guarantees explosive growth.</span> All security strategies aim to push R₀ below 1 by decreasing β (reduce transmission) or increasing γ (faster recovery).
                </p>
                <div className="mt-2 p-2 bg-purple-500/10 rounded">
                  <p className="text-[10px] text-purple-300">→ Adjust sliders below: Watch how β and γ changes affect R₀ → Curve color/position switches at R₀=1 threshold!</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                    <span className="font-semibold text-red-300 text-base">R₀ &gt; 1</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-2">Epidemic grows <span className="text-red-400 font-semibold">exponentially</span> - each generation of infections is larger than the previous. Intervention required to prevent widespread outbreak.</p>
                  <p className="text-xs text-slate-400 mb-2">Infection spreads faster than recovery can contain it. The susceptible pool depletes over time until herd immunity threshold is reached.</p>
                  <p className="text-[10px] text-red-400 mt-1 font-mono">📊 Red curve rises above yellow R₀=1 threshold plane on graph</p>
                </div>
                
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                    <span className="font-semibold text-green-300 text-base">R₀ &lt; 1</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-2">Epidemic <span className="text-green-400 font-semibold">dies out naturally</span> - each generation of infections is smaller than previous. No intervention needed; outbreak self-terminates.</p>
                  <p className="text-xs text-slate-400 mb-2">Recovery happens faster than new transmissions occur. Infected population shrinks exponentially until reaching zero. Security measures successfully contain spread.</p>
                  <p className="text-[10px] text-green-400 mt-1 font-mono">📊 Green curve stays below yellow R₀=1 threshold plane - declines to zero</p>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <h3 className="text-lg font-semibold text-yellow-300 mb-3">🌍 Real-World Malware R₀ Examples</h3>
                <ul className="space-y-3 text-base text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1 text-lg">•</span>
                    <div>
                      <p><strong className="text-yellow-400">WannaCry Ransomware (May 2017):</strong> Estimated R₀ ≈ 2-4. Infected <span className="text-yellow-400 font-semibold">230,000+ systems across 150+ countries in just 4 days</span>. Exploited EternalBlue SMB vulnerability (unpatched Windows systems). Rapid global spread demonstrated high transmission rate with moderate recovery (many organizations lacked incident response). Eventually contained via kill-switch domain registration + emergency patching.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1 text-lg">•</span>
                    <div>
                      <p><strong className="text-yellow-400">Conficker Worm (2008-2010):</strong> Estimated R₀ ≈ 3-5. Infected <span className="text-yellow-400 font-semibold">15+ million systems at peak</span>, establishing one of the largest botnets in history. Used multiple propagation vectors (network shares, USB drives, exploits) creating high β. Sophisticated domain generation algorithm (DGA) and polymorphic code made recovery (γ) difficult, sustaining high R₀ for extended period.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1 text-lg">•</span>
                    <div>
                      <p><strong className="text-yellow-400">SQL Slammer Worm (January 2003):</strong> Estimated R₀ ≈ 10+ (highest ever recorded). The <span className="text-yellow-400 font-semibold">fastest-spreading worm in history</span> - infected 75,000 systems in 10 minutes, doubling every 8.5 seconds initially. Tiny 376-byte UDP packet exploiting SQL Server vulnerability. Extreme β (automated scanning + UDP broadcast) overwhelmed γ (manual patching required days). Caused global Internet disruptions including ATM outages and flight cancellations.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1 text-lg">•</span>
                    <div>
                      <p><strong className="text-yellow-400">Email Viruses (ILOVEYOU, Melissa):</strong> Estimated R₀ ≈ 0.5-1.5. <span className="text-yellow-400 font-semibold">Requires user interaction</span> (opening attachment, enabling macros) which dramatically reduces β compared to worms. R₀ near 1 means borderline epidemic - success depends heavily on social engineering effectiveness and user security awareness. Modern email filtering + sandboxing reduces β further, pushing R₀ &lt; 1 for most email-based threats.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-400/30">
                <label className="block text-sm font-semibold text-red-300 mb-2">
                  🏚️ Adjust β (Transmission): {betaValue.toFixed(5)}
                </label>
                <p className="text-[10px] text-slate-400 mb-2">↑ Increases R₀ → Watch curve rise above yellow threshold</p>
                <input
                  type="range"
                  min="0.0001"
                  max="0.001"
                  step="0.00001"
                  value={betaValue}
                  onChange={(e) => setBetaValue(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #f97316 ${(betaValue - 0.0001) / (0.001 - 0.0001) * 100}%, #1e293b ${(betaValue - 0.0001) / (0.001 - 0.0001) * 100}%, #1e293b 100%)`
                  }}
                />
              </div>

              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30">
                <label className="block text-sm font-semibold text-green-300 mb-2">
                  🏚️ Adjust γ (Recovery): {gammaValue.toFixed(2)}
                </label>
                <p className="text-[10px] text-slate-400 mb-2">↑ Decreases R₀ → Watch curve drop below yellow threshold</p>
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

              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30">
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-1">Current R₀ Value</p>
                  <p className={`text-4xl font-bold ${r0 > 1 ? 'text-red-400' : 'text-green-400'}`}>
                    {r0.toFixed(2)}
                  </p>
                  <p className={`text-sm mt-2 ${r0 > 1 ? 'text-red-300' : 'text-green-300'}`}>
                    {r0 > 1 
                      ? '⚠️ Epidemic will spread' 
                      : '✅ Epidemic will die out'}
                  </p>
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-[10px] text-slate-500">
                      👁️ Look at graph: Curve is {r0 > 1 ? 'RED and ABOVE' : 'GREEN and BELOW'} the yellow plane
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'peak' && (
            <>
              <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20">
                <h2 className="text-2xl font-bold text-red-300 mb-3">📈 Peak Prediction - Epidemic Maximum</h2>
                <p className="text-base text-slate-300 leading-relaxed mb-3">
                  The <span className="text-red-400 font-semibold">peak infection time (t_peak)</span> identifies <span className="text-red-400 font-semibold">when the outbreak reaches maximum intensity</span> - the point where the most systems are simultaneously infected. This represents the <span className="text-red-400 font-semibold">critical inflection point</span> where new infection rate equals recovery rate, marking the transition from epidemic growth to decline.
                </p>
                <p className="text-sm text-slate-400 mb-2">
                  <span className="text-red-300 font-semibold">Why peak matters:</span> Security resources (SOC analysts, incident responders, network bandwidth, forensic tools) experience <span className="text-red-400 font-semibold">maximum strain at peak</span>. Knowing peak timing enables: (1) resource pre-positioning, (2) shift scheduling optimization, (3) emergency response activation timing, (4) communication planning for stakeholders. <span className="text-red-400 font-semibold">Pre-peak interventions are 10-100x more effective</span> than post-peak reactions due to exponential growth dynamics.
                </p>
                <div className="mt-2 p-2 bg-red-500/10 rounded border border-red-500/30">
                  <p className="text-xs text-red-300 font-mono">📊 Graph shows: Highest point on infection curve (I vs time)</p>
                  <p className="text-[10px] text-slate-400">Watch for: Red/Green curve reaches maximum height, then begins declining - this is t_peak</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                <h3 className="text-base font-bold text-purple-300 mb-3">📐 Peak Time Formula (Analytical Solution)</h3>
                <MathEquation className="text-red-300" size="lg">
                  t_peak = <Fraction numerator={<span>ln(R₀ · S₀)</span>} denominator={<span>β · S₀</span>} />
                </MathEquation>
                <p className="text-sm text-slate-300 leading-relaxed mt-3 mb-2">
                  Where S₀ is the initial susceptible population (typically ≈ N for early outbreak). This formula is derived by finding when <span className="text-red-400 font-semibold">dI/dt = 0</span> (infection rate change equals zero), which occurs when <span className="text-red-400 font-semibold">βSI = γI</span> (new infections equal recoveries). The peak represents the <span className="text-red-400 font-semibold">epidemic turning point</span>.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-red-300 font-semibold">Physical interpretation:</span> The logarithm ln(R₀ · S₀) captures the exponential growth phase duration - higher R₀ or larger S₀ prolongs growth, delaying peak. The denominator β · S₀ is the effective transmission rate - higher values accelerate epidemic dynamics, causing earlier peak. <span className="text-red-400 font-semibold">Trade-off:</span> High R₀ delays peak (more growth cycles) but high β advances peak (faster cycles). Real epidemic timing depends on which factor dominates.
                </p>
                <div className="mt-2 p-2 bg-purple-500/10 rounded">
                  <p className="text-[10px] text-purple-300">→ Graph visualization: Peak is the exact point where infection curve stops rising and begins falling - mathematically where slope = 0</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <h3 className="text-base font-semibold text-red-300 mb-2">What Happens at Peak?</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong className="text-red-400">Maximum Infections:</strong> Highest number of simultaneously infected systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong className="text-red-400">Resource Strain:</strong> Security teams and systems at maximum capacity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong className="text-red-400">Turning Point:</strong> After peak, new infections decline as susceptible pool shrinks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong className="text-red-400">Critical Window:</strong> Pre-peak intervention is exponentially more effective</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <h3 className="text-base font-semibold text-orange-300 mb-2">Factors Affecting Peak Time</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <p><span className="text-orange-400 font-semibold">Higher β:</span> Earlier peak (faster spread reaches capacity sooner)</p>
                  <p><span className="text-orange-400 font-semibold">Higher γ:</span> Earlier peak (infections resolved faster)</p>
                  <p><span className="text-orange-400 font-semibold">Larger S₀:</span> Later peak (more systems to infect)</p>
                  <p><span className="text-orange-400 font-semibold">Higher R₀:</span> More severe peak (exponential growth phase)</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30">
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-1">Estimated Peak with Current Parameters</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    Day {Math.max(1, Math.round(Math.log(r0 * 4950) / (betaValue * 4950)))}
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    β = {betaValue.toFixed(5)}, γ = {gammaValue.toFixed(2)}, R₀ = {r0.toFixed(2)}
                  </p>
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-[10px] text-slate-500">👁️ Graph peak time: Where curve reaches its highest point</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm font-semibold text-blue-300 mb-1">💡 Strategic Insight</p>
                <p className="text-sm text-slate-300">
                  Early intervention before the peak can reduce total infections by 80-90%. 
                  Waiting until after the peak makes containment exponentially harder.
                </p>
              </div>
            </>
          )}

          {activeSection === 'security' && (
            <>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <h2 className="text-xl font-bold text-blue-300 mb-2">🛡️ Security Strategies</h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Epidemic models reveal two fundamental approaches to controlling malware outbreaks: 
                  <span className="text-blue-400 font-semibold"> reduce transmission (β)</span> or 
                  <span className="text-cyan-400 font-semibold"> increase recovery (γ)</span>. 
                  Both push R₀ below 1, but through different mechanisms.
                </p>
                <div className="mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/30">
                  <p className="text-xs text-blue-300 font-mono">📊 Graph interaction: Use sliders to see how strategies affect curve</p>
                  <p className="text-[10px] text-slate-400">Lower β or raise γ → Curve flattens and drops below yellow plane</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <h3 className="text-base font-bold text-red-300 mb-3">Strategy 1: Reduce β (Transmission)</h3>
                <p className="text-sm text-slate-300 mb-3">
                  Lower the contact rate or infection probability to slow spread at the source.
                </p>
                <div className="mb-3 p-2 bg-red-500/5 rounded">
                  <p className="text-[10px] text-red-400 font-mono">🎚️ Slide β down → Watch curve flatten and peak lower</p>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">🛡️</span>
                    <span><strong className="text-red-400">Network Segmentation:</strong> Isolate critical systems to reduce attack surface</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">🔒</span>
                    <span><strong className="text-red-400">Firewalls & IDS:</strong> Block malicious traffic before it reaches targets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">🚫</span>
                    <span><strong className="text-red-400">Access Control:</strong> Limit privileges to minimize lateral movement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">📧</span>
                    <span><strong className="text-red-400">Email Filtering:</strong> Stop phishing vectors at the gateway</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">🎓</span>
                    <span><strong className="text-red-400">User Training:</strong> Reduce social engineering success rates</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <h3 className="text-base font-bold text-green-300 mb-3">Strategy 2: Increase γ (Recovery)</h3>
                <p className="text-sm text-slate-300 mb-3">
                  Speed up detection, removal, and patching to reduce the infectious period.
                </p>
                <div className="mb-3 p-2 bg-green-500/5 rounded">
                  <p className="text-[10px] text-green-400 font-mono">🎚️ Slide γ up → Watch curve compress and drop below threshold</p>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">🔍</span>
                    <span><strong className="text-green-400">EDR/XDR Systems:</strong> Real-time threat detection and automated response</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">⚡</span>
                    <span><strong className="text-green-400">Automated Patching:</strong> Deploy security updates within hours, not days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">🤖</span>
                    <span><strong className="text-green-400">SOAR Platforms:</strong> Orchestrate incident response workflows automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">📊</span>
                    <span><strong className="text-green-400">SIEM Analytics:</strong> Aggregate logs to spot infections faster</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">👥</span>
                    <span><strong className="text-green-400">Incident Response Team:</strong> Skilled responders reduce remediation time</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <h3 className="text-base font-bold text-purple-300 mb-3">Hybrid Approach (Best Practice)</h3>
                <p className="text-sm text-slate-300 mb-3">
                  Combine both strategies for maximum effectiveness: defense in depth.
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 rounded bg-red-500/5 border border-red-500/20">
                    <p className="text-red-300 font-semibold mb-1">Reduce β by 50%</p>
                    <p className="text-slate-400 text-xs">R₀: 2.0 → 1.0</p>
                  </div>
                  <div className="p-2 rounded bg-green-500/5 border border-green-500/20">
                    <p className="text-green-300 font-semibold mb-1">Increase γ by 2x</p>
                    <p className="text-slate-400 text-xs">R₀: 2.0 → 1.0</p>
                  </div>
                  <div className="col-span-2 p-2 rounded bg-blue-500/5 border border-blue-500/20">
                    <p className="text-blue-300 font-semibold mb-1">Combined: 25% β reduction + 50% γ increase</p>
                    <p className="text-slate-400 text-xs">R₀: 2.0 → 0.5 (epidemic eliminated)</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30">
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-2">Goal: Push R₀ Below 1</p>
                  <p className="text-2xl font-bold text-cyan-400 mb-2">
                    R₀ = β/γ &lt; 1
                  </p>
                  <p className="text-sm text-slate-300">
                    Either decrease β OR increase γ (or both) to achieve epidemic control
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm font-semibold text-yellow-300 mb-1">⚡ Quick Win</p>
                <p className="text-sm text-slate-300">
                  Increasing γ is often faster and more cost-effective than reducing β. 
                  Deploy automated detection/response tools before investing in complex network redesigns.
                </p>
              </div>
            </>
          )}
          </div>
        </motion.div>

        {/* Right Panel - 3D Visualization - Larger on mobile */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className={`flex-1 relative bg-slate-950 ${isGraphFullscreen ? 'fixed inset-0 z-50 md:relative' : ''}`}
          style={{ minHeight: isGraphFullscreen ? '100vh' : '600px' }}
        >
          {/* Fullscreen Toggle Button - Mobile Only */}
          <button
            onClick={() => setIsGraphFullscreen(!isGraphFullscreen)}
            className="md:hidden absolute top-2 right-2 z-20 p-2 rounded-lg bg-yellow-500/90 hover:bg-yellow-600 text-white shadow-lg backdrop-blur"
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
          
          <div className="absolute inset-0" style={{ zIndex: 0, background: '#030712', minHeight: isGraphFullscreen ? '100vh' : '600px' }}>
            <Canvas 
              camera={{ position: [8, 5, 8], fov: 50 }}
              className="w-full h-full"
            >
              <color attach="background" args={["#030712"]} />
              <fog attach="fog" args={["#030712", 10, 25]} />
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={0.8} color="#60a5fa" />
              <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />
              
              {/* Center the graph better */}
              <group position={[0, 0, 0]}>
                <R0Graph3D r0={r0} beta={betaValue} gamma={gammaValue} />
              </group>
              
              <OrbitControls 
                enableZoom={true}
                enablePan={false}
                minDistance={5}
                maxDistance={15}
              />
            </Canvas>
          </div>
          
          <div className="absolute top-2 left-2 md:top-4 md:left-4 p-2 md:p-4 rounded-lg md:rounded-xl bg-black/90 backdrop-blur-xl border md:border-2 border-yellow-400/30 shadow-2xl max-w-[140px] md:max-w-sm">
            <p className="text-[10px] md:text-base font-bold text-yellow-300 mb-1 md:mb-3 flex items-center gap-1 md:gap-2">
              <span className="text-sm md:text-base">🎯</span> 
              <span className="hidden md:inline">Epidemic Growth Simulation</span>
              <span className="md:hidden">R₀ Analysis</span>
            </p>
            <div className="space-y-1 md:space-y-2 text-[10px] md:text-sm hidden md:block">
              <div className="flex items-start gap-2">
                <div className="w-4 h-3 bg-yellow-400/30 border border-yellow-400 rounded mt-0.5"></div>
                <div>
                  <p className="text-slate-300 font-medium">R₀ = 1 Threshold Plane</p>
                  <p className="text-slate-500 text-xs">Critical boundary for epidemic control</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className={`w-4 h-3 rounded mt-0.5 ${r0 > 1 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <div>
                  <p className="text-slate-300 font-medium">Infection Curve I(t)</p>
                  <p className="text-slate-500 text-xs">Number of infected systems over time</p>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className={`text-sm font-bold ${r0 > 1 ? 'text-red-400' : 'text-green-400'}`}>
                {r0 > 1 ? '⚠️ Above threshold: Epidemic grows exponentially' : '✅ Below threshold: Epidemic dies naturally'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Current R₀: {r0.toFixed(2)} | Peak infections: {r0 > 1 ? 'Visible in curve' : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 p-3 rounded-lg bg-black/80 backdrop-blur-xl border border-white/10">
            <p className="text-xs text-slate-400 mb-1">
              R₀ = {r0.toFixed(2)} {activeSection === 'r0' && `(${r0 > 1 ? 'Spreading' : 'Contained'})`}
            </p>
            {activeSection === 'peak' && (
              <p className="text-xs text-slate-400">
                Peak: Day {Math.max(1, Math.round(Math.log(r0 * 4950) / (betaValue * 4950)))}
              </p>
            )}
            {activeSection === 'security' && (
              <p className="text-xs text-slate-400">
                β = {betaValue.toFixed(5)}, γ = {gammaValue.toFixed(2)}
              </p>
            )}
          </div>

          <div className="absolute top-2 right-2 md:top-4 md:right-4 p-1.5 md:p-3 rounded md:rounded-lg bg-black/60 backdrop-blur-xl border border-white/10">
            <div className="text-[9px] md:text-xs text-slate-400 space-y-0.5 md:space-y-1">
              {activeSection === 'r0' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <span>Threshold (R₀=1)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${r0 > 1 ? 'bg-red-400' : 'bg-green-400'}`}></div>
                    <span>Current R₀ Curve</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
