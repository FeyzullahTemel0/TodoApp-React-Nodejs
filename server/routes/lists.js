// 5) server/routes/lists.js
const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET all lists
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM lists WHERE user_id = ?',
    [req.user.id],
    (err, rows) => err ? res.status(500).json({error:err.message}) : res.json(rows)
  );
});

// POST create list
router.post('/', (req, res) => {
  const { name, items } = req.body; // items = [{title,time},...]
  db.run(
    'INSERT INTO lists (user_id,name) VALUES (?,?)',
    [req.user.id, name],
    function(err) {
      if (err) return res.status(500).json({error:err.message});
      const listId = this.lastID;
      const stmt = db.prepare('INSERT INTO list_items (list_id,title,time) VALUES (?,?,?)');
      items.forEach(i => stmt.run(listId, i.title, i.time));
      stmt.finalize();
      res.status(201).json({ id: listId });
    }
  );
});

// POST apply list
router.post('/:id/apply', (req, res) => {
  const listId = req.params.id;
  db.all('SELECT title,time FROM list_items WHERE list_id = ?', [listId], (err, items) => {
    if (err) return res.status(500).json({error:err.message});
    const date = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO todos (user_id,title,time,date) VALUES (?,?,?,?)');
    items.forEach(i => stmt.run(req.user.id, i.title, i.time, date));
    stmt.finalize(() => res.sendStatus(201));
  });
});

module.exports = router;