// server/db/database.js
const sqlite3 = require('sqlite3').verbose();
const path    = require('path');
const dbPath  = path.join(__dirname, '../todos.db');

const db = new sqlite3.Database(dbPath, err => {
  if (err) console.error('DB bağlanma hatası:', err);
  else console.log('SQLite bağlandı:', dbPath);
});

const init = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id                   INTEGER PRIMARY KEY AUTOINCREMENT,
        username             TEXT    UNIQUE NOT NULL,
        password             TEXT    NOT NULL,
        email                TEXT    UNIQUE NOT NULL,
        phone                TEXT,
        city                 TEXT,
        district             TEXT,
        address              TEXT,
        recovery_email       TEXT,
        last_password_change TEXT
      );
    `);

    // Diğer tablolar...
  });
};

module.exports = { db, init };