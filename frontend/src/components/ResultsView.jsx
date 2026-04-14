import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, Search, Mail } from 'lucide-react';

export default function ResultsView({ results, onReset }) {
  // Safe extraction
  const insights = results?.research_insights?.insights || "No insights found.";
  const draft = results?.final_draft || "No draft generated.";
  const deliveryStatus = results?.delivery_status || "Unknown delivery status.";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Status */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CheckCircle2 color="#10b981" size={32} />
          <div>
            <h2 style={{ color: 'white', marginBottom: '0.25rem' }}>Agents Completed Successfully</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{deliveryStatus}</p>
          </div>
        </div>
        <button onClick={onReset} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', background: '#3f3f46', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}>
          <RotateCcw size={18} /> Reset
        </button>
      </div>

      {/* Grid for Insights and Draft */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        
        <motion.div 
          className="glass-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            <Search size={20} /> OSINT Research Insights
          </h3>
          <div className="markdown-body" style={{ whiteSpace: 'pre-wrap' }}>
            {insights}
          </div>
        </motion.div>

        <motion.div 
          className="glass-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Subtle glow effect behind draft */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '150px', height: '150px',
            background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f97316', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            <Mail size={20} /> Final QA-Approved Draft
          </h3>
          <div className="markdown-body" style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', borderLeft: '3px solid #f97316', paddingLeft: '1rem' }}>
            {draft}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
