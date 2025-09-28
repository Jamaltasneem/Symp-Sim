const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Case = require('../models/Case');

// Load medical data from JSON file
const medicalDataPath = path.join(__dirname, '../data/medicalData.json');
let medicalData = [];

try {
  const rawData = fs.readFileSync(medicalDataPath, 'utf-8');
  medicalData = JSON.parse(rawData);
} catch (err) {
  console.error('Error loading medical data:', err.message);
  medicalData = [];
}

// Disease prediction from dataset
function predictDisease(symptoms = []) {
  if (!symptoms.length) return 'Unknown';

  const normalizedSymptoms = symptoms.map(s => s.toLowerCase().trim());

  // Match disease with highest overlap of symptoms
  let bestMatch = null;
  let maxMatches = 0;

  medicalData.forEach(entry => {
    const entrySymptoms = entry.symptoms.map(s => s.toLowerCase());
    const matches = entrySymptoms.filter(sym => normalizedSymptoms.includes(sym)).length;

    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = entry.disease;
    }
  });

  return bestMatch || 'General Consultation Recommended';
}

// Create new case
router.post('/', auth, async (req, res) => {
  try {
    const { symptoms = [], notes = '' } = req.body;
    const predictedDisease = predictDisease(symptoms);

    const newCase = new Case({
      user: req.user._id,
      symptoms,
      predictedDisease,
      notes
    });

    await newCase.save();
    res.status(201).json({ message: 'Case saved', case: newCase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all cases for user
router.get('/', auth, async (req, res) => {
  try {
    const cases = await Case.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all unique symptoms (for dropdown)
router.get('/symptoms/all', auth, async (req, res) => {
  try {
    const allSymptoms = new Set();
    medicalData.forEach(entry => {
      entry.symptoms.forEach(sym => allSymptoms.add(sym));
    });
    res.json([...allSymptoms].sort());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load symptoms' });
  }
});


module.exports = router;
