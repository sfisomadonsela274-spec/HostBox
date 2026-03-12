# ⚡ SQLite Quick Start

## TL;DR - 3 Steps

### 1. Install & Run
```bash
cd backend
npm install
npm start
```

### 2. Verify It Works
```bash
curl http://localhost:3001/api/projects
# Should return: []
```

### 3. That's It!
Your database is running. No MongoDB Atlas needed.

---

## What Changed?

| Before (MongoDB) | After (SQLite) |
|------------------|----------------|
| ❌ Network timeouts | ✅ Instant access |
| ❌ IP whitelisting required | ✅ Works out of box |
| ❌ Complex setup | ✅ Zero config |
| ❌ Cloud dependency | ✅ Local file |

---

## Files Changed

- `backend/package.json` - Removed mongoose, added sqlite3
- `backend/server.js` - Completely rewritten for SQLite
- `.gitignore` - Added `backend/*.db`
- New: `SQLITE_MIGRATION.md` - Detailed guide
- New: This file!

---

## .env Setup

Delete this:
```env
MONGODB_URI=mongodb+srv://...
```

Keep this:
```env
ADMIN_PASSWORD=your_password
PORT=3001
```

---

## Testing

```bash
# Get projects (empty at first)
curl http://localhost:3001/api/projects

# Create a project
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "x-admin-password: admin123" \
  -d '{
    "title": "Test Project",
    "description": "Test",
    "language": "JavaScript",
    "url": "https://github.com/test/project"
  }'

# Get resume
curl http://localhost:3001/api/resume
```

---

## Database File

After first run, you'll have `backend/hostbox.db`:
- This is your entire database ✅
- One single file
- Auto-created, auto-managed
- Never commit to Git (in .gitignore)

View it:
```bash
sqlite3 backend/hostbox.db
> SELECT * FROM projects;
> .quit
```

---

## Deployment (Render)

1. Update environment:
   - Remove `MONGODB_URI`
   - Keep `ADMIN_PASSWORD`

2. Add Persistent Disk:
   - Path: `/var/data`
   - Size: 1 GB

3. Set `DB_PATH=/var/data/hostbox.db` in environment

4. Push & deploy

---

## Common Questions

**Q: Where is my data stored?**  
A: In `backend/hostbox.db` (local development) or `/var/data/hostbox.db` (Render)

**Q: Do I need to migrate my MongoDB data?**  
A: Only if you have important data. Otherwise start fresh.

**Q: Will my frontend break?**  
A: No! API endpoints are 100% identical.

**Q: Is SQLite production-ready?**  
A: Yes! Perfect for portfolios and small-medium sites.

**Q: How do I backup my data?**  
A: `cp backend/hostbox.db backup.db`

---

## Full Documentation

See `SQLITE_MIGRATION.md` for:
- Detailed schema
- Data migration from MongoDB
- Deployment instructions
- Troubleshooting
- Security best practices

---

## Troubleshooting

### "Cannot find module 'sqlite3'"
```bash
npm install sqlite3
```

### Server won't start
```bash
npm start
# Check error message, look in server logs
```

### Database file not created
```bash
# Check folder permissions
chmod +w backend/
npm start
```

### Data lost after Render restart
```bash
# Add persistent disk (see Deployment section)
```

---

## Next Steps

1. ✅ Run `npm install` in backend
2. ✅ Run `npm start` 
3. ✅ Test with curl commands
4. ✅ Update `.env` (remove MONGODB_URI)
5. ✅ Deploy to Render (add persistent disk)
6. ✅ Update Render environment variables
7. ✅ Test your portfolio site

---

## You're Done! 🎉

MongoDB timeouts are history. Your portfolio now runs on solid, reliable SQLite.

Need help? Check `SQLITE_MIGRATION.md` or your server logs.
