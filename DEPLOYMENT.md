# 🚀 Deploying HostBox Portfolio to Netlify

This guide walks you through deploying your HostBox portfolio to Netlify.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ A [GitHub](https://github.com) account
- ✅ A [Netlify](https://netlify.com) account (free tier is fine)
- ✅ Your code pushed to a GitHub repository
- ✅ Your MongoDB Atlas database running (for backend data)

---

## 🗂️ Project Structure

Your project has two parts:

```
HostBox/
├── backend/          # Node.js + Express API (needs separate hosting)
│   ├── server.js
│   └── .env
├── src/              # React + Vite frontend (deploys to Netlify)
├── dist/             # Build output (created by npm run build)
├── netlify.toml      # Netlify configuration
└── package.json
```

⚠️ **Important**: Netlify hosts the **frontend only**. You need to deploy the **backend separately**.

---

## Part 1: Deploy Backend API

Your backend needs to be hosted separately (Netlify doesn't support long-running Node.js servers on free tier).

### Option A: Deploy Backend to Render (Recommended - Free)

1. **Go to [Render.com](https://render.com)** and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `hostbox-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`

5. **Add Environment Variables**:
   - Click **"Environment"** tab
   - Add:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     ADMIN_PASSWORD=admin123
     PORT=3001
     ```

6. Click **"Create Web Service"**
7. Wait for deployment (3-5 minutes)
8. **Copy the URL** (e.g., `https://hostbox-api.onrender.com`)

### Option B: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Add environment variables in the **Variables** tab
5. Copy the generated URL

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Push Your Code to GitHub

If you haven't already:

```bash
cd /home/sfiso/projects/HostBox

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - HostBox Portfolio"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/HostBox.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Netlify

1. **Go to [app.netlify.com](https://app.netlify.com)**
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"GitHub"** and authorize Netlify
4. Select your **HostBox** repository
5. Configure build settings:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

6. Click **"Deploy site"**

### Step 3: Configure Environment Variables

⚠️ **Critical**: Tell your frontend where your backend API is hosted.

1. In Netlify dashboard, go to **Site configuration** → **Environment variables**
2. Click **"Add a variable"**
3. Add:
   ```
   Key: VITE_API_URL
   Value: https://hostbox-api.onrender.com/api
   ```
   *(Replace with your actual backend URL from Part 1)*

4. Click **"Save"**
5. Go to **Deploys** tab and click **"Trigger deploy"** → **"Clear cache and deploy site"**

### Step 4: Wait for Deployment

- Netlify will build your site (2-3 minutes)
- Once done, you'll see: **"Site is live ✅"**
- Click the generated URL (e.g., `https://random-name-12345.netlify.app`)

---

## 🎨 Part 3: Custom Domain (Optional)

### If you have a custom domain:

1. In Netlify dashboard → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `sfisomadonsela.com`)
4. Follow DNS instructions:
   - Add a **CNAME** record pointing to your Netlify URL
   - Or use **Netlify DNS** (easier)

5. Wait for DNS propagation (5 minutes - 48 hours)

### Free Netlify Subdomain

You can also change the random name:
1. Go to **Site configuration** → **Site details**
2. Click **"Change site name"**
3. Choose something like: `sfiso-portfolio.netlify.app`

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch projects" or blank pages

**Cause**: Backend URL not configured or backend is down

**Fix**:
1. Check your backend is running: visit `https://your-backend-url.onrender.com/api/projects`
2. Verify `VITE_API_URL` is set correctly in Netlify environment variables
3. Make sure the URL ends with `/api` (not `/`)
4. Redeploy: **Deploys** → **Trigger deploy** → **Clear cache and deploy**

### Issue: 404 on page refresh

**Cause**: SPA routing not configured

**Fix**: The `netlify.toml` already handles this with:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

If still happening, make sure `netlify.toml` is in the root directory.

### Issue: Build fails with "npm not found"

**Cause**: Wrong Node version

**Fix**: 
1. Go to **Site configuration** → **Environment variables**
2. Add: `NODE_VERSION` = `18`
3. Redeploy

### Issue: Admin login doesn't work

**Cause**: Password mismatch or backend not receiving requests

**Fix**:
1. Check browser console for errors (F12)
2. Verify backend `.env` has correct `ADMIN_PASSWORD`
3. Make sure backend is running (check Render/Railway logs)

### Issue: GitHub repos not showing in Projects app

**Cause**: GitHub API rate limit or incorrect username

**Fix**:
1. Check `ProjectsApp.tsx` line 107 has your correct GitHub username:
   ```typescript
   "https://api.github.com/users/sfisomadonsela274-spec/repos..."
   ```
2. GitHub API allows 60 requests/hour without auth (should be enough)

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Boot screen appears on first load
- [ ] Mobile view works (resize browser or open on phone)
- [ ] All desktop icons open their apps
- [ ] Projects app shows your GitHub repos
- [ ] Certificates app displays your certs
- [ ] Contact form opens email client
- [ ] Admin login works (password: `admin123`)
- [ ] Adding/editing projects works when logged in
- [ ] Window snap works (drag to edges)
- [ ] Power off button returns to landing page

---

## 🔄 Updating Your Site

After making changes:

```bash
# Make your changes, then:
git add .
git commit -m "Update: description of changes"
git push

# Netlify will automatically rebuild and deploy!
```

### Manual Deploy

If auto-deploy is disabled:
1. Go to Netlify dashboard
2. **Deploys** tab
3. Click **"Trigger deploy"**

---

## 📊 Monitor Your Site

### Netlify Analytics (Optional - Paid)

- Go to **Analytics** tab
- See page views, top pages, traffic sources

### Uptime Monitoring (Free)

Use [UptimeRobot](https://uptimerobot.com) to monitor:
- Frontend: `https://your-site.netlify.app`
- Backend: `https://your-backend.onrender.com/api/projects`

---

## 🔒 Security Notes

1. **Backend API**: Currently unprotected endpoints for GET requests (projects, resume)
   - This is intentional for portfolio visibility
   - POST/PUT/DELETE are protected with admin password

2. **Admin Password**: Change `admin123` in production:
   - Update `backend/.env` → `ADMIN_PASSWORD=your_secure_password`
   - Update `src/context/AuthContext.tsx` → `ADMIN_PASSWORD` constant
   - Redeploy both frontend and backend

3. **MongoDB URI**: Never commit `.env` files to Git
   - They're already in `.gitignore`
   - Only set them in Render/Railway dashboard

---

## 🎉 You're Live!

Your portfolio is now deployed! Share your link:
- **Frontend**: `https://your-site.netlify.app`
- Add it to your resume, LinkedIn, GitHub profile

### Next Steps

1. Set up a custom domain
2. Add Google Analytics (optional)
3. Create a `README.md` for your GitHub repo
4. Share on LinkedIn/Twitter
5. Update projects regularly via admin panel

---

## 💬 Need Help?

- **Netlify Docs**: https://docs.netlify.com
- **Render Docs**: https://render.com/docs
- **Vite Docs**: https://vitejs.dev/guide/

**Your portfolio showcases**:
- ✨ Modern tech stack (React, TypeScript, Node.js)
- 🎨 Impressive UI/UX (Desktop OS design)
- 🔧 Full-stack capabilities (Frontend + Backend + Database)
- 🚀 Production deployment skills

Good luck! 🎊