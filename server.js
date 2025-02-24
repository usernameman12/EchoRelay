// server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './server/routes/auth.js';
import chatRoutes from './server/routes/chat.js';
import adminRoutes from './server/routes/admin.js';
import serverRoutes from './server/routes/server.js';
import { handleWebSocket } from './server/ws.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/admin', adminRoutes);
app.use('/server', serverRoutes);

handleWebSocket(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
