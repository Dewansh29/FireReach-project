import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, Search, Mail, Users, Send } from 'lucide-react';
import axios from 'axios';

export default function ResultsView({ results, onReset }) {
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');

  // Safe extraction
  const insights = results?.research_insights?.insights || "No insights found.";
  const draft = results?.final_draft || "No draft generated.";
  const candidateEmail = results?.candidate_email;
  const hunterEmails = results?.hunter_emails || [];

  const handleSendEmail = async (targetEmail) => {
    if (!targetEmail) {
      setSendResult('No target email specified.');
      return;
    }
    setSending(true);
    setSendResult('');
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/send-email", {
        candidate_email: targetEmail,
        subject: "Quick question about your strategy",
        body: draft,
      });
      setSendResult(response.data.status || 'Email sent!');
    } catch (err) {
      setSendResult('Failed to send email. Check backend SMTP configuration.');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Header Status */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CheckCircle2 color="#10b981" size={32} />
          <div>
            <h2 style={{ color: 'white', marginBottom: '0.25rem' }}>Agents Completed Successfully</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Workflow execution complete.</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="btn-primary"
          style={{ width: 'auto', padding: '0.5rem 1rem', background: '#3f3f46', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}
        >
          <RotateCcw size={18} /> Reset
        </button>
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>

        {/* Hunter.io Prospects */}
        <motion.div
          className="glass-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            <Users size={20} /> Hunter.io Discovered Prospects
          </h3>
          {hunterEmails && hunterEmails.length > 0 && !hunterEmails[0]?.error ? (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {hunterEmails.map((h, i) => (
                <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{h.first_name} {h.last_name} <span style={{ color: 'var(--text-muted)' }}>({h.position})</span></span>
                  <span style={{ color: 'var(--primary)' }}>{h.email}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>
              No emails found via Hunter.io or error occurred: {hunterEmails[0]?.error}
            </p>
          )}
        </motion.div>

        {/* OSINT Research Insights */}
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

        {/* Final Draft + Send */}
        <motion.div
          className="glass-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Subtle glow */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '150px', height: '150px',
            background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f97316', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            <Mail size={20} /> Final QA-Approved Draft
          </h3>
          <div className="markdown-body" style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', borderLeft: '3px solid #f97316', paddingLeft: '1rem', marginBottom: '1rem' }}>
            {draft}
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
            {candidateEmail ? (
              <div>
                <p style={{ marginBottom: '1rem' }}>
                  Ready to send to: <strong>{candidateEmail}</strong>
                </p>
                {sendResult ? (
                  <p style={{ color: sendResult.startsWith('Error') || sendResult.startsWith('Failed') ? '#ef4444' : '#10b981' }}>
                    {sendResult}
                  </p>
                ) : (
                  <button
                    id="send-email-btn"
                    onClick={() => handleSendEmail(candidateEmail)}
                    disabled={sending}
                    className="btn-primary"
                    style={{ width: 'auto' }}
                  >
                    <Send size={18} /> {sending ? 'Sending…' : 'Send Email'}
                  </button>
                )}
              </div>
            ) : (
              <div>
                <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                  No candidate email provided in the form.
                </p>
                {hunterEmails && hunterEmails.length > 0 && !hunterEmails[0]?.error && (
                  <div>
                    <p style={{ marginBottom: '0.5rem' }}>Send to discovered prospect:</p>
                    {sendResult && (
                      <p style={{ color: sendResult.startsWith('Error') || sendResult.startsWith('Failed') ? '#ef4444' : '#10b981', marginBottom: '1rem' }}>
                        {sendResult}
                      </p>
                    )}
                    {!sendResult && (
                      <button
                        id="send-hunter-email-btn"
                        onClick={() => handleSendEmail(hunterEmails[0].email)}
                        disabled={sending}
                        className="btn-primary"
                        style={{ width: 'auto' }}
                      >
                        <Send size={18} /> {sending ? 'Sending…' : `Send to ${hunterEmails[0].email}`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
