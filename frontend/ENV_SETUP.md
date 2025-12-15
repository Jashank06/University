# Environment Configuration Guide

## Frontend Environment Files

### `.env` (Local Development)
Used when running `npm run dev`:
```bash
VITE_API_URL=http://localhost:5001/api/dashboard
```

### `.env.production` (Production Build)
Used when running `npm run build`:
```bash
VITE_API_URL=https://university-s361.onrender.com/api/dashboard
```

---

## 🚀 Usage

### Local Development
```bash
# Terminal 1 - Start Backend
cd manav-rachna-dashboard/backend
npm start
# Backend runs on http://localhost:5001

# Terminal 2 - Start Frontend
cd manav-rachna-dashboard/frontend
npm run dev
# Frontend runs on http://localhost:5173
# Uses .env (localhost backend)
```

### Production Deployment
```bash
cd manav-rachna-dashboard/frontend
npm run build
# Uses .env.production (Render backend)

npm run deploy
# Deploys to GitHub Pages
```

---

## 🌐 Live URLs

**Frontend (GitHub Pages):**
- https://jashank06.github.io/University/

**Backend (Render):**
- https://university-s361.onrender.com
- Health Check: https://university-s361.onrender.com/health

---

## 🔧 How It Works

Vite automatically uses:
- `.env` for `npm run dev` (development)
- `.env.production` for `npm run build` (production)

No code changes needed! Environment is automatically selected based on build mode.

---

## ✅ Summary

- ✓ **Local Dev**: Frontend (localhost:5173) → Backend (localhost:5001)
- ✓ **Production**: Frontend (GitHub Pages) → Backend (Render)
- ✓ No manual switching needed
- ✓ One command for dev, one for production

Ab dono pe chalega perfectly! 🎉
