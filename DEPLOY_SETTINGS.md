# ⚡ Quick Deployment Settings Reference

Copy-paste these exact settings when deploying.

---

## 🗄️ Backend Deployment (Render.com)

**URL**: https://render.com → New + → Web Service

### Basic Settings:
```
Name:               hostbox-backend
Region:             Frankfurt (EU Central) or Oregon (US West)
Branch:             main
Root Directory:     backend
Runtime:            Node
```

### Build & Deploy Commands:
```
Build Command:      npm install
Start Command:      node server.js
```

⚠️ **IMPORTANT**: Build command is `npm install` (NOT `npm run build`)

### Instance Type:
```
Plan:               Free
```

### Environment Variables (Add 3):

**Variable 1:**
```
Key:    MONGODB_URI
Value:  mongodb+srv://sfisomadonsela274:Chadbr0sk!@cluster0.lyi41ge.mongodb.net/?appName=Cluster0
```

**Variable 2:**
```
Key:    ADMIN_PASSWORD
Value:  admin123
```

**Variable 3:**
```
Key:    PORT
Value:  3001
```

### After Deploy:
Your backend URL will be: `https://hostbox-backend.onrender.com`

**Copy this URL** - you need it for frontend deployment!

---

## 🌐 Frontend Deployment (Netlify)

**URL**: https://app.netlify.com → Add new site → Import from Git

### Basic Settings:
```
Repository:         HostBox (from GitHub)
Branch:             main
Base directory:     (leave empty)
```

### Build Settings:
```
Build command:      npm run build
Publish directory:  dist
```

### Environment Variables (Add 1):

**Variable:**
```
Key:    VITE_API_URL
Value:  https://YOUR-BACKEND-URL.onrender.com/api
```

⚠️ **IMPORTANT**: 
- Replace `YOUR-BACKEND-URL` with your actual Render URL from above
- Must end with `/api`
- Example: `https://hostbox-backend.onrender.com/api`

---

## ✅ Verification Steps

### 1. Test Backend:
```
Visit: https://YOUR-BACKEND.onrender.com/api/projects
Should return: JSON data or empty array []
```

### 2. Test Frontend:
```
Visit: https://YOUR-SITE.netlify.app
Should show: Boot screen → Landing page → Desktop
```

### 3. Test Full Stack:
- Open Projects app → Should show GitHub repos
- Click Admin Login → Enter `admin123` → Should login
- Add a test project → Should save to database

---

## 🚨 Common Errors

### Error: "Build failed" on Render
**Fix**: Build command should be `npm install` NOT `npm run build`

### Error: "Failed to fetch projects" on frontend
**Fix**: Check `VITE_API_URL` in Netlify:
- Must end with `/api`
- Must be your actual Render URL
- Then: Deploys → Trigger deploy → Clear cache

### Error: Backend shows "Starting..."
**Normal**: Render free tier sleeps after inactivity
- First request takes 10-20 seconds to wake up
- This is expected behavior

---

## 📋 Deployment Checklist

- [ ] Backend deployed to Render (green "Live" status)
- [ ] Backend URL copied
- [ ] Frontend deployed to Netlify
- [ ] `VITE_API_URL` set correctly with `/api` suffix
- [ ] Frontend redeployed after adding env var
- [ ] Backend test URL returns JSON
- [ ] Frontend loads boot screen
- [ ] Projects app shows data
- [ ] Admin login works

---

## 🔄 Future Updates

**To update your live site:**

```bash
# 1. Make changes to your code
# 2. Commit and push
git add .
git commit -m "Update: your changes"
git push

# Both Render and Netlify auto-deploy from GitHub!
# Wait 2-3 minutes and your changes are live
```

---

## 🔗 Quick Links

- Backend Dashboard: https://dashboard.render.com
- Frontend Dashboard: https://app.netlify.com
- GitHub Repo: https://github.com/sfisomadonsela274-spec/HostBox
- MongoDB Atlas: https://cloud.mongodb.com

---

**Need more help?** See:
- `RENDER_DEPLOY.md` - Full backend guide
- `DEPLOYMENT.md` - Complete deployment guide
- `DEPLOY_CHECKLIST.md` - Step-by-step checklist