# Render Backend Deployment Guide

## 🚀 Deploy Backend to Render

Your University Dashboard backend will be deployed to Render.com (Free Tier).

---

## 📋 Prerequisites

1. **GitHub Repository**: Code already pushed to https://github.com/Jashank06/University.git
2. **Render Account**: Create free account at https://render.com
3. **Google Sheets Credentials**: Your `credentials.json` file

---

## 🔧 Deployment Steps

### Step 1: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select repository: **Jashank06/University**

### Step 2: Configure Service

**Basic Settings:**
- **Name**: `university-dashboard-api`
- **Region**: Oregon (US West)
- **Branch**: `main`
- **Root Directory**: Leave empty (will use repo root)
- **Runtime**: `Node`
- **Build Command**: 
  ```bash
  cd manav-rachna-dashboard/backend && npm install
  ```
- **Start Command**: 
  ```bash
  cd manav-rachna-dashboard/backend && npm start
  ```

**Instance Type:**
- Select: **Free** ($0/month)

### Step 3: Environment Variables

Add these environment variables in Render dashboard:

**Required Variables:**
```
PORT=10000
NODE_ENV=production
```

**Google Sheets API:**
```
GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/credentials.json
```

**Sheet IDs** (Replace with your actual IDs):
```
ADMISSION_TRENDS_SHEET_ID=your_sheet_id_here
ATTENDANCE_ANALYTICS_SHEET_ID=your_sheet_id_here
RESULT_ANALYSIS_SHEET_ID=your_sheet_id_here
FEEDBACK_ANALYSIS_SHEET_ID=your_sheet_id_here
PLACEMENT_ANALYSIS_SHEET_ID=your_sheet_id_here
RESEARCH_SHEET_ID=1h2DUT5v7-1-scwGLzLw0Z3a56gceK2UW6OPBnHKKF-c
```

### Step 4: Add Google Credentials as Secret File

1. In Render dashboard, go to **Environment** tab
2. Click **"Secret Files"**
3. Add new secret file:
   - **Filename**: `credentials.json`
   - **Contents**: Paste your entire `credentials.json` content
4. Click **Save Changes**

### Step 5: Deploy!

1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Wait for deployment to complete (~2-5 minutes)
4. Your API will be live at: `https://university-dashboard-api.onrender.com`

---

## 🔗 Update Frontend API URL

After deployment, update your frontend to use the Render API:

1. **Create `.env` file** in frontend:
```bash
cd /Users/Jay/Documents/University/manav-rachna-dashboard/frontend
```

Create `frontend/.env`:
```
VITE_API_URL=https://university-dashboard-api.onrender.com/api/dashboard
```

2. **Rebuild and redeploy frontend**:
```bash
npm run build
npm run deploy
```

---

## 📊 API Endpoints

Your deployed API will have these endpoints:

**Base URL**: `https://university-dashboard-api.onrender.com`

**Health Check:**
- `GET /health` - Check server status

**Dashboard APIs:**
- `GET /api/dashboard/admission-trends`
- `GET /api/dashboard/attendance-analytics`
- `GET /api/dashboard/result-analysis`
- `GET /api/dashboard/feedback-analysis`
- `GET /api/dashboard/placement-analysis`

**Research APIs:**
- `GET /api/dashboard/research/publications`
- `GET /api/dashboard/research/patents`
- `GET /api/dashboard/research/collaborations`

---

## ⚙️ Render Configuration File

A `render.yaml` file has been created in your repository root for easy deployment. To use it:

1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Select your repository
3. Render will auto-detect `render.yaml`
4. Configure environment variables
5. Deploy!

---

## 🔄 Auto-Deploy on Push

Render automatically redeploys when you push to GitHub:

```bash
cd /Users/Jay/Documents/University/manav-rachna-dashboard
git add .
git commit -m "Update backend"
git push origin main
```

Render will detect the push and auto-deploy! 🚀

---

## ⚠️ Important Notes

### Free Tier Limitations:
- ✅ **750 hours/month** (enough for 24/7 operation)
- ⚠️ **Spins down after 15 minutes of inactivity**
- ⚠️ **First request after spin-down takes ~30 seconds**
- ✅ **Automatic SSL/HTTPS**
- ✅ **Custom domains supported**

### Cold Start Solution:
To keep service warm, use a service like [UptimeRobot](https://uptimerobot.com/):
- Ping your `/health` endpoint every 5 minutes
- Free tier allows 50 monitors
- Prevents spin-down

---

## 🐛 Troubleshooting

### Build Fails:
- Check build logs in Render dashboard
- Verify `package.json` has all dependencies
- Ensure `npm install` completes successfully

### 500 Server Error:
- Check environment variables are set correctly
- Verify Google Sheets credentials are added as secret file
- Check Render logs for specific errors

### CORS Errors:
- Ensure frontend URL is in allowed origins
- Server.js has been updated to allow `https://jashank06.github.io`

### Google Sheets API Errors:
- Verify credentials.json is valid
- Ensure Sheet IDs are correct
- Check Google Cloud Console API is enabled

---

## 📝 Quick Deployment Checklist

- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Configure build/start commands
- [ ] Add environment variables
- [ ] Upload credentials.json as secret file
- [ ] Deploy service
- [ ] Test API endpoints
- [ ] Update frontend .env with Render URL
- [ ] Redeploy frontend
- [ ] Verify dashboards work end-to-end

---

## 🎉 Success!

Once deployed:
- **Frontend**: https://jashank06.github.io/University/
- **Backend**: https://university-dashboard-api.onrender.com
- **Complete System**: Frontend + Backend working together! 🚀

Your premium university dashboards are now fully deployed and accessible from anywhere!

