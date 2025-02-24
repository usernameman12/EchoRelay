// public/js/servers.js

async function listRooms() {
    try {
      const res = await fetch('/server/list');
      const data = await res.json();
      const roomsList = document.getElementById('roomsList');
      roomsList.innerHTML = '';
      data.rooms.forEach(room => {
        const li = document.createElement('li');
        li.textContent = room.name;
        roomsList.appendChild(li);
      });
    } catch (err) {
      console.error(err);
    }
  }
  listRooms();
  