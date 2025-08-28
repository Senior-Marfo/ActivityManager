const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const Activity = require('./models/activitymodel.js'); // Ensure the model is correct

require('dotenv').config(); // Use .env for sensitive values

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Optional: needed if frontend is deployed separately
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'your-fallback-mongo-uri-here', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // Start server after DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

/* ---------- API ROUTES ---------- */

// Get all activities
app.get('/api/activities', async (req, res) => {
  try {
    const activities = await Activity.find({});
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List of activities (just name + ID)
app.get('/api/activity-list', async (req, res) => {
  try {
    const activities = await Activity.find({}, '_id ActivityName').sort({ ActivityName: 1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get activity by ID
app.get('/api/activity/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid activity ID format' });
    }

    const activity = await Activity.findById(id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get activity by name (case-insensitive)
app.get('/api/activity/name/:activityName', async (req, res) => {
  try {
    const { activityName } = req.params;
    const activity = await Activity.findOne({
      ActivityName: new RegExp(`^${activityName}$`, 'i'),
    });

    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create activity
app.post('/api/activities', async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update activity
app.put('/api/activity/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid activity ID format' });
    }

    const activity = await Activity.findByIdAndUpdate(id, req.body, { new: true });
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete activity
app.delete('/api/activity/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid activity ID format' });
    }

    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ---------- CATCH-ALL ROUTE (for frontend) ---------- */

// Fallback to index.html for all non-API GET requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
