# 🚀 Deploy HostBox via CLI (Zed Terminal)

This guide shows you how to deploy both backend and frontend using CLI commands directly in Zed's terminal.

---

## 📋 Prerequisites

- Git installed and repository initialized
- Node.js 18+ installed
- GitHub account (optional but recommended)

---

## Part 1: Deploy Backend via Railway CLI

Railway is free and has the simplest CLI. We'll use it for the backend.

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

This opens your browser. Sign up/login with GitHub.

### Step 3: Navigate to backend and initialize

```bash
cd backend
railway init
```

Choose:
- **Create new project** → Yes
- **Project name** → `hostbox-backend` (or any name)

### Step 4: Set environment variables

```bash
railway variables set MONGODB_URI="mongodb+srv://sfisomadonsela274:Chadbr0sk!@cluster0.lyi41ge.mongodb.net/?appName=Cluster0"
railway variables set ADMIN_PASSWORD="admin123"
railway variables set PORT="3001"
```

### Step 5: Deploy backend

```bash
railway up
```

Wait 2-3 minutes. Once done, get your URL:

```bash
railway domain
```

This returns something like: `https://hostbox-backend.up.railway.app`

**Copy this URL!** You need it for the frontend.

### Step 6: Test backend

```bash
curl https://YOUR-BACKEND-URL.railway.app/api/projects
```

Should return JSON with projects (or empty array).

### Step 7: Go back to root

```bash
cd ..
```

---

## Part 2: Deploy Frontend via Netlify CLI

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

Or use npx (no install needed):
```bash
# Just add 'npx' before all 'netlify' commands below
```

### Step 2: Login to Netlify

```bash
netlify login
```

Browser opens → Sign up/login with GitHub or email.

### Step 3: Build your project

```bash
npm run build
```

This creates the `dist/` folder.

### Step 4: Initialize Netlify site

```bash
netlify init
```

Choose:
- **Create & configure a new site** → Yes
- **Team** → Your team (or Personal)
- **Site name** → `sfiso-portfolio` (or leave blank for random)
- **Build command** → `npm run build`
- **Directory to deploy** → `dist`

This creates `.netlify/state.json` linking your local project to Netlify.

### Step 5: Set environment variable (Backend URL)

```bash
netlify env:set VITE_API_URL "https://YOUR-BACKEND-URL.railway.app/api"
```

⚠️ **Replace with your actual Railway URL from Part 1, Step 5**

Example:
```bash
netlify env:set VITE_API_URL "https://hostbox-backend.up.railway.app/api"
```

### Step 6: Deploy to production

```bash
netlify deploy --prod
```

It will ask:
- **Publish directory** → `dist` (confirm)

Wait 1-2 minutes. Once done, it shows your live URL!

### Step 7: Get your site URL

```bash
netlify status
```

Copy the **Website URL** (e.g., `https://sfiso-portfolio.netlify.app`)

---

## ✅ Verify Deployment

### Test your live site:

```bash
# Open in browser (macOS/Linux)
xdg-open https://YOUR-SITE.netlify.app

# Or just copy-paste the URL into your browser
```

**Check:**
- ✨ Boot screen appears
- 📱 Resize browser < 768px → Mobile view
- 🖥️ Desktop loads with all apps
- 🗂️ Projects app shows GitHub repos
- 🔐 Admin login works (password: `admin123`)

---

## 🔄 Update Your Site (Future Changes)

After making code changes:

```bash
# 1. Commit changes
git add .
git commit -m "Update: your changes"

# 2. Rebuild
npm run build

# 3. Deploy to Netlify
netlify deploy --prod

# 4. Done! Changes live in 30 seconds
```

**For backend changes:**
```bash
cd backend
railway up
cd ..
```

---

## 🎨 Optional: Custom Domain

### Change site name:

```bash
netlify sites:update --name sfiso-portfolio
```

Your site becomes: `https://sfiso-portfolio.netlify.app`

### Add custom domain:

```bash
netlify domains:add yourdomain.com
```

Follow the DNS instructions shown.

---

## 🔧 Useful Commands

### Netlify:

```bash
netlify status          # Show site info
netlify open            # Open site in browser
netlify open:admin      # Open Netlify dashboard
netlify logs            # View deploy logs
netlify env:list        # List environment variables
netlify build           # Test build locally
```

### Railway:

```bash
railway status          # Show project info
railway logs            # View app logs
railway open            # Open Railway dashboard
railway variables       # List env variables
railway domain          # Show deployed URL
```

---

## 🐛 Troubleshooting

### "netlify: command not found"

Use npx instead:
```bash
npx netlify-cli login
npx netlify-cli init
# etc.
```

### "Failed to fetch projects" in deployed site

Backend not connected. Fix:

```bash
# Check backend URL
railway domain

# Update frontend env var
netlify env:set VITE_API_URL "https://correct-url.railway.app/api"

# Rebuild
npm run build
netlify deploy --prod
```

### Backend keeps sleeping (Railway free tier)

Railway free tier sleeps after inactivity. First request wakes it (10-20 sec delay).

**Fix**: Upgrade to paid Railway plan ($5/mo) or use Render.com instead.

### Build fails

```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## 🚨 Security Note

Your `.env` files are in `.gitignore` and won't be committed. But the MongoDB URI is still visible in Railway dashboard. To secure:

1. Rotate MongoDB password in Atlas
2. Update in Railway: `railway variables set MONGODB_URI="new_uri"`
3. Update `backend/.env` locally

---

## 📊 Monitor Your Sites

### Check if backend is up:

```bash
curl https://YOUR-BACKEND.railway.app/api/projects
```

### Check if frontend is up:

```bash
curl https://YOUR-SITE.netlify.app
```

---

## 🎉 You're Done!

Your portfolio is now live:

- **Frontend**: `https://YOUR-SITE.netlify.app`
- **Backend**: `https://YOUR-BACKEND.railway.app`

Share it everywhere:
- LinkedIn (Featured section)
- GitHub profile README
- Resume
- Job applications

---

## 💡 Pro Tips

1. **Auto-deploy on push**: Both Railway and Netlify support GitHub integration for auto-deploy
2. **Environment per branch**: Netlify can deploy preview branches automatically
3. **Monitoring**: Use UptimeRobot.com to monitor uptime
4. **Analytics**: Enable Netlify Analytics or add Google Analytics

---

Need help? Check `DEPLOYMENT.md` for the full manual guide.

**Happy deploying!** 🚀