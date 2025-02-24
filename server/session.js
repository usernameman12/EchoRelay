// server/session.js
import jwt from 'jsonwebtoken';
const SECRET = 'yourSuperSecretKey'; // move to config for production

export function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: '1h' });
}

export function authenticateToken(req, res, next) {
  const token = req.cookies.token || req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalid' });
    req.user = user;
    next();
  });
}
