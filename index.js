const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS - helpful if frontend is served separately
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
const activityRoutes = require('./routes/activityRoutes');
app.use('/api', activityRoutes);

// Fallback route for SPA or unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error.message);
});
