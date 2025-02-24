// server/routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { dbPromise } from '../database.js';
import { generateToken } from '../session.js';
import { logEvent } from '../logger.js';

const router = express.Router();

// Registration endpoint
router.post('/register', [
  body('username').isAlphanumeric().withMessage('Username must be alphanumeric'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;
  const db = await dbPromise;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword]);
    logEvent(`New registration: ${username}`);
    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'User registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const db = await dbPromise;
  try {
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);
    if (!user) return res.status(400).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });
    logEvent(`User logged in: ${username}`);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
