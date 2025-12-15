# Fix GitHub Pages Environment Protection Error

## Error
```
Branch "main" is not allowed to deploy to github-pages due to environment protection rules.
```

## Solutions

### Option 1: Disable Environment Protection (Recommended)

1. **Go to Repository Settings:**
   - https://github.com/Jashank06/University/settings/environments

2. **Click on `github-pages` environment**

3. **Remove Protection Rules:**
   - Delete any deployment branches rules
   - Or add `main` to allowed branches
   - Click **Save protection rules**

4. **Re-run GitHub Actions**

---

### Option 2: Use gh-pages Branch (Already Working!)

You've already deployed successfully using `npm run deploy` which uses the `gh-pages` branch method.

**To Continue Using This Method:**

1. **Disable GitHub Actions workflow** (optional):
   ```bash
   cd /Users/Jay/Documents/University/manav-rachna-dashboard
   rm .github/workflows/deploy.yml
   git add . && git commit -m "Remove GitHub Actions workflow"
   git push origin main
   ```

2. **Configure GitHub Pages Settings:**
   - Go to: https://github.com/Jashank06/University/settings/pages
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** 
   - Folder: **/ (root)**
   - Click **Save**

3. **Deploy Manually When Needed:**
   ```bash
   cd frontend
   npm run build
   npm run deploy
   ```

---

## Recommended: Keep Using gh-pages Branch

Since `npm run deploy` already works and deployed successfully, I recommend:

1. **Remove the GitHub Actions workflow** (it's causing the error)
2. **Use manual deployment** with `npm run deploy`
3. **Keep GitHub Pages source as `gh-pages` branch**

This is simpler and you have full control over deployments!

---

## Quick Fix Command

```bash
cd /Users/Jay/Documents/University/manav-rachna-dashboard
rm .github/workflows/deploy.yml
git add . 
git commit -m "Use gh-pages manual deployment instead of Actions"
git push origin main
```

Then go to Settings → Pages → Set source to `gh-pages` branch.

Your site is already live at: https://jashank06.github.io/University/

Just use `npm run deploy` when you want to update! 🚀
