// server/ws.js
export function handleWebSocket(io) {
    io.on('connection', (socket) => {
      console.log('A user connected');
  
      // Join a specific room
      socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        socket.currentRoom = roomId;
        console.log(`User joined room: ${roomId}`);
      });
  
      // Handle sending messages to a room
      socket.on('roomMessage', (data) => {
        const { roomId, message, token } = data;
        // Token should be validated on the server side as well (omitted here for brevity)
        io.to(roomId).emit('message', { message, sender: socket.id });
      });
  
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }
  