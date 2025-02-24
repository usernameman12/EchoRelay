// server/routes/server.js
import express from 'express';
import { authenticateToken } from '../session.js';
import { dbPromise } from '../database.js';
import { logEvent } from '../logger.js';

const router = express.Router();

// Create a new chatroom/server
router.post('/create', authenticateToken, async (req, res) => {
  const { name } = req.body;
  const user = req.user;
  const db = await dbPromise;
  try {
    await db.run(`INSERT INTO chatrooms (name, owner) VALUES (?, ?)`, [name, user.id]);
    logEvent(`Chatroom created: ${name} by ${user.username}`);
    res.json({ message: 'Chatroom created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create chatroom' });
  }
});

// List all chatrooms
router.get('/list', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  try {
    const rooms = await db.all(`SELECT * FROM chatrooms`);
    res.json({ rooms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch chatrooms' });
  }
});

export default router;
