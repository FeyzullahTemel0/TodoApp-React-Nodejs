// server/index.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { init } = require('./db/database');

const authRoutes    = require('./routes/auth');
const taskRoutes    = require('./routes/tasks');
const listRoutes    = require('./routes/lists');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5000;

init();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/profile', profileRoutes);
app.listen(PORT, () => console.log(`✅ Server: http://localhost:${PORT}`));