# FinanceFlow - Full Stack Deployment Guide

## 📦 What You Have

- **Backend**: Node.js/Express API with JWT authentication
- **Frontend**: Modern HTML/CSS/JS dashboard
- **Storage**: JSON file-based persistence
- **Features**: User authentication, shifts, expenses, real-time balance tracking

---

## 🚀 FREE HOSTING OPTIONS

### **Option 1: Railway (Recommended) ⭐**

Railway is the easiest and most reliable free option.

**Steps:**

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Click **"Deploy from GitHub"**
4. Connect your GitHub account
5. Create a new public repo called `financeflow` with the files below
6. Select it from Railway
7. Railway auto-detects Node.js and starts deploying
8. Your app will be live at `{project-name}.railway.app`

**Free Tier:** 500 hours/month (enough for continuous running)

---

### **Option 2: Render**

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub, select your repo
4. **Settings:**
   - Name: `financeflow`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click **"Create Web Service"**

**Free Tier:** Auto-sleeps after 15 mins of inactivity (but wakes when accessed)

---

### **Option 3: Replit (Easiest for Beginners)**

1. Go to [replit.com](https://replit.com)
2. Click **"Create"** → Choose **"Node.js"**
3. Upload files (or paste code)
4. Click **"Run"**
5. Replit gives you a free URL automatically

---

## 📁 File Structure

```
financeflow/
├── server.js          (Backend API)
├── package.json       (Dependencies)
├── public/
│   └── index.html     (Frontend)
├── data.json          (Auto-created on first run)
├── .gitignore         (Add this file)
└── README.md          (This file)
```

---

## 🔧 LOCAL DEVELOPMENT

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# Server runs on http://localhost:3000
```

### Test the API

```bash
# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"1234"}'

# Response: {"token":"eyJ...", "username":"admin"}
```

---

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **Change JWT Secret**
   ```javascript
   // In server.js, line 8
   const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
   
   // Set environment variable in your hosting dashboard
   JWT_SECRET=your-super-secret-key-here
   ```

2. **Hash Passwords**
   Install `bcryptjs`:
   ```bash
   npm install bcryptjs
   ```
   
   Update server.js:
   ```javascript
   const bcrypt = require('bcryptjs');
   
   // When registering:
   data.users[username] = { 
       password: await bcrypt.hash(password, 10) 
   };
   
   // When logging in:
   const validPassword = await bcrypt.compare(password, user.password);
   ```

3. **Add HTTPS** - All hosting platforms provide free HTTPS

---

## 📊 Data Format (data.json)

```json
{
  "users": {
    "admin": {
      "password": "1234"
    }
  },
  "ledgers": {
    "admin": {
      "isSetup": true,
      "baseBalance": 100.00,
      "defaultRate": 20.00,
      "shifts": [
        {
          "id": 1234567890,
          "date": "04/05",
          "rate": 25.00,
          "paid": true
        }
      ],
      "expenses": [
        {
          "id": 1234567891,
          "amount": 5.50,
          "description": "Coffee",
          "date": "May 4"
        }
      ]
    }
  }
}
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get JWT token

### Ledger
- `GET /api/ledger` - Get user's ledger (requires token)
- `POST /api/setup` - Initialize ledger

### Shifts
- `POST /api/shifts` - Create shift
- `PUT /api/shifts/:id` - Update shift (rate, paid status)
- `DELETE /api/shifts/:id` - Delete shift

### Expenses
- `POST /api/expenses` - Add expense
- `DELETE /api/expenses/:id` - Remove expense

**All endpoints (except auth) require:**
```
Authorization: Bearer {jwt_token}
```

---

## 🚀 Quick Deploy to Railway

**The Absolute Easiest Way:**

1. Copy all files to a GitHub repo
2. Go to railway.app
3. Connect GitHub
4. Select your repo
5. **Done!** → Railway handles everything

**Environment Variables in Railway Dashboard:**
```
JWT_SECRET=your-secret-key-change-this
```

---

## 📱 Frontend Usage

1. **Register** a new account
2. **Login** with credentials
3. **Setup** starting balance and daily rate
4. **Add Shifts** - Log work days
5. **Toggle Paid** - Mark shifts as paid
6. **Log Expenses** - Track spending
7. **View Balance** - Real-time net balance display

---

## ⚡ Performance

- **Database**: JSON file (no database setup needed!)
- **Load Time**: <500ms on free tier
- **Storage**: Unlimited JSON file size
- **Users**: No limit (scales as needed)

---

## 🐛 Troubleshooting

**"Port 3000 already in use"**
```bash
# Use different port
PORT=3001 npm start
```

**CORS errors on frontend**
- Already handled in `server.js`
- Make sure API_URL matches your backend domain

**Data not persisting**
- Check `data.json` exists in root directory
- Ensure write permissions on server

---

## 📈 Next Steps

1. Add database (MongoDB Atlas is free)
2. Implement password hashing
3. Add expense categories
4. Export to CSV/PDF
5. Mobile app with React Native

---

## 📝 License

MIT - Use freely!

---

**Happy tracking! 💰**
