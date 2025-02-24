// public/js/chat.js

const socket = io();
let currentRoom = null;

// Fetch available rooms on page load
async function fetchRooms() {
  try {
    const res = await fetch('/server/list');
    const data = await res.json();
    const roomList = document.getElementById('roomList');
    roomList.innerHTML = '';
    data.rooms.forEach(room => {
      const li = document.createElement('li');
      li.textContent = room.name;
      li.addEventListener('click', () => joinRoom(room.id));
      roomList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}
fetchRooms();

// Create a new room
document.getElementById('createRoomBtn').addEventListener('click', async () => {
  const name = document.getElementById('newRoom').value;
  try {
    const res = await fetch('/server/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (data.error) return alert(data.error);
    fetchRooms();
  } catch (err) {
    console.error(err);
  }
});

// Join a room
async function joinRoom(roomId) {
  currentRoom = roomId;
  socket.emit('joinRoom', roomId);
  // Fetch room messages
  try {
    const res = await fetch(`/chat/${roomId}/messages`);
    const data = await res.json();
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = '';
    data.messages.forEach(msg => {
      const p = document.createElement('p');
      p.textContent = `${msg.username || 'Anon'}: ${msg.message}`;
      chatBox.appendChild(p);
    });
  } catch (err) {
    console.error(err);
  }
}

// Handle sending messages
document.getElementById('messageForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = document.getElementById('messageInput').value;
  if (!currentRoom) return alert('Join a room first');
  
  // Emit to WebSocket
  socket.emit('roomMessage', { roomId: currentRoom, message });
  
  // Save message to DB
  try {
    await fetch(`/chat/${currentRoom}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
  } catch (err) {
    console.error(err);
  }
  
  document.getElementById('messageInput').value = '';
});

// Listen for messages from server
socket.on('message', (data) => {
  const chatBox = document.getElementById('chatBox');
  const p = document.createElement('p');
  p.textContent = `${data.sender}: ${data.message}`;
  chatBox.appendChild(p);
});
