# 🚀 Quick Vercel Deployment Guide

## Quick Steps

1. **Build your app:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Configure:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variables:
     ```
     SHOPIFY_API_KEY=your_api_key
     SHOPIFY_API_SECRET=your_api_secret
     SHOPIFY_APP_URL=https://your-app.vercel.app (update after first deploy)
     NODE_ENV=production
     ```
   - Click "Deploy"

3. **After deployment, update:**
   - `SHOPIFY_APP_URL` in Vercel environment variables with your actual URL
   - Shopify Partner Dashboard URLs:
     - App URL: `https://your-app.vercel.app`
     - Redirect URLs:
       - `https://your-app.vercel.app/auth/callback`
       - `https://your-app.vercel.app/auth/shopify/callback`
   - `shopify.app.toml` with production URLs

4. **Deploy theme extension:**
   ```bash
   shopify app deploy
   ```

## Files Created

- ✅ `api/index.js` - Vercel serverless function wrapper
- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to ignore in deployment
- ✅ `VERCEL_DEPLOYMENT.md` - Complete deployment guide
- ✅ `shopify.app.toml.production` - Production config template

## Testing

After deployment, test:
- Health endpoint: `https://your-app.vercel.app/health`
- OAuth flow: Install app on test store
- Widget: Test on product page

For detailed instructions, see `VERCEL_DEPLOYMENT.md`.

