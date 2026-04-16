import React, { useState } from 'react';
import { Target } from 'lucide-react';

export default function FireReachForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    target_role: '',
    company_name: '',
    company_domain: '',
    value_proposition: '',
    candidate_email: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.target_role || !formData.company_name || !formData.company_domain || !formData.value_proposition) {
      return; // Basic validation
    }
    onSubmit(formData);
  };

  return (
    <div className="glass-panel">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={24} color="#8b5cf6" /> Configure Target
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Provide the details of your prospect to ignite the agents.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label" htmlFor="target_role">Target Role</label>
            <input 
              type="text" 
              id="target_role" 
              name="target_role" 
              placeholder="e.g. VP of Marketing" 
              className="input-field"
              value={formData.target_role}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="company_name">Company Name</label>
            <input 
              type="text" 
              id="company_name" 
              name="company_name" 
              placeholder="e.g. Acme Corp" 
              className="input-field"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div className="input-group">
            <label className="input-label" htmlFor="company_domain">Company Domain</label>
            <input 
              type="text" 
              id="company_domain" 
              name="company_domain" 
              placeholder="e.g. acme.com" 
              className="input-field"
              value={formData.company_domain}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <label className="input-label" htmlFor="candidate_email">Target Email (Optional)</label>
            <input 
              type="email" 
              id="candidate_email" 
              name="candidate_email" 
              placeholder="e.g. jdoe@acme.com" 
              className="input-field"
              value={formData.candidate_email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-group" style={{marginTop: '1rem'}}>
          <label className="input-label" htmlFor="value_proposition">Value Proposition</label>
          <textarea 
            id="value_proposition" 
            name="value_proposition" 
            placeholder="What unique value does your product offer them? Keep it brief." 
            className="input-field"
            value={formData.value_proposition}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
          Ignite AI Agents
        </button>
      </form>
    </div>
  );
}
