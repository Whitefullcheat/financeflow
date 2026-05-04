# 🚀 FinanceFlow Quick Start

## Local Development (2 minutes)

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start server
npm start

# Visit: http://localhost:3000
```

### Test Credentials
- **Username:** admin
- **Password:** 1234

---

## 📦 What's What

| File | Purpose |
|------|---------|
| `server.js` | Express API backend with JWT auth |
| `package.json` | Dependencies (express, cors, jwt) |
| `public/index.html` | Full dashboard frontend |
| `data.json` | JSON database (auto-created) |
| `README.md` | Full documentation |
| `DEPLOY_RAILWAY.md` | Railway deployment guide |

---

## 🎯 Key Features

✅ **User Authentication** - Register & login with JWT  
✅ **Shift Tracking** - Log work days with custom rates  
✅ **Expense Management** - Track spending  
✅ **Real-time Balance** - See net balance instantly  
✅ **JSON Storage** - No database setup needed  
✅ **Responsive Design** - Works on mobile & desktop  

---

## 🌐 Deploy to Production

### Easiest: Railway (Free)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "Deploy from GitHub"
4. Select your repo
5. **Done!** ✨

📖 See `DEPLOY_RAILWAY.md` for details

### Other Free Options

- **Render** - Auto-deploys from GitHub
- **Replit** - Paste code directly
- **Vercel** - For Next.js (requires refactor)

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET in environment variables
- [ ] Hash passwords with bcryptjs
- [ ] Enable HTTPS (all platforms do this)
- [ ] Set strong usernames/passwords
- [ ] Backup data.json regularly

---

## 📱 API Endpoints Reference

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
GET    /api/ledger                 Get user ledger
POST   /api/setup                  Initialize ledger

POST   /api/shifts                 Add work shift
PUT    /api/shifts/:id             Update shift
DELETE /api/shifts/:id             Delete shift

POST   /api/expenses               Log expense
DELETE /api/expenses/:id           Delete expense
```

All endpoints (except auth) require:
```
Authorization: Bearer {token}
```

---

## 🛠️ Troubleshooting

**"npm: command not found"**
→ Install Node.js from nodejs.org

**"Port 3000 in use"**
→ Run `PORT=3001 npm start`

**"Cannot find module"**
→ Run `npm install` again

**Frontend can't connect to API**
→ Check API_URL in `public/index.html` matches your domain

---

## 📝 Common Tasks

### Add a new user
Frontend: Click "Create Account" button

### Change daily rate
In dashboard: Edit individual shift or adjust in Setup

### Export data
Data is in `data.json` - backup this file

### Reset everything
Delete `data.json` and restart server

---

## 🎓 Next Steps

1. ✅ Get it running locally
2. ✅ Test with your own account
3. ✅ Deploy to Railway
4. ✅ Share with friends!

Need help? Check README.md for detailed docs.

**Happy tracking! 💰**
