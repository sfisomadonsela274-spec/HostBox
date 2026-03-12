# 🚀 Deploy Backend to Render.com (No CLI Needed)

Render.com is free and has a simple web interface. No CLI installation required!

---

## 📋 What You'll Deploy

- **Backend**: Node.js + Express API
- **Database**: MongoDB Atlas (already set up)
- **Cost**: FREE (Render free tier)

---

## Step 1: Sign Up for Render

1. Go to: https://render.com
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (easiest option)
4. Authorize Render to access your GitHub

---

## Step 2: Create a New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select: **HostBox**
5. Click **"Connect"**

---

## Step 3: Configure Your Service

Fill in these settings:

### Basic Settings:
- **Name**: `hostbox-backend` (or any name you like)
- **Region**: Choose closest to you (e.g., `Frankfurt (EU Central)` or `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`

### Build & Deploy:
- **Build Command**: `npm install` (⚠️ NOT `npm run build` - backend has no build step)
- **Start Command**: `node server.js` (or `npm start`)

### Instance Type:
- **Select**: `Free` (should be pre-selected)

---

## Step 4: Add Environment Variables

Scroll down to **"Environment Variables"** section:

Click **"Add Environment Variable"** and add these **3 variables**:

### Variable 1:
- **Key**: `MONGODB_URI`
- **Value**: `mongodb+srv://sfisomadonsela274:Chadbr0sk!@cluster0.lyi41ge.mongodb.net/?appName=Cluster0`

### Variable 2:
- **Key**: `ADMIN_PASSWORD`
- **Value**: `admin123`

### Variable 3:
- **Key**: `PORT`
- **Value**: `3001`

### Variable 4 (Optional - Node version):
- **Key**: `NODE_VERSION`
- **Value**: `18`

---

## Step 5: Deploy!

1. Click **"Create Web Service"** (bottom of page)
2. Wait 3-5 minutes while Render:
   - Installs dependencies
   - Starts your server
   - Assigns you a URL

You'll see a live log showing the deployment progress.

---

## Step 6: Get Your Backend URL

Once deployed (status shows "Live" with a green dot):

**Note**: If you see "Build failed", make sure Build Command is `npm install` (NOT `npm run build`). The backend is plain Node.js and doesn't need a build step.

1. Look at the top of the page
2. You'll see a URL like: `https://hostbox-backend.onrender.com`
3. **Copy this URL** — you need it for the frontend!

### Test Your Backend:

Click on your URL and add `/api/projects` at the end:
```
https://hostbox-backend.onrender.com/api/projects
```

You should see JSON data (or an empty array `[]` if no projects yet).

---

## Step 7: Deploy Frontend to Netlify

Now that your backend is running, deploy the frontend:

### Via Netlify Web UI:

1. Go to: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"GitHub"**
4. Select your **HostBox** repository
5. Configure:
   - **Branch**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

6. Click **"Show advanced"** → **"New variable"**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://YOUR-BACKEND-URL.onrender.com/api`
   - ⚠️ Replace with YOUR actual Render URL from Step 6

7. Click **"Deploy site"**
8. Wait 2-3 minutes

### Via Netlify CLI (if you prefer):

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Set backend URL
netlify env:set VITE_API_URL "https://YOUR-BACKEND-URL.onrender.com/api"

# Build and deploy
npm run build
netlify deploy --prod
```

---

## ✅ Verify Deployment

### Check Backend:
Visit: `https://your-backend.onrender.com/api/projects`
- Should return JSON (not an error page)

### Check Frontend:
Visit your Netlify URL (e.g., `https://random-name.netlify.app`)
- Boot screen should appear
- Desktop should load
- Projects should load from GitHub

---

## 🔄 Update Your Site Later

### Backend Updates:
1. Push code to GitHub: `git push`
2. Render **automatically redeploys** (takes 2-3 min)

### Frontend Updates:
1. Push code to GitHub: `git push`
2. Netlify **automatically redeploys** (takes 1-2 min)

**That's it!** Both services watch your GitHub repo.

---

## 🐛 Troubleshooting

### Backend shows "Build failed"

**Check the logs** in Render dashboard:
- Click on your service
- Click **"Logs"** tab
- Look for error messages

**Common fixes:**
- Make sure `Root Directory` is set to `backend`
- Make sure `Start Command` is `node server.js`
- Check environment variables are set correctly

### Backend shows "Your service is starting"

Render free tier **sleeps after 15 minutes** of inactivity.
- First request takes 10-20 seconds (wakes up the service)
- This is normal on free tier
- Upgrade to paid ($7/mo) for always-on

### Frontend shows "Failed to fetch projects"

**Backend URL not set correctly:**

1. Go to Netlify dashboard → Your site
2. Click **"Site configuration"** → **"Environment variables"**
3. Verify `VITE_API_URL` is correct:
   - Should end with `/api`
   - Should be your Render URL
4. Click **"Deploys"** → **"Trigger deploy"** → **"Clear cache and deploy"**

### MongoDB connection fails

**Check your MongoDB Atlas:**
1. Go to: https://cloud.mongodb.com
2. Click **"Network Access"**
3. Add IP: `0.0.0.0/0` (allow all - needed for Render)
4. Click **"Database Access"**
5. Verify user `sfisomadonsela274` exists with correct password

---

## 💡 Pro Tips

### 1. View Logs
In Render dashboard → Click your service → **"Logs"** tab
See real-time server logs and errors

### 2. Disable Auto-Deploy (if needed)
Settings → **Auto-Deploy**: OFF
Then deploy manually from GitHub branches

### 3. Custom Domain
In Render:
- Settings → **Custom Domain**
- Add your domain
- Update DNS records (Render shows instructions)

In Netlify:
- Domain management → **Add custom domain**
- Follow DNS setup

### 4. Monitor Uptime
Use **UptimeRobot.com** (free) to monitor:
- Backend: `https://your-backend.onrender.com/api/projects`
- Frontend: `https://your-site.netlify.app`
Gets notified if your site goes down.

---

## 🎉 You're Done!

Your portfolio is now live!

**URLs:**
- Frontend: `https://your-site.netlify.app`
- Backend: `https://your-backend.onrender.com`

**Share it:**
- Add to LinkedIn (Featured section)
- Add to resume
- GitHub profile README
- Job applications

---

## 📊 What You've Deployed

### Tech Stack:
- **Frontend**: React + TypeScript + Vite → Netlify
- **Backend**: Node.js + Express → Render
- **Database**: MongoDB Atlas → Cloud
- **Total Cost**: $0 (all free tiers!)

### Features Live:
- ✨ Boot screen
- 📱 Mobile responsive
- 🖥️ Desktop OS interface
- 🪟 Window snapping
- 🔐 Admin authentication
- 🏆 Certificates display
- 🐙 GitHub API integration
- ⏻ Power off functionality

---

## 🔒 Security Checklist

- [ ] Change admin password from `admin123` in production
- [ ] Keep `.env` files out of Git (already in `.gitignore`)
- [ ] Rotate MongoDB password every 90 days
- [ ] Enable 2FA on GitHub, Render, and Netlify accounts

---

## 📚 Additional Resources

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **MongoDB Atlas**: https://cloud.mongodb.com

---

**Need help?** Check the Render logs first — they usually show the exact error!