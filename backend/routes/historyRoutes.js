const express = require('express');
const auth = require('../middleware/authMiddleware'); // use require for CommonJS
const Case = require('../models/Case');

const router = express.Router();

// @desc   Get user's disease history
// @route  GET /api/history
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    // Fetch all cases of the logged-in user
    const cases = await Case.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Map only necessary info for history
    const history = cases.map(c => ({
      disease: c.predictedDisease,
      date: c.createdAt,
      notes: c.notes || '',
    }));

    res.json(history);
  } catch (err) {
    console.error('Error fetching history:', err.message);
    res.status(500).json({ message: 'Server error while fetching history' });
  }
});

module.exports = router;
