import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import axios from 'axios';
import FireReachForm from './components/FireReachForm';
import AgentLoader from './components/AgentLoader';
import ResultsView from './components/ResultsView';

const API_URL = "http://127.0.0.1:8000/api/trigger-agents";

function App() {
  const [appState, setAppState] = useState('idle'); // 'idle', 'processing', 'complete', 'error'
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleIgnite = async (formData) => {
    setAppState('processing');
    setErrorMsg('');
    try {
      const response = await axios.post(API_URL, formData);
      setResults(response.data);
      setAppState('complete');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || err.message || 'Failed to ignite agents.');
      setAppState('error');
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setResults(null);
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Flame size={40} color="#f97316" strokeWidth={2.5} />
          <h1 style={{ fontSize: '3rem', fontWeight: 700 }} className="text-gradient">FireReach</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Advanced Multi-Agent Automated B2B Outreach
        </p>
      </motion.header>

      <main>
        <AnimatePresence mode="wait">
          {appState === 'idle' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <FireReachForm onSubmit={handleIgnite} />
            </motion.div>
          )}

          {appState === 'processing' && (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <AgentLoader />
            </motion.div>
          )}

          {(appState === 'complete' && results) && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsView results={results} onReset={handleReset} />
            </motion.div>
          )}

          {appState === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel"
              style={{ textAlign: 'center', border: '1px solid #ef4444' }}
            >
              <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Processing Error</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{errorMsg}</p>
              <button className="btn-primary" onClick={handleReset} style={{ background: '#3f3f46', width: 'auto', margin: '0 auto' }}>
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
