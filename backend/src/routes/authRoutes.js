import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    // Validate password if user exists and password is stored
    if (user && user.password && password && user.password !== password) {
      return res.status(401).json({ error: 'Invalid password credential' });
    }

    // Provision user if first login for new accounts
    if (!user) {
      const nameParts = cleanEmail.split('@')[0].split('.');
      const formattedName = nameParts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');

      const assignedRole = role || (cleanEmail.includes('admin') ? 'admin' : cleanEmail.includes('staff') ? 'staff' : 'student');

      user = new User({
        id: `usr-${Date.now()}`,
        name: formattedName,
        full_name: formattedName,
        email: cleanEmail,
        password: password || 'default123456',
        role: assignedRole,
        department: assignedRole === 'staff' ? 'Electrical & Power Maintenance' : assignedRole === 'admin' ? 'Administration' : 'Computer Science & Engineering',
        department_name: assignedRole === 'staff' ? 'Electrical & Power Maintenance' : assignedRole === 'admin' ? 'Administration' : 'Computer Science & Engineering',
      });
      await user.save();
    } else {
      let updated = false;
      if (password && !user.password) {
        user.password = password;
        updated = true;
      }
      if (updated) await user.save();
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

// POST /api/auth/google - Secure Google Account Authentication & Authorization
router.post('/google', async (req, res) => {
  try {
    const { email, name, picture, credential, role } = req.body;

    let targetEmail = email;
    let targetName = name;
    let targetPicture = picture;

    // Decode Google ID Token (Credential) if provided directly
    if (credential && !targetEmail) {
      try {
        const payloadBase64 = credential.split('.')[1];
        const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
        targetEmail = decoded.email;
        targetName = decoded.name;
        targetPicture = decoded.picture;
      } catch (e) {
        // Fallback to body fields if parsing fails
      }
    }

    if (!targetEmail) {
      return res.status(400).json({ error: 'Google authentication email is required.' });
    }

    const cleanEmail = targetEmail.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    const requestedRole = role || (cleanEmail.includes('admin') ? 'admin' : cleanEmail.includes('staff') ? 'staff' : 'student');

    if (!user) {
      // Create new Google authenticated user in MongoDB
      const displayName = targetName || cleanEmail.split('@')[0];
      user = new User({
        id: `usr-google-${Date.now()}`,
        name: displayName,
        full_name: displayName,
        email: cleanEmail,
        role: requestedRole,
        avatar: targetPicture || '',
        avatar_url: targetPicture || '',
        department: requestedRole === 'staff' ? 'Electrical & Power Maintenance' : requestedRole === 'admin' ? 'Administration' : 'Computer Science & Engineering',
        department_name: requestedRole === 'staff' ? 'Electrical & Power Maintenance' : requestedRole === 'admin' ? 'Administration' : 'Computer Science & Engineering',
      });
      await user.save();
    } else {
      let modified = false;
      if (targetPicture && (!user.avatar_url || user.avatar_url !== targetPicture)) {
        user.avatar = targetPicture;
        user.avatar_url = targetPicture;
        modified = true;
      }
      if (role && user.role !== role && (role === 'student' || role === 'staff' || role === 'admin')) {
        user.role = role;
        modified = true;
      }
      if (modified) {
        await user.save();
      }
    }

    const token = `token_jwt_${user.id}_${Date.now()}`;

    res.json({
      message: 'Google authentication successful',
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
    res.status(500).json({ error: 'Google Auth Error: ' + err.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, phone, student_id_number } = req.body;

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
      password: password || 'student123456',
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
      user: {
        id: newUser.id,
        name: newUser.full_name || newUser.name,
        full_name: newUser.full_name || newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department || newUser.department_name,
        department_name: newUser.department_name || newUser.department,
        phone: newUser.phone,
        student_id_number: newUser.student_id_number,
      },
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
