import express from 'express';
import { Complaint } from '../models/Complaint.js';

const router = express.Router();

// GET /api/complaints - Get all complaints from MongoDB
router.get('/', async (req, res) => {
  try {
    const { category, priority, status, department_id, student_id } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (department_id) filter.department_id = department_id;
    if (student_id) filter.student_id = student_id;

    const complaints = await Complaint.find(filter).sort({ created_at: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/complaints/my - Get complaints for student
router.get('/my', async (req, res) => {
  try {
    const student_id = req.query.student_id || req.headers['x-user-id'];
    if (!student_id) {
      return res.status(400).json({ error: 'student_id is required' });
    }
    const complaints = await Complaint.find({ student_id }).sort({ created_at: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/complaints/stats - Get analytics directly from MongoDB
router.get('/stats', async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: { $in: ['submitted', 'verified', 'assigned', 'in_progress', 'reopened'] } });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });
    const closed = await Complaint.countDocuments({ status: 'closed' });
    const highPriority = await Complaint.countDocuments({ priority: { $in: ['high', 'emergency'] } });

    // Category aggregation
    const categoryAgg = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Department aggregation
    const departmentAgg = await Complaint.aggregate([
      { $group: { _id: '$department_name', count: { $sum: 1 } } }
    ]);

    res.json({
      total,
      pending,
      resolved,
      closed,
      highPriority,
      byCategory: categoryAgg.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {}),
      byDepartment: departmentAgg.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {}),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/complaints/:id - Get single complaint
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      $or: [{ id: req.params.id }, { complaint_number: req.params.id }],
    });
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/complaints - Create new complaint in MongoDB
router.post('/', async (req, res) => {
  try {
    const count = (await Complaint.countDocuments()) + 1001;
    const complaint_number = `CMP-2026-${String(count).padStart(4, '0')}`;
    const id = `cmp-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const complaintData = {
      ...req.body,
      id,
      complaint_number: req.body.complaint_number || complaint_number,
      status: req.body.status || 'submitted',
      created_at: req.body.created_at || nowIso,
      updated_at: nowIso,
      timeline: req.body.timeline || [
        {
          id: `tl-1`,
          complaint_id: id,
          user_id: req.body.student_id,
          user_name: req.body.student_name,
          user_role: 'student',
          new_status: 'submitted',
          comment: 'Complaint submitted by student.',
          is_internal: false,
          created_at: nowIso,
        },
      ],
    };

    const newComplaint = new Complaint(complaintData);
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/complaints/:id - Update status / assignment / timeline in MongoDB
router.patch('/:id', async (req, res) => {
  try {
    const { status, assigned_staff_id, assigned_staff_name, rejection_reason, comment, is_internal, updated_by_name, updated_by_role, updated_by_id } = req.body;

    const complaint = await Complaint.findOne({
      $or: [{ id: req.params.id }, { complaint_number: req.params.id }],
    });

    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

    const nowIso = new Date().toISOString();
    const oldStatus = complaint.status;

    if (status) complaint.status = status;
    if (assigned_staff_id) complaint.assigned_staff_id = assigned_staff_id;
    if (assigned_staff_name) complaint.assigned_staff_name = assigned_staff_name;
    if (rejection_reason) complaint.rejection_reason = rejection_reason;

    if (status === 'resolved') complaint.resolved_at = nowIso;
    if (status === 'closed') complaint.closed_at = nowIso;

    complaint.updated_at = nowIso;

    // Add timeline entry if status changed or comment provided
    if (status || comment) {
      complaint.timeline.push({
        id: `tl-${Date.now()}`,
        complaint_id: complaint.id,
        user_id: updated_by_id || 'system',
        user_name: updated_by_name || 'System User',
        user_role: updated_by_role || 'staff',
        old_status: oldStatus,
        new_status: status || oldStatus,
        comment: comment || `Status changed from ${oldStatus.toUpperCase()} to ${(status || oldStatus).toUpperCase()}`,
        is_internal: Boolean(is_internal),
        created_at: nowIso,
      });
    }

    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
