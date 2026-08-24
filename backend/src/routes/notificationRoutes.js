import express from 'express';
import { Notification } from '../models/Notification.js';

const router = express.Router();

// GET /api/notifications/:userId - Get user notifications from MongoDB
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.params.userId }).sort({ created_at: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notifications - Create notification in MongoDB
router.post('/', async (req, res) => {
  try {
    const id = `notif-${Date.now()}`;
    const newNotif = new Notification({
      ...req.body,
      id,
      created_at: new Date().toISOString(),
    });
    await newNotif.save();
    res.status(201).json(newNotif);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/notifications/:id/read - Mark notification read in MongoDB
router.patch('/:id/read', async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { id: req.params.id },
      { $set: { is_read: true } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Notification not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
