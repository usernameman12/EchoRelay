// server/routes/chat.js
import express from 'express';
import { authenticateToken } from '../session.js';
import { dbPromise } from '../database.js';
import { logEvent } from '../logger.js';

const router = express.Router();

// Fetch chatroom messages
router.get('/:roomId/messages', authenticateToken, async (req, res) => {
  const { roomId } = req.params;
  const db = await dbPromise;
  try {
    const messages = await db.all(`SELECT m.*, u.username FROM messages m LEFT JOIN users u ON m.user_id = u.id WHERE chatroom_id = ? ORDER BY timestamp`, [roomId]);
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch messages' });
  }
});

// Save message endpoint (for logging/persistence)
router.post('/:roomId/messages', authenticateToken, async (req, res) => {
  const { roomId } = req.params;
  const { message } = req.body;
  const user = req.user;
  const db = await dbPromise;
  try {
    await db.run(`INSERT INTO messages (user_id, chatroom_id, message) VALUES (?, ?, ?)`, [user.id, roomId, message]);
    logEvent(`Message from ${user.username} in room ${roomId}: ${message}`);
    res.json({ message: 'Message saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save message' });
  }
});

export default router;
