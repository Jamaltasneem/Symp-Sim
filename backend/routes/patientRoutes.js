const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Get a random patient
router.get('/random', async (req, res) => {
    try {
        const count = await Patient.countDocuments();
        const random = Math.floor(Math.random() * count);
        const patient = await Patient.findOne().skip(random);
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a patient (optional: to populate database)
router.post('/', async (req, res) => {
    const { name, age, gender, symptoms, diagnosis } = req.body;
    const patient = new Patient({ name, age, gender, symptoms, diagnosis });
    try {
        const newPatient = await patient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
