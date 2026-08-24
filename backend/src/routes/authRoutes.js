import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    // Provision user if first login for demo accounts
    if (!user) {
      const nameParts = cleanEmail.split('@')[0].split('.');
      const formattedName = nameParts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');

      user = new User({
        id: `usr-${Date.now()}`,
        name: formattedName,
        full_name: formattedName,
        email: cleanEmail,
        role: role || 'student',
        department: role === 'staff' ? 'Electrical & Power Maintenance' : 'Computer Science & Engineering',
        department_name: role === 'staff' ? 'Electrical & Power Maintenance' : 'Computer Science & Engineering',
      });
      await user.save();
    } else if (role && user.role !== role) {
      user.role = role;
      await user.save();
    }

    const token = `token_jwt_${user.id}_${Date.now()}`;

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.full_name || user.name,
        full_name: user.full_name || user.name,
        email: user.email,
        role: user.role,
        department: user.department || user.department_name,
        department_name: user.department_name || user.department,
        department_id: user.department_id,
        phone: user.phone,
        avatar_url: user.avatar_url || user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, role, department, phone, student_id_number } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: cleanEmail });

    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = new User({
      id: `usr-${Date.now()}`,
      name,
      full_name: name,
      email: cleanEmail,
      role: role || 'student',
      department: department || 'Computer Science & Engineering',
      department_name: department || 'Computer Science & Engineering',
      phone,
      student_id_number,
    });

    await newUser.save();
    const token = `token_jwt_${newUser.id}_${Date.now()}`;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'User ID header missing' });

    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
