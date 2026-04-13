// Backend server with Express and SQLite for HostBox Desktop OS Portfolio
// Uses SQLite for local/embedded permanent data storage
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();

// Middleware
app.use(cors()); // CORS before helmet
app.use(helmet()); // Basic security headers
app.use(express.json());

// SQLite Database Setup
const dbPath = path.join(__dirname, "hostbox.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ SQLite connection error:", err);
  } else {
    console.log("✅ Connected to SQLite database");
    initializeDatabase();
  }
});

// Promisify db.run and db.all for easier async/await
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initialize Database Tables
function initializeDatabase() {
  // Create projects table
  db.run(
    `CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tags TEXT,
      stars INTEGER DEFAULT 0,
      forks INTEGER DEFAULT 0,
      language TEXT NOT NULL,
      url TEXT NOT NULL,
      demoUrl TEXT,
      image TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) console.error("Error creating projects table:", err);
      else console.log("✅ Projects table initialized");
    }
  );

  // Create resume table
  db.run(
    `CREATE TABLE IF NOT EXISTS resume (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT,
      email TEXT,
      phone TEXT,
      location TEXT,
      summary TEXT,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) console.error("Error creating resume table:", err);
      else console.log("✅ Resume table initialized");
    }
  );

  // Create experience table
  db.run(
    `CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resumeId INTEGER NOT NULL,
      company TEXT,
      role TEXT,
      period TEXT,
      location TEXT,
      description TEXT,
      FOREIGN KEY(resumeId) REFERENCES resume(id)
    )`,
    (err) => {
      if (err) console.error("Error creating experience table:", err);
      else console.log("✅ Experience table initialized");
    }
  );

  // Create education table
  db.run(
    `CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resumeId INTEGER NOT NULL,
      institution TEXT,
      degree TEXT,
      period TEXT,
      focus TEXT,
      FOREIGN KEY(resumeId) REFERENCES resume(id)
    )`,
    (err) => {
      if (err) console.error("Error creating education table:", err);
      else console.log("✅ Education table initialized");
    }
  );

  // Create certifications table
  db.run(
    `CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resumeId INTEGER NOT NULL,
      name TEXT,
      issuer TEXT,
      year TEXT,
      FOREIGN KEY(resumeId) REFERENCES resume(id)
    )`,
    (err) => {
      if (err) console.error("Error creating certifications table:", err);
      else console.log("✅ Certifications table initialized");
    }
  );
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Admin Authentication Middleware
const authMiddleware = (req, res, next) => {
  const password = req.headers["x-admin-password"];
  if (password === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized: Invalid admin password" });
  }
};

// =================== PROJECTS API ===================

// GET all projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await dbAll(
      "SELECT * FROM projects ORDER BY createdAt DESC"
    );

    // Parse tags JSON for each project
    const parsedProjects = projects.map((p) => ({
      ...p,
      _id: p.id,
      tags: p.tags ? JSON.parse(p.tags) : [],
    }));

    res.json(parsedProjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single project
app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await dbGet("SELECT * FROM projects WHERE id = ?", [
      req.params.id,
    ]);

    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json({
      ...project,
      _id: project.id,
      tags: project.tags ? JSON.parse(project.tags) : [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new project (Protected)
app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const { title, description, tags, stars, forks, language, url, demoUrl, image } = req.body;

    if (!title || !description || !language || !url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await dbRun(
      `INSERT INTO projects (title, description, tags, stars, forks, language, url, demoUrl, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        tags ? JSON.stringify(tags) : JSON.stringify([]),
        stars || 0,
        forks || 0,
        language,
        url,
        demoUrl || null,
        image || null,
      ]
    );

    const newProject = await dbGet("SELECT * FROM projects WHERE id = ?", [
      result.id,
    ]);

    res.status(201).json({
      ...newProject,
      _id: newProject.id,
      tags: newProject.tags ? JSON.parse(newProject.tags) : [],
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update project (Protected)
app.put("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, tags, stars, forks, language, url, demoUrl, image } = req.body;

    await dbRun(
      `UPDATE projects
       SET title = ?, description = ?, tags = ?, stars = ?, forks = ?, language = ?, url = ?, demoUrl = ?, image = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title,
        description,
        tags ? JSON.stringify(tags) : JSON.stringify([]),
        stars || 0,
        forks || 0,
        language,
        url,
        demoUrl || null,
        image || null,
        req.params.id,
      ]
    );

    const project = await dbGet("SELECT * FROM projects WHERE id = ?", [
      req.params.id,
    ]);

    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json({
      ...project,
      _id: project.id,
      tags: project.tags ? JSON.parse(project.tags) : [],
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE project (Protected)
app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const project = await dbGet("SELECT * FROM projects WHERE id = ?", [
      req.params.id,
    ]);

    if (!project) return res.status(404).json({ error: "Project not found" });

    await dbRun("DELETE FROM projects WHERE id = ?", [req.params.id]);

    res.json({
      message: "Project deleted successfully",
      project: {
        ...project,
        _id: project.id,
        tags: project.tags ? JSON.parse(project.tags) : [],
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =================== RESUME API ===================

// Helper function to assemble resume with related data
async function assembleResume(resumeId) {
  const resume = await dbGet("SELECT * FROM resume WHERE id = ?", [resumeId]);

  if (!resume) return null;

  const experience = await dbAll(
    "SELECT id, company, role, period, location, description FROM experience WHERE resumeId = ?",
    [resumeId]
  );

  const education = await dbAll(
    "SELECT id, institution, degree, period, focus FROM education WHERE resumeId = ?",
    [resumeId]
  );

  const certifications = await dbAll(
    "SELECT id, name, issuer, year FROM certifications WHERE resumeId = ?",
    [resumeId]
  );

  return {
    _id: resume.id,
    name: resume.name,
    title: resume.title,
    email: resume.email,
    phone: resume.phone,
    location: resume.location,
    summary: resume.summary,
    experience,
    education,
    certifications,
    updatedAt: resume.updatedAt,
  };
}

// GET resume
app.get("/api/resume", async (req, res) => {
  try {
    let resume = await dbGet("SELECT * FROM resume LIMIT 1");

    // If no resume exists, create a default one
    if (!resume) {
      const result = await dbRun(
        `INSERT INTO resume (name, title, email, phone, location, summary)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          "Sifiso Sbongiseni Madonsela",
          "IT Student & Full Stack Developer",
          "sfisomadonsela274@gmail.com",
          "0820487434",
          "Bronkhorstspruit, Gauteng, South Africa",
          "Ambitious and motivated IT student with hands-on experience.",
        ]
      );

      resume = await assembleResume(result.id);
    } else {
      resume = await assembleResume(resume.id);
    }

    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update resume (Protected)
app.put("/api/resume", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      title,
      email,
      phone,
      location,
      summary,
      experience,
      education,
      certifications,
    } = req.body;

    let resumeId;
    let resume = await dbGet("SELECT id FROM resume LIMIT 1");

    if (resume) {
      resumeId = resume.id;
      await dbRun(
        `UPDATE resume SET name = ?, title = ?, email = ?, phone = ?, location = ?, summary = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [name, title, email, phone, location, summary, resumeId]
      );
    } else {
      const result = await dbRun(
        `INSERT INTO resume (name, title, email, phone, location, summary)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, title, email, phone, location, summary]
      );
      resumeId = result.id;
    }

    // Clear and update experience
    if (experience && Array.isArray(experience)) {
      await dbRun("DELETE FROM experience WHERE resumeId = ?", [resumeId]);
      for (const exp of experience) {
        await dbRun(
          `INSERT INTO experience (resumeId, company, role, period, location, description)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [resumeId, exp.company, exp.role, exp.period, exp.location, exp.description]
        );
      }
    }

    // Clear and update education
    if (education && Array.isArray(education)) {
      await dbRun("DELETE FROM education WHERE resumeId = ?", [resumeId]);
      for (const edu of education) {
        await dbRun(
          `INSERT INTO education (resumeId, institution, degree, period, focus)
           VALUES (?, ?, ?, ?, ?)`,
          [resumeId, edu.institution, edu.degree, edu.period, edu.focus]
        );
      }
    }

    // Clear and update certifications
    if (certifications && Array.isArray(certifications)) {
      await dbRun("DELETE FROM certifications WHERE resumeId = ?", [resumeId]);
      for (const cert of certifications) {
        await dbRun(
          `INSERT INTO certifications (resumeId, name, issuer, year)
           VALUES (?, ?, ?, ?)`,
          [resumeId, cert.name, cert.issuer, cert.year]
        );
      }
    }

    const updatedResume = await assembleResume(resumeId);
    res.json(updatedResume);
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
  console.log(`✅ Using SQLite for permanent storage`);
});
