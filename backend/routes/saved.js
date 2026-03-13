const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SavedInternship = require('../models/SavedInternship');

// Get all saved internships
router.get('/', auth, async (req, res) => {
  try {
    const saved = await SavedInternship.find({ user: req.user._id }).sort({ savedAt: -1 });
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save an internship
router.post('/', auth, async (req, res) => {
  try {
    const { internshipId, title, company, location, salary, description, url, category, postedDate } = req.body;

    const existing = await SavedInternship.findOne({ user: req.user._id, internshipId });
    if (existing) return res.status(400).json({ message: 'Already saved' });

    const saved = await SavedInternship.create({
      user: req.user._id,
      internshipId, title, company, location, salary, description, url, category, postedDate
    });

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove saved internship
router.delete('/:internshipId', auth, async (req, res) => {
  try {
    await SavedInternship.findOneAndDelete({
      user: req.user._id,
      internshipId: req.params.internshipId
    });
    res.json({ message: 'Removed from saved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if saved
router.get('/check/:internshipId', auth, async (req, res) => {
  try {
    const saved = await SavedInternship.findOne({
      user: req.user._id,
      internshipId: req.params.internshipId
    });
    res.json({ isSaved: !!saved });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;