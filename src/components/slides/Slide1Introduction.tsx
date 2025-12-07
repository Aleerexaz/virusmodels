"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Slide1Introduction() {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      title: "The Digital Epidemic Scenario",
      icon: "💻",
      content: (
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="p-4 md:p-6 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30">
              <p className="text-lg md:text-xl font-bold text-red-300 mb-2 md:mb-3">🚨 Good morning everyone.</p>
              <p className="text-base md:text-lg text-slate-200 leading-relaxed">
                Let's begin with a simple situation: <span className="text-xl md:text-2xl font-bold text-red-400">You switch on your laptop</span> and within hours <span className="text-lg md:text-xl font-semibold text-orange-400">the entire organization is affected.</span>
              </p>
            </div>
            
            <div className="p-4 md:p-6 rounded-xl bg-slate-800/50 border border-white/10">
              <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-4">
                Files are corrupted, systems slow down, emails are being sent automatically, and even devices that were <span className="font-semibold text-cyan-300">completely normal yesterday</span> are now infected.
              </p>
              <p className="text-sm md:text-md text-slate-300 italic">
                This is not rare—modern malware spreads extremely fast because computers are interconnected just like people in a society.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
            {[
              { icon: "📁", text: "Files Encrypted & Corrupted", desc: "Data becomes inaccessible", color: "from-red-500 to-rose-600" },
              { icon: "🐌", text: "Systems Throttled", desc: "Performance degradation", color: "from-orange-500 to-amber-600" },
              { icon: "📧", text: "Support Lines Flood", desc: "Automatic malicious emails", color: "from-yellow-500 to-orange-600" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }} className={`p-4 md:p-6 rounded-2xl bg-gradient-to-br ${item.color} bg-opacity-10 border border-white/10 hover:border-white/30 transition-all`}>
                <div className="text-3xl md:text-5xl mb-2 md:mb-3">{item.icon}</div>
                <div className="text-base md:text-lg font-bold mb-1 md:mb-2">{item.text}</div>
                <div className="text-xs text-slate-400">{item.desc}</div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="p-4 md:p-6 rounded-2xl bg-red-500/10 border-2 border-red-500/30">
            <div className="flex items-start gap-3 md:gap-4">
              <span className="text-2xl md:text-4xl">⚠️</span>
              <div>
                <p className="text-base md:text-lg font-bold text-red-300 mb-2">A Cyber Epidemic Ignites</p>
                <p className="text-sm md:text-base text-slate-300">
                  When an infected machine communicates through emails, file sharing, cloud sync, USB transfers, or browsing, there is a chance that malware moves to the next system. If enough machines are infected quickly, we experience a <span className="font-bold text-red-400">digital epidemic</span>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      title: "How Malware Leaps Across Networks",
      icon: "🔄",
      content: (
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30">
            <p className="text-lg md:text-xl font-bold text-blue-300 mb-2 md:mb-3">Propagation Vectors</p>
            <p className="text-base md:text-lg text-slate-200">
              When an infected machine communicates, there is a chance that malware moves to the next system. Each interaction becomes a bridge to another machine.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
            {[
              { icon: "📧", title: "Phishing Emails", desc: "Malicious attachments and links sent via email to unsuspecting users", color: "blue" },
              { icon: "📂", title: "File Sharing", desc: "Shared network drives and folders spreading infected files across systems", color: "purple" },
              { icon: "☁️", title: "Cloud Sync Jobs", desc: "Automatic cloud synchronization propagating malware to all connected devices", color: "cyan" },
              { icon: "💾", title: "USB Hand-offs", desc: "Physical drive connections transferring infections between isolated systems", color: "green" },
              { icon: "🌐", title: "Web Browsing", desc: "Malicious websites, drive-by downloads, and compromised web applications", color: "orange" },
              { icon: "🔗", title: "Lateral Movement", desc: "Exploitation of network vulnerabilities to jump between machines", color: "pink" },
            ].map((vector, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 cursor-pointer transition-all">
                <div className="text-3xl md:text-5xl mb-3 md:mb-4">{vector.icon}</div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{vector.title}</h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{vector.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}
            className="mt-6 md:mt-8 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-orange-500/30">
            <div className="flex items-center gap-3">
              <span className="text-3xl md:text-5xl">💥</span>
              <p className="text-base md:text-xl font-bold text-orange-200">
                If enough machines are infected quickly, we experience a <span className="text-lg md:text-2xl text-red-400">cyber epidemic</span>. Malware rides every human workflow.
              </p>
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      title: "Critical Questions Leaders Need Answered",
      icon: "❓",
      content: (
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 rounded-2xl bg-purple-500/10 border border-purple-500/30">
            <p className="text-lg md:text-xl font-bold text-purple-300 mb-2 md:mb-3">What Executives Demand to Know Immediately</p>
            <p className="text-base md:text-lg text-slate-200">
              Executives demand timelines, impact curves, and the tipping point before the network collapses. These questions cannot be left to guesswork:
            </p>
          </motion.div>

          <div className="space-y-4 md:space-y-6">
            {[
              {
                question: "How fast will the infection grow?",
                icon: "📈",
                color: "red",
                detail: "We need to understand the exponential growth rate. Will it double every hour? Every day? Understanding the speed of spread helps us predict the impact timeline and allocate emergency resources effectively."
              },
              {
                question: "Will it stop on its own, or spread across the entire network?",
                icon: "🌍",
                color: "orange",
                detail: "This is critical for resource planning. If the outbreak will self-extinguish, we can focus on containment. If it will consume every node, we need complete network-wide response protocols immediately."
              },
              {
                question: "When will the infection reach its maximum?",
                icon: "⏰",
                color: "yellow",
                detail: "Identifying the peak infection point allows us to prepare adequate IT staff, backup systems, and recovery resources. We can schedule critical operations around this timeline and warn stakeholders proactively."
              },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.2 }}
                className={`p-4 md:p-6 rounded-2xl bg-${item.color}-500/10 border-2 border-${item.color}-500/40 hover:border-${item.color}-500/60 transition-all`}>
                <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
                  <div className="text-3xl md:text-5xl flex-shrink-0">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-white">{item.question}</h3>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="p-4 md:p-6 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/40">
            <p className="text-base md:text-lg text-center text-cyan-200">
              <span className="font-bold text-lg md:text-xl">Rather than guessing</span>, we need mathematical certainty to guide our defense strategy.
            </p>
          </motion.div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      <motion.div initial={{ y: -100 }} animate={{ y: 0 }} className="p-4 md:p-8 bg-gradient-to-r from-rose-500/20 to-orange-500/20 border-b border-white/10 backdrop-blur">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-rose-400 to-orange-500 bg-clip-text text-transparent">Introduction & Why Model Virus Spread</h1>
      </motion.div>
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row gap-2 md:gap-3">
            {sections.map((section, index) => (
              <button key={index} onClick={() => setActiveSection(index)} className={`flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-xl border-2 text-sm md:text-base ${activeSection === index ? "bg-rose-500/30 border-orange-500/50" : "bg-white/5 border-white/10"}`}>
                <span className="text-lg md:text-2xl">{section.icon}</span>
                <span className="font-semibold">{section.title}</span>
              </button>
            ))}
          </div>
          <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 rounded-3xl p-4 md:p-8 border border-white/10">
            {sections[activeSection].content}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
