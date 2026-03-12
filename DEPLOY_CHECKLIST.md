# ⚡ Quick Deploy Checklist

Use this checklist to deploy HostBox Portfolio to production.

---

## 🔧 Pre-Deployment

- [ ] Run `npm run build` locally to verify it works
- [ ] Test the production build locally: `npm run preview`
- [ ] Verify all features work (boot screen, mobile view, apps, admin login)
- [ ] Push latest code to GitHub:
  ```bash
  git add .
  git commit -m "Ready for deployment"
  git push origin main
  ```

---

## 🗄️ Backend Deployment (Render.com)

- [ ] Sign up at [render.com](https://render.com)
- [ ] Click **"New +"** → **"Web Service"**
- [ ] Connect your GitHub repository
- [ ] Configure:
  - **Root Directory**: `backend`
  - **Build Command**: `npm install`
  - **Start Command**: `node server.js`
- [ ] Add Environment Variables:
  - `MONGODB_URI`: `mongodb+srv://sfisomadonsela274:Chadbr0sk!@cluster0...`
  - `ADMIN_PASSWORD`: `admin123` (or your custom password)
  - `PORT`: `3001`
- [ ] Deploy and wait 3-5 minutes
- [ ] Copy the backend URL (e.g., `https://hostbox-api.onrender.com`)
- [ ] Test it: Visit `https://your-backend-url.onrender.com/api/projects`

**Alternative**: Deploy to Railway.app or Cyclic.sh

---

## 🌐 Frontend Deployment (Netlify)

- [ ] Sign up at [netlify.com](https://netlify.com)
- [ ] Click **"Add new site"** → **"Import an existing project"**
- [ ] Choose **"GitHub"** and select your repository
- [ ] Configure build:
  - **Branch**: `main`
  - **Build command**: `npm run build`
  - **Publish directory**: `dist`
- [ ] Click **"Deploy site"**
- [ ] Wait 2-3 minutes for first deploy

---

## ⚙️ Configure Environment Variables (Netlify)

- [ ] Go to **Site configuration** → **Environment variables**
- [ ] Add variable:
  - **Key**: `VITE_API_URL`
  - **Value**: `https://your-backend-url.onrender.com/api`
  - ⚠️ Replace with YOUR actual backend URL from step above
- [ ] Click **"Save"**
- [ ] Go to **Deploys** → **"Trigger deploy"** → **"Clear cache and deploy site"**
- [ ] Wait 2-3 minutes for rebuild

---

## ✅ Test Your Live Site

Visit your Netlify URL (e.g., `https://random-name-12345.netlify.app`)

- [ ] ✨ Boot screen appears (2 seconds)
- [ ] 📱 Mobile fallback works (resize browser < 768px)
- [ ] 🖥️ Landing page loads → Click "User View"
- [ ] 🎉 Welcome page → Click "Enter Desktop"
- [ ] 📂 Desktop loads with all app icons
- [ ] 🗂️ Open "My Projects" → See your GitHub repos
- [ ] 🏆 Open "Certificates" → See your certs
- [ ] 📧 Open "Contact" → Email/social links work
- [ ] 📄 Open "Resume" → See your resume data
- [ ] 🔐 Click Start Menu → Click "Admin Login"
- [ ] 🔑 Enter password `admin123` → Login works
- [ ] ➕ Click "Add Project" → Modal opens (test adding project)
- [ ] 🪟 Drag window to left edge → Snaps to left half
- [ ] 🪟 Drag window to top → Maximizes
- [ ] ⏻ Start Menu → "Power Off" → Returns to landing page

---

## 🎨 Optional: Custom Domain

- [ ] Go to Netlify → **Domain management**
- [ ] Click **"Add custom domain"**
- [ ] Enter your domain (e.g., `sfisomadonsela.com`)
- [ ] Follow DNS setup instructions
- [ ] Wait for DNS propagation (can take up to 48 hours)

**Or**: Change Netlify subdomain:
- [ ] **Site configuration** → **Site details** → **"Change site name"**
- [ ] Choose: `sfiso-portfolio.netlify.app`

---

## 🔒 Security (Recommended)

- [ ] Change admin password from default `admin123`:
  1. Update `backend/.env` → `ADMIN_PASSWORD=your_new_password`
  2. Redeploy backend on Render
  3. Update `src/context/AuthContext.tsx` → `ADMIN_PASSWORD` constant
  4. Commit and push to trigger Netlify rebuild
- [ ] Verify `.env` files are NOT committed to Git (check `.gitignore`)
- [ ] Never share your MongoDB URI publicly

---

## 📊 Monitor (Optional)

- [ ] Set up uptime monitoring: [uptimerobot.com](https://uptimerobot.com)
- [ ] Add Google Analytics to track visitors
- [ ] Enable Netlify Analytics (paid)

---

## 🚀 Share Your Portfolio!

- [ ] Add link to your resume
- [ ] Update LinkedIn profile (Featured section)
- [ ] Update GitHub profile README
- [ ] Share on Twitter/X with hashtags: #100DaysOfCode #WebDev
- [ ] Add to job applications

---

## 🔄 Future Updates

When you make changes:

```bash
git add .
git commit -m "Update: your changes"
git push
```

Netlify will automatically rebuild and deploy! 🎉

---

## ⚠️ Troubleshooting

**"Failed to fetch projects"**
→ Check backend URL in Netlify env vars → Redeploy

**404 on page refresh**
→ Make sure `netlify.toml` is in root directory

**Build fails**
→ Check Node version is 18 in Netlify settings

**Admin login doesn't work**
→ Verify backend is running → Check browser console

---

## 📞 Support

See full guide: `DEPLOYMENT.md`

**Resources**:
- [Netlify Docs](https://docs.netlify.com)
- [Render Docs](https://render.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

✨ **Congratulations!** Your portfolio is now live and showcasing your skills to the world!