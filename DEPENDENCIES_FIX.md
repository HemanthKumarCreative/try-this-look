# 🔧 Vercel Dependencies Fix

## Issue
Vercel serverless functions couldn't find `@shopify/shopify-api` because dependencies were only in `server/package.json`, but Vercel needs them in the root `package.json`.

## Fix Applied

1. **Added server dependencies to root `package.json`:**
   - `@shopify/shopify-api`: ^11.0.0
   - `dotenv`: ^16.3.1
   - `express`: ^4.18.2 (was already there)

2. **Updated `vercel.json`:**
   - Added explicit `installCommand` to ensure dependencies are installed

## Next Steps

1. **Install dependencies locally:**
   ```bash
   npm install
   ```

2. **Commit and push:**
   ```bash
   git add package.json vercel.json
   git commit -m "Add server dependencies to root package.json for Vercel"
   git push
   ```

3. **Vercel will automatically redeploy** with the new dependencies

4. **Test:**
   ```bash
   curl https://try-this-look.vercel.app/health
   ```

## Why This Was Needed

Vercel serverless functions run from the root directory and need all dependencies in the root `package.json`. When the serverless function in `api/index.js` imports from `../server/index.js`, Vercel looks for dependencies in the root `package.json`, not in `server/package.json`.

---

**The dependencies should now be available to the serverless function!** ✅

ok done