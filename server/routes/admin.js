// server/routes/admin.js
import express from 'express';
import { authenticateToken } from '../session.js';
import { dbPromise } from '../database.js';
import { logEvent } from '../logger.js';

const router = express.Router();

// Middleware to ensure admin role
router.use(authenticateToken, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  next();
});

// List all users
router.get('/users', async (req, res) => {
  const db = await dbPromise;
  try {
    const users = await db.all(`SELECT id, username, role FROM users`);
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch users' });
  }
});

// Delete a user (for admin purposes)
router.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const db = await dbPromise;
  try {
    await db.run(`DELETE FROM users WHERE id = ?`, [userId]);
    logEvent(`User deleted: ${userId} by admin ${req.user.username}`);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete user' });
  }
});

export default router;
