// server/routes/auth.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { db }  = require('../db/database');
const { SECRET } = require('../middleware/auth');
const router  = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Eksik alan' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hash, email],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        const token = jwt.sign({ id: this.lastID, username }, SECRET);
        res.json({ token });
      }
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'Kullanıcı bulunamadı' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Şifre yanlış' });
    const token = jwt.sign({ id: user.id, username }, SECRET);
    res.json({ token });
  });
});

module.exports = router;
