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

    // Find user by email
    let user = await User.findOne({ email: email.toLowerCase() });

    // Fallback demo user auto-provisioning if first time login
    if (!user) {
      const nameFromEmail = email.split('@')[0].replace('.', ' ');
      user = new User({
        id: `usr-${Date.now()}`,
        name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
        email: email.toLowerCase(),
        role: role || 'student',
        department: role === 'staff' ? 'Faculty & Maintenance' : 'Computer Science & Engineering',
      });
      await user.save();
    }

    // If explicit role requested and differs, update role if needed
    if (role && user.role !== role) {
      user.role = role;
      await user.save();
    }

    const token = `token_${user.id}_${Date.now()}`;

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, role, department } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = new User({
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      role: role || 'student',
      department: department || 'General',
    });

    await newUser.save();
    const token = `token_${newUser.id}_${Date.now()}`;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
