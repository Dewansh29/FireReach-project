import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, PenTool, CheckCircle, Send } from 'lucide-react';

const stages = [
  { icon: Search, text: "OSINT Agent: Researching live web data & Hunter.io..." },
  { icon: PenTool, text: "Drafter Agent: Synthesizing value proposition..." },
  { icon: CheckCircle, text: "QA Agent: Reviewing against constraints..." },
  { icon: Send, text: "Finalizing & Generating Gmail draft..." }
];

export default function AgentLoader() {
  const [currentStage, setCurrentStage] = useState(0);

  // Fake progression through stages to simulate graph execution wait time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage(prev => {
        if (prev < stages.length - 1) return prev + 1;
        return prev;
      });
    }, 4500); // Progress every 4.5s
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{
          width: '80px', height: '80px', margin: '0 auto', 
          borderRadius: '50%', background: 'var(--primary-glow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 30px var(--primary-glow)'
        }}>
          {React.createElement(stages[currentStage].icon, { size: 40, color: 'white' })}
        </div>
      </motion.div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
        Agents Triggered
      </h2>
      
      <motion.p
        key={currentStage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 500 }}
      >
        {stages[currentStage].text}
      </motion.p>
      
      <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        This usually takes around 15-30 seconds depending on LLM latency.
      </p>
    </div>
  );
}
