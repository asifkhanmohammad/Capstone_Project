import express from 'express';
import { Department } from '../models/Department.js';
import { authenticateUser, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/departments - Fetch departments from MongoDB
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/departments - Create department in MongoDB (Admin Only)
router.post('/', authenticateUser, requireRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { name, code, head_name, head_email, sla_target_hours, monthly_budget } = req.body;
    const id = `dept-${Date.now()}`;
    const newDept = new Department({
      id,
      name,
      code,
      head_name,
      head_email,
      sla_target_hours: sla_target_hours || 24,
      monthly_budget: monthly_budget || 50000,
    });
    await newDept.save();
    res.status(201).json(newDept);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/departments/:id - Update department in MongoDB (Admin Only)
router.put('/:id', authenticateUser, requireRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const updated = await Department.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Department not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/departments/:id - Delete department in MongoDB (Admin Only)
router.delete('/:id', authenticateUser, requireRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const deleted = await Department.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Department not found' });
    res.json({ message: 'Department deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
