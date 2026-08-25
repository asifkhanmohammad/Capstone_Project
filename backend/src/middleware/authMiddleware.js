import { User } from '../models/User.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const authHeader = req.headers['authorization'];
    
    let resolvedUserId = userId;
    if (!resolvedUserId && authHeader && authHeader.startsWith('Bearer token_jwt_')) {
      const parts = authHeader.replace('Bearer ', '').split('_');
      if (parts.length >= 3) {
        resolvedUserId = parts[2];
      }
    }

    if (!resolvedUserId) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const user = await User.findOne({ id: resolvedUserId });
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired user session.' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Authentication middleware error: ' + err.message });
  }
};

export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: User with role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};
