import express from 'express';
import { ServiceRequest } from '../models/ServiceRequest.js';

const router = express.Router();

// GET /api/services - Get all service requests from MongoDB
router.get('/', async (req, res) => {
  try {
    const { student_id } = req.query;
    const filter = student_id ? { student_id } : {};
    const services = await ServiceRequest.find(filter).sort({ created_at: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/services - Create service request in MongoDB
router.post('/', async (req, res) => {
  try {
    const id = `srv-${Date.now()}`;
    const newService = new ServiceRequest({
      ...req.body,
      id,
      status: req.body.status || 'pending',
      created_at: new Date().toISOString(),
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/services/:id - Update status in MongoDB
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await ServiceRequest.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Service Request not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
