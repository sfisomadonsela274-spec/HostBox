# ⚡ Quick Start - Deploy in 5 Minutes

Copy-paste these commands in Zed terminal. No explanations, just commands.

---

## 🔧 Pre-Deploy

```bash
# Ensure you're in the project root
cd /home/sfiso/projects/HostBox

# Build locally to test
npm run build

# Commit any changes
git add .
git commit -m "Ready for deployment"
```

---

## 🗄️ Backend (Railway)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login (opens browser)
railway login

# Deploy backend
cd backend
railway init
# Choose: Create new project → name it "hostbox-backend"

# Set environment variables (replace with your actual values)
railway variables set MONGODB_URI="mongodb+srv://sfisomadonsela274:Chadbr0sk!@cluster0.lyi41ge.mongodb.net/?appName=Cluster0"
railway variables set ADMIN_PASSWORD="admin123"
railway variables set PORT="3001"

# Deploy
railway up

# Get your backend URL
railway domain
# Copy this URL! You need it next.

# Go back to root
cd ..
```

---

## 🌐 Frontend (Netlify)

```bash
# Install Netlify CLI (or use npx)
npm install -g netlify-cli

# Login (opens browser)
netlify login

# Initialize site
netlify init
# Choose:
#   - Create new site
#   - Build: npm run build
#   - Publish: dist

# Set backend URL (replace with YOUR Railway URL from above)
netlify env:set VITE_API_URL "https://YOUR-BACKEND.railway.app/api"

# Rebuild with env var
npm run build

# Deploy
netlify deploy --prod

# Get your site URL
netlify status
```

---

## ✅ Done!

Visit your Netlify URL → Test everything

Your sites:
- Frontend: Check `netlify status`
- Backend: Check `railway domain`

---

## 🔄 Update Later

```bash
# Make changes, then:
git add .
git commit -m "Update"
npm run build
netlify deploy --prod
```

---

## 🆘 If CLI won't install

Use npx instead (no installation):

```bash
# Replace 'netlify' with 'npx netlify-cli'
npx netlify-cli login
npx netlify-cli init
npx netlify-cli env:set VITE_API_URL "https://your-url.railway.app/api"
npx netlify-cli deploy --prod
```

---

## 📖 Full Guides

- Detailed: `DEPLOYMENT.md`
- CLI Guide: `CLI_DEPLOY.md`
- Checklist: `DEPLOY_CHECKLIST.md`
