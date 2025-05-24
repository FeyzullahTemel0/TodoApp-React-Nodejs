// server/routes/todos.js
const express = require('express');
const router  = express.Router();
const { db }  = require('../db/database');

// GET /api/todos
router.get('/', (req, res) => {
  db.all('SELECT * FROM todos ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/todos
router.post('/', (req, res) => {
  const { title, time } = req.body;
  db.run(
    'INSERT INTO todos (title, time) VALUES (?, ?)',
    [title, time],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// PUT /api/todos/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed, time } = req.body;
  db.run(
    'UPDATE todos SET title = ?, completed = ?, time = ? WHERE id = ?',
    [title, completed, time, id],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(200);
    }
  );
});

// DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM todos WHERE id = ?', [id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(200);
  });
});

module.exports = router;
