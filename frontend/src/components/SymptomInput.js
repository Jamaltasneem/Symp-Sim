import React, { useEffect, useState } from 'react';
import API, { authHeader } from '../api';

const SymptomInput = ({ onSaved }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const res = await API.get('/api/cases/symptoms/all', { headers: authHeader() });
        setAvailableSymptoms(res.data);
      } catch (err) {
        console.error('Failed to load symptoms', err);
      }
    };
    fetchSymptoms();
  }, []);

  const handleAddSymptom = (e) => {
    const value = e.target.value;
    if (value && !symptoms.includes(value)) {
      setSymptoms(prev => [...prev, value]);
    }
  };

  const handleRemoveSymptom = (symptom) => {
    setSymptoms(prev => prev.filter(s => s !== symptom));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (symptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }

    try {
      setLoading(true);
      setPrediction(''); // reset before fetching

      const res = await API.post(
        '/api/cases',
        { symptoms, notes },
        { headers: authHeader() }
      );

      // ✅ Show prediction instantly
      setPrediction(res.data.case.predictedDisease);

      // ✅ Update history
      onSaved(res.data.case);

      // ✅ Clear inputs
      setSymptoms([]);
      setNotes('');
    } catch (err) {
      console.error(err);
      alert('Failed to save case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Enter Symptoms</h3>
      <form onSubmit={handleSubmit}>
        <select onChange={handleAddSymptom} value="">
          <option value="">Select a symptom</option>
          {availableSymptoms.map((sym, idx) => (
            <option key={idx} value={sym}>
              {sym}
            </option>
          ))}
        </select>

        <div className="selected-symptoms">
          {symptoms.map((sym) => (
            <span key={sym} className="tag">
              {sym}{' '}
              <button type="button" onClick={() => handleRemoveSymptom(sym)}>
                x
              </button>
            </span>
          ))}
        </div>

        <textarea
          placeholder="Additional notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Disease'}
        </button>
      </form>

      {/* ✅ Show prediction below the button */}
      {prediction && (
        <div className="prediction-result">
          <strong>Predicted Disease:</strong> {prediction}
        </div>
      )}
    </div>
  );
};

export default SymptomInput;
