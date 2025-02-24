// public/js/auth.js

const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.error) return alert(data.error);
      // Save token or set cookie (here assumed to be set automatically by server)
      window.location.href = 'chat.html';
    } catch (err) {
      console.error(err);
      alert('Login error');
    }
  });
}

const registerBtn = document.getElementById('registerBtn');
if (registerBtn) {
  registerBtn.addEventListener('click', async () => {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.error) return alert(data.error);
      alert('Registration successful');
      window.location.href = 'login.html';
    } catch (err) {
      console.error(err);
      alert('Registration error');
    }
  });
}
