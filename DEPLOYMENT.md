# GitHub Pages Deployment Guide

## 🚀 Quick Deploy

Your premium university dashboards have been deployed to GitHub Pages!

### Live URL
**https://jashank06.github.io/University/**

---

## 📦 What Was Configured

### 1. Vite Configuration
Created `vite.config.js` with:
- Base path: `/University/`
- Build output: `dist/`
- React plugin support

### 2. Package Scripts
Added to `package.json`:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

### 3. Dependencies Installed
- `gh-pages` - GitHub Pages deployment tool
- `@vitejs/plugin-react` - Vite React plugin

### 4. GitHub Actions Workflow
Created `.github/workflows/deploy.yml` for automatic deployment on push to main/master branch

---

## 🎯 Deployment Methods

### Method 1: Manual Deploy (From Terminal)
```bash
cd /Users/Jay/Documents/University/manav-rachna-dashboard/frontend
npm run deploy
```

### Method 2: GitHub Actions (Automatic)
1. Push changes to GitHub:
```bash
cd /Users/Jay/Documents/University/manav-rachna-dashboard
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

2. GitHub Actions will automatically:
   - Install dependencies
   - Build the project
   - Deploy to GitHub Pages

---

## ⚙️ GitHub Repository Settings

To enable GitHub Pages in your repository:

1. Go to: https://github.com/Jashank06/University/settings/pages

2. Under "Source":
   - Select: **GitHub Actions** (recommended)
   OR
   - Select: **Deploy from a branch**
   - Branch: **gh-pages**
   - Folder: **/ (root)**

3. Click **Save**

4. Your site will be live at: **https://jashank06.github.io/University/**

---

## 🔄 Updating the Deployment

Whenever you make changes:

**Option A - Manual:**
```bash
cd /Users/Jay/Documents/University/manav-rachna-dashboard/frontend
npm run build
npm run deploy
```

**Option B - Automatic (Recommended):**
```bash
git add .
git commit -m "Update dashboards"
git push origin main
```
GitHub Actions will handle the rest!

---

## 📁 File Structure

```
University/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── manav-rachna-dashboard/
│   ├── frontend/
│   │   ├── dist/               # Build output (generated)
│   │   ├── src/
│   │   ├── vite.config.js      # Vite configuration
│   │   ├── package.json        # Updated with deploy scripts
│   │   └── ...
│   └── backend/
└── ...
```

---

## ✅ Deployment Checklist

- [x] Install gh-pages package
- [x] Install @vitejs/plugin-react
- [x] Create vite.config.js with base path
- [x] Add deploy scripts to package.json
- [x] Create GitHub Actions workflow
- [x] Build project successfully
- [x] Ready to deploy!

---

## 🎨 What's Deployed

All 8 premium dashboards with:
- ✨ Animated counters
- 📊 Gradient-filled charts
- 💎 Glassmorphism effects
- 🎯 Professional styling
- 📱 Responsive design

---

## 🔧 Troubleshooting

### Issue: 404 Error
- Ensure base path in `vite.config.js` matches repository name: `/University/`
- Check GitHub Pages is enabled in repository settings

### Issue: Blank Page
- Verify assets paths are correct (should be relative)
- Check browser console for errors
- Ensure API endpoints are configured correctly

### Issue: GitHub Actions Failed
- Check workflow file syntax
- Verify Node version compatibility
- Review GitHub Actions logs

---

## 📝 Next Steps

1. **Run deployment:**
   ```bash
   npm run deploy
   ```

2. **Enable GitHub Pages** in repository settings

3. **Access your dashboards:**
   https://jashank06.github.io/University/

4. **Share the link** with your team!

---

## 🎉 Success!

Your premium university dashboards are now live on GitHub Pages with:
- Automatic deployment via GitHub Actions
- Professional UI with stunning visualizations
- Fast, optimized builds
- Free hosting forever!

Enjoy your beautiful dashboards! 🚀
