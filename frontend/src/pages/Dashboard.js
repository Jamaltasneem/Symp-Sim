import React, { useEffect, useState } from 'react';
import SymptomInput from '../components/SymptomInput';
import API, { authHeader } from '../api';

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [activeTab, setActiveTab] = useState('symptoms');

  const fetchCases = async () => {
    try {
      const res = await API.get('/api/cases', { headers: authHeader() });
      setCases(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'symptoms' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('symptoms')}
        >
          Enter Symptoms
        </button>
        <button
          className={activeTab === 'history' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      {/* Content */}
      {activeTab === 'symptoms' && (
        <SymptomInput onSaved={(c) => setCases(prev => [c, ...prev])} />
      )}

      {activeTab === 'history' && (
        <div className="card">
          <h3>Your Past Diagnoses</h3>
          {cases.length === 0 && <p>No history yet.</p>}
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Predicted Disease</th>
                <th>Symptoms</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c._id}>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                  <td>{c.predictedDisease}</td>
                  <td>{c.symptoms.join(', ')}</td>
                  <td>{c.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
