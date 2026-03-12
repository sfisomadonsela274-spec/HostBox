// Backend server with Express and MongoDB for HostBox Desktop OS Portfolio
// Uses MongoDB Atlas for permanent data storage
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Middleware
app.use(helmet()); // Basic security headers
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hostbox";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Admin Authentication Middleware
const authMiddleware = (req, res, next) => {
  const password = req.headers["x-admin-password"];
  if (password === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized: Invalid admin password" });
  }
};

// Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  language: { type: String, required: true },
  url: { type: String, required: true },
  demoUrl: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Resume Schema
const resumeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: String,
  email: String,
  phone: String,
  location: String,
  summary: String,
  experience: [
    {
      company: String,
      role: String,
      period: String,
      location: String,
      description: String,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      period: String,
      focus: String,
    },
  ],
  certifications: [
    {
      name: String,
      issuer: String,
      year: String,
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

// Models
const Project = mongoose.model("Project", projectSchema);
const Resume = mongoose.model("Resume", resumeSchema);

// =================== PROJECTS API ===================

// GET all projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single project
app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new project (Protected)
app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update project (Protected)
app.put("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    );
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE project (Protected)
app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =================== RESUME API ===================

// GET resume
app.get("/api/resume", async (req, res) => {
  try {
    let resume = await Resume.findOne();

    // If no resume exists, create a default one
    if (!resume) {
      resume = new Resume({
        name: "Sifiso Sbongiseni Madonsela",
        title: "IT Student & Full Stack Developer",
        email: "sfisomadonsela274@gmail.com",
        phone: "0820487434",
        location: "Bronkhorstspruit, Gauteng, South Africa",
        summary: "Ambitious and motivated IT student with hands-on experience.",
        experience: [],
        education: [],
        certifications: [],
      });
      await resume.save();
    }

    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update resume (Protected)
app.put("/api/resume", authMiddleware, async (req, res) => {
  try {
    let resume = await Resume.findOne();

    if (resume) {
      // Update existing resume
      Object.assign(resume, req.body, { updatedAt: Date.now() });
      await resume.save();
    } else {
      // Create new resume
      resume = new Resume(req.body);
      await resume.save();
    }

    res.json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =================== SERVER ===================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Endpoints:`);
  console.log(`   GET    /api/projects`);
  console.log(`   GET    /api/projects/:id`);
  console.log(`   POST   /api/projects (Protected)`);
  console.log(`   PUT    /api/projects/:id (Protected)`);
  console.log(`   DELETE /api/projects/:id (Protected)`);
  console.log(`   GET    /api/resume`);
  console.log(`   PUT    /api/resume (Protected)`);
  console.log(`✅ Using MongoDB Atlas for permanent storage`);
});
