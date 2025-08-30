require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Activity = require("./models/activitymodel.js");

const app = express();
const PORT = process.env.PORT || 5000;

/* ===========================
   MIDDLEWARE
   =========================== */
// ✅ Allow ALL origins (temporary fix to remove CORS errors)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Debug logger (check in Render logs)
app.use((req, res, next) => {
  console.log("Request:", req.method, req.url, "Origin:", req.headers.origin);
  next();
});

/* ===========================
   ROUTES
   =========================== */

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// Create new activity
app.post("/api/activities", async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all activities
app.get("/api/activity-list", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get activity by ID
app.get("/api/activity/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get activity by Name
app.get("/api/activity/name/:name", async (req, res) => {
  try {
    const activity = await Activity.findOne({ ActivityName: req.params.name });
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update activity
app.put("/api/activity/:id", async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete activity
app.delete("/api/activity/:id", async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   DATABASE + SERVER START
   =========================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Connection Failed:", error.message);
  });
