const express = require('express');
const mongoose = require('mongoose');
const Activity = require('./models/activitymodel.js');
const path = require('path');
const port = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

//linking front-end(index.html) to port
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//linking front-end(edit.html) to port
app.get('/edit', (req, res) => {
  res.sendFile(path.join(__dirname, 'edit.html'));
});

// Get all activities (full details)
app.get('/api/activities', async (req, res) => {
  try {
    const activities = await Activity.find({});
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all activities with only ID and ActivityName (for listing)
app.get('/api/activity-list', async (req, res) => {
  try {
    const activities = await Activity.find({}, '_id ActivityName').sort({ ActivityName: 1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get activity 
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

// Get activity by ActivityName (case-insensitive)
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

// Create a new activity
app.post('/api/activities', async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update activity by ID
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

//connect to mongoose database
mongoose
  .connect(
    'mongodb+srv://Admin:l3ImvS926o51YsFr@backenddb.z3g64ug.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB'
  )
  .then(() => {
    console.log('Connected to database');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Connection Failed:', error.message);
  });
