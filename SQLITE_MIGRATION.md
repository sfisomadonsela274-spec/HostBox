# 🗄️ SQLite Migration Guide

## Overview

Your HostBox backend has been migrated from **MongoDB Atlas** to **SQLite**. This eliminates the network connection issues you were experiencing and provides several benefits:

### ✅ Benefits of SQLite

| Aspect | MongoDB Atlas | SQLite |
|--------|---------------|--------|
| **Setup** | Cloud account + IP whitelisting required | Zero setup - works out of the box |
| **Network** | Requires internet connection | Runs locally |
| **Connection Issues** | Common (timeouts, IP blocking) | Never happens |
| **Deployment** | Needs database URI + environment variables | Just one file (`hostbox.db`) |
| **Cost** | Free tier has limits | Completely free, no limits |
| **Performance** | Network latency | Instant local access |
| **Data Portability** | Locked in MongoDB | Single file to backup/share |

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

This installs the `sqlite3` package which replaces Mongoose.

### 2. Environment Variables

You **do NOT need** `MONGODB_URI` anymore. Your `.env` file can now be simpler:

```env
# .env
ADMIN_PASSWORD=your_secure_password_here
PORT=3001
DB_PATH=./hostbox.db
```

If `DB_PATH` is not set, it defaults to `./hostbox.db` in the backend directory.

### 3. Start the Server

```bash
npm start
```

The first time you run it, SQLite will automatically:
- ✅ Create the database file
- ✅ Create all tables
- ✅ Initialize default resume data

You should see output like:
```
✅ Connected to SQLite database at: /path/to/hostbox.db
✅ Projects table ready
✅ Resume table ready
✅ Experience table ready
✅ Education table ready
✅ Certifications table ready
✅ Default resume initialized
🚀 Server running on http://localhost:3001
```

---

## 📊 Database Schema

### Tables

**projects**
```sql
id (TEXT PRIMARY KEY)
title (TEXT, required)
description (TEXT, required)
tags (TEXT - JSON array)
stars (INTEGER)
forks (INTEGER)
language (TEXT, required)
url (TEXT, required)
demoUrl (TEXT, optional)
image (TEXT, optional)
createdAt (TEXT - ISO timestamp)
updatedAt (TEXT - ISO timestamp)
```

**resume**
```sql
id (TEXT PRIMARY KEY)
name (TEXT, required)
title (TEXT)
email (TEXT)
phone (TEXT)
location (TEXT)
summary (TEXT)
updatedAt (TEXT - ISO timestamp)
```

**experience** (related to resume via resumeId)
```sql
id (TEXT PRIMARY KEY)
resumeId (TEXT - foreign key)
company (TEXT)
role (TEXT)
period (TEXT)
location (TEXT)
description (TEXT)
```

**education** (related to resume via resumeId)
```sql
id (TEXT PRIMARY KEY)
resumeId (TEXT - foreign key)
institution (TEXT)
degree (TEXT)
period (TEXT)
focus (TEXT)
```

**certifications** (related to resume via resumeId)
```sql
id (TEXT PRIMARY KEY)
resumeId (TEXT - foreign key)
name (TEXT)
issuer (TEXT)
year (TEXT)
```

---

## 🔄 Data Migration from MongoDB

If you have existing data in MongoDB, here's how to migrate it:

### Option 1: Export from MongoDB & Import

```bash
# 1. Export your MongoDB collections
mongoexport --uri "your_mongodb_uri" --collection projects --out projects.json
mongoexport --uri "your_mongodb_uri" --collection resumes --out resumes.json

# 2. Create a migration script (see example below)
# 3. Run the migration script
node migrate-mongo-to-sqlite.js
```

### Option 2: Manually Copy Data via API

If you have a MongoDB instance still running:

1. Get all projects from your MongoDB backend
2. POST them to your new SQLite backend with admin password
3. Get resume data and PUT it to new backend

```bash
# Get projects from old MongoDB backend
curl https://old-backend.com/api/projects > projects.json

# POST each project to new SQLite backend
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "x-admin-password: your_password" \
  -d @projects.json
```

### Option 3: Start Fresh

If you don't have important data in MongoDB, just start fresh with SQLite. The backend creates a default resume automatically.

---

## 📁 File Structure

```
HostBox/
├── backend/
│   ├── server.js          # New SQLite implementation
│   ├── package.json       # Updated dependencies
│   ├── hostbox.db         # SQLite database (auto-created)
│   └── .env               # Environment variables
└── ...
```

### The `hostbox.db` File

This is your entire database. It's a single file that:
- Contains all tables and data
- Is created automatically on first run
- Should be added to `.gitignore` (sensitive data)
- Can be backed up by simply copying the file
- Can be inspected with SQLite tools like DBeaver or sqlite3 CLI

**Add to `.gitignore`:**
```
backend/hostbox.db
backend/node_modules/
```

---

## 🔌 API Compatibility

All endpoints remain **100% compatible**:

```
GET    /api/projects              ✅ Same response
GET    /api/projects/:id          ✅ Same response
POST   /api/projects              ✅ Same request/response
PUT    /api/projects/:id          ✅ Same request/response
DELETE /api/projects/:id          ✅ Same response

GET    /api/resume                ✅ Same response
PUT    /api/resume                ✅ Same request/response
```

The frontend doesn't need **any changes**. Just update the backend and everything continues to work.

---

## 🛠️ Development & Testing

### Local Development

```bash
cd backend
npm start
```

The database starts fresh (or loads existing `hostbox.db`). All API endpoints work immediately.

### Testing with curl

```bash
# Get all projects
curl http://localhost:3001/api/projects

# Create a project (with auth)
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "x-admin-password: admin123" \
  -d '{
    "title": "My Project",
    "description": "A cool project",
    "language": "JavaScript",
    "url": "https://github.com/user/project",
    "tags": ["web", "react"]
  }'

# Get resume
curl http://localhost:3001/api/resume

# Update resume (with auth)
curl -X PUT http://localhost:3001/api/resume \
  -H "Content-Type: application/json" \
  -H "x-admin-password: admin123" \
  -d '{
    "name": "Your Name",
    "title": "Your Title",
    "email": "your@email.com",
    "phone": "1234567890",
    "location": "Your Location",
    "summary": "Your professional summary",
    "experience": [],
    "education": [],
    "certifications": []
  }'
```

### Inspecting the Database

You can view the SQLite database directly:

```bash
# Open SQLite CLI
sqlite3 backend/hostbox.db

# View tables
.tables

# Query data
SELECT * FROM projects;
SELECT * FROM resume;

# Exit
.quit
```

Or use a GUI tool like [DBeaver](https://dbeaver.io/) or [SQLite Browser](https://sqlitebrowser.org/).

---

## 🚀 Deployment to Render

### Step 1: Update Environment Variables

In Render Dashboard:
1. Go to your **hostbox-backend** service
2. Click **Environment** tab
3. **Delete** `MONGODB_URI` (no longer needed)
4. **Add/Keep** `ADMIN_PASSWORD`
5. **Add** `DB_PATH=/var/data/hostbox.db` (persistent storage)

### Step 2: Enable Persistent Disk (Important!)

Without this, your database resets every time Render restarts your service.

1. Go to your service settings
2. Scroll to **Disks**
3. Click **Add Disk**
4. Set:
   - **Name**: `data`
   - **Path**: `/var/data`
   - **Size**: 1 GB (plenty for a portfolio site)
5. Click **Create Disk**

### Step 3: Update Environment Variable

Change `DB_PATH` to:
```
DB_PATH=/var/data/hostbox.db
```

### Step 4: Deploy

Push to GitHub - Render will automatically:
1. Install npm dependencies
2. Start the server
3. Create SQLite database on persistent disk
4. Run with no network timeout issues ✅

---

## 🔒 Security Considerations

### Backup Your Data

```bash
# Backup your database
cp backend/hostbox.db backend/hostbox.db.backup

# Restore from backup
cp backend/hostbox.db.backup backend/hostbox.db
```

### Keep `.gitignore` Updated

```
# .gitignore
backend/hostbox.db
backend/hostbox.db.backup
backend/node_modules/
```

Never commit the database file to GitHub (it contains your data).

### Admin Password

Change the default admin password in your `.env`:
```env
ADMIN_PASSWORD=MySecurePassword123!@#
```

---

## 🐛 Troubleshooting

### Database doesn't exist on first run

**Solution**: The server creates it automatically. Check server logs.

```bash
npm start
# Should show: ✅ Connected to SQLite database
```

### "Cannot find module 'sqlite3'"

**Solution**: Install dependencies:
```bash
cd backend
npm install
```

### Data not persisting on Render

**Solution**: Make sure you added the persistent disk with path `/var/data` and set `DB_PATH=/var/data/hostbox.db`.

### "database is locked" error

**Solution**: This happens if multiple processes try to write simultaneously. It's rare but restart the server:

```bash
# On Render: Manual Restart in dashboard
# Locally: Stop (Ctrl+C) and restart
npm start
```

---

## ✅ Verification Checklist

- [ ] `npm install` completes successfully
- [ ] `npm start` shows SQLite connection messages
- [ ] Database file `hostbox.db` is created
- [ ] `curl http://localhost:3001/api/projects` returns JSON
- [ ] `curl http://localhost:3001/api/resume` returns resume data
- [ ] Admin password works (POST/PUT with `-H "x-admin-password: ..."`
- [ ] Frontend still works (no code changes needed)
- [ ] `hostbox.db` is in `.gitignore`
- [ ] Render has persistent disk configured
- [ ] Render environment variables updated

---

## 🎉 You're Done!

Your HostBox backend now runs on SQLite with:
- ✅ No MongoDB connection issues
- ✅ Instant startup
- ✅ No IP whitelisting needed
- ✅ Single file database
- ✅ Same API for frontend
- ✅ Easy backup/restore

The nightmare of MongoDB timeouts is over! 🎊

---

## 📚 Reference

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Node.js sqlite3 Module](https://github.com/mapbox/node-sqlite3)
- [Express.js](https://expressjs.com/)
- [Render Persistent Disks](https://render.com/docs/disks)

---

**Questions?** Check the logs:
```bash
# Local
npm start

# Render
Dashboard → hostbox-backend → Logs tab
```
