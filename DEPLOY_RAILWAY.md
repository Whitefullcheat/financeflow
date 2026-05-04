# 🚂 Deploy to Railway (5 Minutes)

Railway is the **easiest way** to deploy FinanceFlow for free.

## ✅ Prerequisites

- GitHub account (free)
- Railway account (sign up at railway.app)

---

## 📋 Step-by-Step Guide

### **Step 1: Prepare Your Code**

Push your code to GitHub:

```bash
# Initialize git repo
git init
git add .
git commit -m "Initial commit"

# Create new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/financeflow.git
git branch -M main
git push -u origin main
```

---

### **Step 2: Connect Railway**

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub"**
4. Authorize Railway to access your GitHub
5. Select your **financeflow** repository
6. Click **"Deploy Now"**

---

### **Step 3: Configure Environment Variables**

Railway will auto-detect Node.js. To add your secret:

1. In Railway dashboard, go to **"Variables"** tab
2. Add new variable:
   - Key: `JWT_SECRET`
   - Value: `your-super-secret-key-12345-change-this`
3. Click **"Deploy"** to redeploy with variables

---

### **Step 4: Get Your URL**

1. Go to **"Deployments"** tab
2. Under **"Settings"**, find **"Domains"**
3. Railway auto-creates a domain like:
   ```
   financeflow-production.up.railway.app
   ```

---

### **Step 5: Test It**

1. Visit your Railway URL
2. Register a new account
3. Login and start using it!

---

## 🔗 Update Frontend API URL

If needed, update the frontend to point to your Railway domain:

In `public/index.html`, line 160:
```javascript
const API_URL = 'https://financeflow-production.up.railway.app/api';
```

Or keep it as:
```javascript
const API_URL = window.location.origin + '/api';
```

(This auto-detects your domain)

---

## 📊 Free Tier Details

| Feature | Railway Free |
|---------|----------|
| Monthly Runtime | 500 hours |
| Bandwidth | Unlimited |
| Databases | Not needed (we use JSON) |
| Custom Domain | Yes |
| Sleep Policy | No sleeping! |

**500 hours = 21 days of continuous uptime per month**

---

## 💡 Pro Tips

**Logs in Railway:**
- Click **"Logs"** tab to debug issues
- See real-time API calls and errors

**Redeploy:**
- Push new code to GitHub
- Railway auto-rebuilds

**Upgrade Later:**
- Railway has paid plans if you need more power
- Free tier is great for personal projects

---

## 🆘 If Deployment Fails

Check the **Logs** tab:

1. **"Module not found"** → Missing `package.json` file
2. **"Port error"** → Check server.js uses `process.env.PORT`
3. **"Build failed"** → Ensure Node.js version is 18.x

---

## ✨ That's It!

Your FinanceFlow is now live and free! 🎉

Share your Railway URL and anyone can use it.

---

## Alternative: Quick Deploy with Button

Eventually, add this to your README for 1-click deploys:

```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app?templateUrl=https://github.com/YOUR_USERNAME/financeflow)
```

But for now, just follow the steps above! 🚀
