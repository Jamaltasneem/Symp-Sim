import React, { useState } from 'react';
import axios from 'axios';

const PatientSimulator = () => {
    const [patient, setPatient] = useState(null);
    const [diagnosisInput, setDiagnosisInput] = useState('');
    const [score, setScore] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL;

    const getRandomPatient = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/patients/random`);
            setPatient(res.data);
            setDiagnosisInput('');
            setScore(null);
        } catch (err) {
            console.error("Error fetching patient:", err);
        }
    };

    const checkDiagnosis = () => {
        if (!patient) return;
        if (diagnosisInput.trim().toLowerCase() === patient.diagnosis.toLowerCase()) {
            setScore('✅ Correct! Well done 🎉');
        } else {
            setScore(`❌ Wrong! Correct diagnosis: ${patient.diagnosis}`);
        }
    };

    return (
        <div className="simulator-container">
            <button onClick={getRandomPatient} className="btn">Get Random Patient</button>

            {patient && (
                <div className="patient-card">
                    <p><strong>Name:</strong> {patient.name}</p>
                    <p><strong>Age:</strong> {patient.age}</p>
                    <p><strong>Gender:</strong> {patient.gender}</p>
                    <p><strong>Symptoms:</strong> {patient.symptoms.join(', ')}</p>

                    <input
                        type="text"
                        placeholder="Enter diagnosis"
                        value={diagnosisInput}
                        onChange={(e) => setDiagnosisInput(e.target.value)}
                    />
                    <button onClick={checkDiagnosis} className="btn">Check Diagnosis</button>

                    {score && <p className="score">{score}</p>}
                </div>
            )}
        </div>
    );
};

export default PatientSimulator;
