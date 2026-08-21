import express from 'express';
import { Complaint } from '../models/Complaint.js';

const router = express.Router();

// GET /api/complaints - Get all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/complaints - Create a complaint
router.post('/', async (req, res) => {
  try {
    const newComplaint = new Complaint(req.body);
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/complaints/:id - Update status / assignment
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Complaint.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Complaint not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
