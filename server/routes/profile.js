// server/routes/profile.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const { db } = require('../db/database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Tüm route'lar için auth zorunlu
router.use(authenticate);

// GET /api/profile  → Profil bilgileri
router.get('/', (req, res) => {
  db.get(
    `SELECT username, email, phone, city, district, address, recovery_email, last_password_change
     FROM users WHERE id = ?`,
    [req.user.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    }
  );
});

// PUT /api/profile  → Genel profil güncelleme
router.put('/', (req, res) => {
  const { email, phone, city, district, address, recovery_email } = req.body;
  db.run(
    `UPDATE users SET email = ?, phone = ?, city = ?, district = ?, address = ?, recovery_email = ?
     WHERE id = ?`,
    [email, phone, city, district, address, recovery_email, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(200);
    }
  );
});

// PUT /api/profile/password  → Şifre değiştirme (haftada 1 kez)
router.put('/password', (req, res) => {
  const { oldPassword, newPassword } = req.body;
  db.get(
    `SELECT password, last_password_change FROM users WHERE id = ?`,
    [req.user.id],
    async (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      // Eski şifrenin doğruluğunu kontrol et
      const match = await bcrypt.compare(oldPassword, row.password);
      if (!match) return res.status(400).json({ error: 'Eski şifre yanlış' });
      // Haftalık kısıtlama
      if (row.last_password_change) {
        const diffDays = (Date.now() - new Date(row.last_password_change)) / (1000*60*60*24);
        if (diffDays < 7) return res.status(429).json({ error: 'Şifre haftada bir değiştirilebilir' });
      }
      // Yeni şifreyi kaydet
      const hash = await bcrypt.hash(newPassword, 10);
      const now = new Date().toISOString();
      db.run(
        `UPDATE users SET password = ?, last_password_change = ? WHERE id = ?`,
        [hash, now, req.user.id],
        err2 => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.sendStatus(200);
        }
      );
    }
  );
});

module.exports = router;