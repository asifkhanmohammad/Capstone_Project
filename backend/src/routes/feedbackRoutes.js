import express from 'express';
import { Feedback } from '../models/Feedback.js';

const router = express.Router();

// GET /api/feedback - Get feedback list from MongoDB
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ created_at: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/feedback/complaint/:id - Get feedback for complaint
router.get('/complaint/:id', async (req, res) => {
  try {
    const feedback = await Feedback.find({ complaint_id: req.params.id }).sort({ created_at: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/feedback - Create feedback in MongoDB
router.post('/', async (req, res) => {
  try {
    const id = `fb-${Date.now()}`;
    const newFeedback = new Feedback({
      ...req.body,
      id,
      created_at: new Date().toISOString(),
    });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
