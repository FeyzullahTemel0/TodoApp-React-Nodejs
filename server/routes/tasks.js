// 4) server/routes/tasks.js
const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { authenticate } = require('../middleware/auth');

// Apply auth middleware
router.use(authenticate);

// GET active todos
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM todos WHERE user_id = ? AND deleted = 0 ORDER BY id DESC',
    [req.user.id],
    (err, rows) => err ? res.status(500).json({error:err.message}) : res.json(rows)
  );
});

// GET deleted last 24h (limit 30)
router.get('/deleted', (req, res) => {
  const since = new Date(Date.now() - 24*3600*1000).toISOString();
  db.all(
    'SELECT * FROM todos WHERE user_id = ? AND deleted = 1 AND deleted_at > ? ORDER BY deleted_at DESC LIMIT 30',
    [req.user.id, since],
    (err, rows) => err ? res.status(500).json({error:err.message}) : res.json(rows)
  );
});

// POST new todo
router.post('/', (req, res) => {
  const { title, time } = req.body;
  const date = new Date().toISOString();
  db.run(
    'INSERT INTO todos (user_id,title,time,date) VALUES (?,?,?,?)',
    [req.user.id, title, time, date],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// PUT update or restore
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed, time, action } = req.body;
  let sql, params;
  if (action === 'restore') {
    sql = 'UPDATE todos SET deleted = 0, deleted_at = NULL WHERE id = ? AND user_id = ?';
    params = [id, req.user.id];
  } else {
    sql = 'UPDATE todos SET title = ?, completed = ?, time = ? WHERE id = ? AND user_id = ?';
    params = [title, completed, time, id, req.user.id];
  }
  db.run(sql, params, err => err ? res.status(500).json({error:err.message}) : res.sendStatus(200));
});

// DELETE (soft delete)
router.delete('/:id', (req, res) => {
  const now = new Date().toISOString();
  db.run(
    'UPDATE todos SET deleted = 1, deleted_at = ? WHERE id = ? AND user_id = ?',
    [now, req.params.id, req.user.id],
    err => err ? res.status(500).json({error:err.message}) : res.sendStatus(200)
  );
});

module.exports = router;
