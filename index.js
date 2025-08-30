const express = require('express');
const mongoose = require('mongoose');
const Activity = require('./models/activitymodel.js');
const path = require('path');
require('dotenv').config();
const cors = require("cors");

app.use(cors());


const app = express();
const port = process.env.PORT || 3000; // ✅ important for Render

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // ✅ serve static files

// Routes to serve your HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/edit', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/edit.html'));
});

// ... keep all your API routes here ...

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to database');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Connection Failed:', error.message);
  });
