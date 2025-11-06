# 🔧 Vercel Serverless Function Fix

## Issues Fixed

1. **Handler Function**: Fixed the serverless function handler to properly handle Express app
2. **Environment Variables**: Fixed environment variable loading for Vercel
3. **URL Parsing**: Added safe URL parsing for SHOPIFY_APP_URL
4. **Error Handling**: Added better error handling throughout

## Changes Made

### `api/index.js`
- Fixed handler to properly pass requests to Express app
- Added error handling for initialization errors

### `server/index.js`
- Fixed environment variable loading (only loads .env in local dev)
- Added safe URL parsing for SHOPIFY_APP_URL
- Added better error handling in all routes
- Fixed response header checks

## Required Environment Variables in Vercel

Make sure these are set in Vercel Dashboard → Settings → Environment Variables:

```
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=https://try-this-look.vercel.app
NODE_ENV=production
```

## Testing

After deploying, test:

1. **Health endpoint:**
   ```bash
   curl https://try-this-look.vercel.app/health
   ```

2. **Check Vercel logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on a deployment → Functions tab
   - Check for any errors

## Common Issues

### Issue: Still getting 500 error

**Solution:**
1. Check Vercel logs for specific error
2. Verify all environment variables are set
3. Make sure `SHOPIFY_APP_URL` is a valid URL (starts with https://)
4. Redeploy after fixing environment variables

### Issue: "Missing required environment variables"

**Solution:**
- Go to Vercel Dashboard → Settings → Environment Variables
- Add all required variables
- Redeploy

### Issue: URL parsing error

**Solution:**
- Make sure `SHOPIFY_APP_URL` is a complete URL: `https://try-this-look.vercel.app`
- No trailing slash
- Must start with `https://`

---

**The serverless function should now work correctly!** ✅

