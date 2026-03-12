# 🔐 Environment Variables Setup Guide

This guide shows you how to set up environment variables for local development and production deployment.

---

## 📋 Overview

HostBox uses environment variables to:
- Connect to MongoDB database
- Set admin password
- Configure API endpoints
- Keep sensitive data out of Git

---

## 🗂️ Environment Files Structure

```
HostBox/
├── .env                    # Frontend env vars (DO NOT commit)
├── .env.example           # Frontend template (safe to commit)
├── backend/
│   ├── .env              # Backend env vars (DO NOT commit)
│   └── .env.example      # Backend template (safe to commit)
```

---

## 🖥️ Backend Environment Variables

### Location: `backend/.env`

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://sfisomadonsela274:Chadbr0sk!@cluster0.lyi41ge.mongodb.net/?appName=Cluster0

# Admin Password for Login
ADMIN_PASSWORD=admin123

# Server Port
PORT=3001
```

### What Each Variable Does:

**MONGODB_URI**:
- Your MongoDB Atlas connection string
- Get it from: https://cloud.mongodb.com → Cluster → Connect → Connect your application
- Format: `mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0`

**ADMIN_PASSWORD**:
- Password for admin login in the portfolio
- Default is `admin123` (change this in production!)
- Used when clicking "Admin Login" in the Start Menu

**PORT**:
- Port the backend server runs on
- Default: `3001`
- Render will override this automatically in production

---

## 🌐 Frontend Environment Variables

### Location: `.env` (root directory)

```env
# Backend API URL
VITE_API_URL=http://localhost:3001/api
```

### For Production:

```env
# Backend API URL (Production)
VITE_API_URL=https://your-backend.onrender.com/api
```

### What It Does:

**VITE_API_URL**:
- URL where your backend API is hosted
- Local development: `http://localhost:3001/api`
- Production: `https://your-backend.onrender.com/api`
- **MUST end with `/api`**

---

## 🚀 Setup Instructions

### Step 1: Create Backend .env

```bash
cd ~/projects/HostBox/backend

# Create .env file
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://sfisomadonsela274:Chadbr0sk!@cluster0.lyi41ge.mongodb.net/?appName=Cluster0
ADMIN_PASSWORD=admin123
PORT=3001
EOF
```

### Step 2: Create Frontend .env

```bash
cd ~/projects/HostBox

# For local development
cat > .env << 'EOF'
VITE_API_URL=http://localhost:3001/api
EOF

# For production (after deploying backend)
# Change to: VITE_API_URL=https://hostbox-backend.onrender.com/api
```

### Step 3: Verify .gitignore

Check that `.env` files are NOT committed to Git:

```bash
cat .gitignore | grep .env
```

Should show:
```
.env
.env.local
backend/.env
```

✅ This means your secrets are safe!

---

## ☁️ Production Setup

### Render.com (Backend)

1. Go to: https://dashboard.render.com
2. Click your **hostbox-backend** service
3. Go to **"Environment"** tab
4. Add these variables:

```
Key: MONGODB_URI
Value: mongodb+srv://sfisomadonsela274:Chadbr0sk!@cluster0.lyi41ge.mongodb.net/?appName=Cluster0

Key: ADMIN_PASSWORD
Value: admin123

Key: PORT
Value: 3001
```

5. Click **"Save Changes"**
6. Render will automatically redeploy

### Netlify (Frontend)

1. Go to: https://app.netlify.com
2. Click your **hostbox** site
3. Go to **Site configuration** → **Environment variables**
4. Click **"Add a variable"**

```
Key: VITE_API_URL
Value: https://hostbox.onrender.com/api
```

5. Go to **Deploys** → **"Trigger deploy"** → **"Clear cache and deploy site"**

---

## 🔄 Local Development

### Start Backend:

```bash
cd ~/projects/HostBox/backend

# Make sure .env exists
ls -la .env

# Start server
npm start
```

Backend runs on: http://localhost:3001

### Start Frontend:

```bash
cd ~/projects/HostBox

# Make sure .env exists
ls -la .env

# Start dev server
npm run dev
```

Frontend runs on: http://localhost:5173

---

## ✅ Verify Setup

### Check Backend:

```bash
# Should connect to MongoDB and start
cd backend
npm start

# In another terminal, test API:
curl http://localhost:3001/api/projects
# Should return JSON (not an error)
```

### Check Frontend:

```bash
# Should build without errors
npm run build

# Should show your backend URL
cat .env
```

### Check Production:

```bash
# Test backend
curl https://hostbox.onrender.com/api/projects
# Should return JSON

# Test frontend
curl https://hostbox.netlify.app
# Should return HTML
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'dotenv'"

**Fix**:
```bash
cd backend
npm install
```

### Error: "MONGODB_URI is not defined"

**Fix**: Backend `.env` file is missing or malformed.

```bash
cd backend
ls -la .env  # Check if exists
cat .env     # Check content
```

Make sure it has:
```
MONGODB_URI=mongodb+srv://...
```

### Error: "Failed to fetch projects" (Frontend)

**Fix**: `VITE_API_URL` not set or wrong.

```bash
# Check local .env
cat .env

# Should have:
VITE_API_URL=http://localhost:3001/api
```

For production, check Netlify env vars.

### Error: MongoDB connection timeout

**Fixes**:

1. **Check MongoDB Atlas Network Access**:
   - Go to: https://cloud.mongodb.com
   - Click **"Network Access"** (left sidebar)
   - Add IP: `0.0.0.0/0` (allow all - needed for Render)

2. **Check MongoDB password**:
   - Make sure password in `MONGODB_URI` matches your Atlas user
   - Special characters? URL-encode them:
     - `!` = `%21`
     - `@` = `%40`
     - `#` = `%23`

3. **Test connection string**:
   ```bash
   # In backend directory
   node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
   # Should print your MongoDB URI
   ```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` files in `.gitignore`
- Use different passwords for development and production
- Rotate MongoDB password every 90 days
- Use environment-specific values (local vs production)

### ❌ DON'T:
- Commit `.env` files to Git
- Share `.env` files in public channels
- Hardcode secrets in source code
- Use same password across environments

---

## 📝 Quick Reference

### Backend .env Template:

```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_PASSWORD=your_secure_password
PORT=3001
```

### Frontend .env Template:

```env
# Local
VITE_API_URL=http://localhost:3001/api

# Production
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🎯 Checklist

Before deploying, ensure:

- [ ] `backend/.env` exists with MongoDB URI
- [ ] `frontend/.env` exists with API URL
- [ ] `.env` files are in `.gitignore`
- [ ] Environment variables set on Render
- [ ] Environment variables set on Netlify
- [ ] MongoDB Atlas allows connections from `0.0.0.0/0`
- [ ] Local development works (backend + frontend)
- [ ] Production API responds to requests

---

## 💡 Tips

1. **Copy from examples**:
   ```bash
   cp backend/.env.example backend/.env
   cp .env.example .env
   # Then edit with your values
   ```

2. **Never commit secrets**:
   ```bash
   git status  # Should NOT show .env files
   ```

3. **Test before deploying**:
   ```bash
   # Start backend
   cd backend && npm start

   # In another terminal, start frontend
   cd .. && npm run dev

   # Test in browser: http://localhost:5173
   ```

---

## 📚 Additional Resources

- MongoDB Atlas: https://cloud.mongodb.com
- Render Dashboard: https://dashboard.render.com
- Netlify Dashboard: https://app.netlify.com
- Dotenv Documentation: https://github.com/motdotla/dotenv

---

**Need help?** Check if your `.env` files match the templates above!