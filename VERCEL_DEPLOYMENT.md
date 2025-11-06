# 🚀 Vercel Production Deployment Guide

Complete guide to deploy your NUSENSE TryON Shopify app to production using Vercel (without ngrok).

---

## 📋 Prerequisites

- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] GitHub repository (recommended) or GitLab/Bitbucket
- [ ] Shopify Partner account
- [ ] Production-ready code (tested locally)

---

## 🎯 Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Build your frontend:**
   ```bash
   npm run build
   ```

2. **Verify the build:**
   - Check that `dist/` folder contains all compiled assets
   - Verify `api/index.js` exists (serverless function wrapper)

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

---

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in

2. **Click "Add New Project"**

3. **Import your Git repository:**
   - Select your repository
   - Click "Import"

4. **Configure project settings:**
   - **Framework Preset:** Other
   - **Root Directory:** `./` (root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   SHOPIFY_API_KEY=your_api_key_here
   SHOPIFY_API_SECRET=your_api_secret_here
   SHOPIFY_APP_URL=https://your-app.vercel.app
   NODE_ENV=production
   PORT=3000
   ```
   ⚠️ **Important:** You'll need to update `SHOPIFY_APP_URL` after first deployment with your actual Vercel URL.

6. **Click "Deploy"**

7. **Wait for deployment to complete** (usually 2-5 minutes)

8. **Copy your deployment URL:**
   - Format: `https://your-app-name.vercel.app`
   - Or your custom domain if configured

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy to production:**
   ```bash
   vercel --prod
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Confirm settings
   - Add environment variables when prompted

5. **Copy your deployment URL** from the output

---

### Step 3: Update Environment Variables

After first deployment, you'll have your Vercel URL. Update environment variables:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Update `SHOPIFY_APP_URL`:**
   ```
   SHOPIFY_APP_URL=https://your-actual-vercel-url.vercel.app
   ```

3. **Redeploy** (Vercel will auto-redeploy when env vars change, or click "Redeploy")

---

### Step 4: Configure Shopify Partner Dashboard

1. **Go to [partners.shopify.com](https://partners.shopify.com)**

2. **Navigate to:** Apps → Your App → App setup

3. **Update App URL:**
   ```
   https://your-app.vercel.app
   ```

4. **Update Allowed redirection URL(s):**
   Add these URLs (replace with your actual Vercel URL):
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/auth/shopify/callback
   https://your-app.vercel.app/api/auth/callback
   ```

5. **Click "Save"**

---

### Step 5: Update shopify.app.toml

Update your `shopify.app.toml` file with production URLs:

```toml
name = "nusense-tryon"
client_id = "8c0ff99d006911df268ba38b356149d8"
application_url = "https://your-app.vercel.app"
embedded = true

[access_scopes]
scopes = "write_products,read_products,write_themes,read_themes"

[auth]
redirect_urls = [
  "https://your-app.vercel.app/auth/callback",
  "https://your-app.vercel.app/auth/shopify/callback",
  "https://your-app.vercel.app/api/auth/callback"
]

[webhooks]
api_version = "2024-01"

[pos]
embedded = false

[build]
automatically_update_urls_on_dev = true
dev_store_url = "vto-demo.myshopify.com"

[app_proxy]
url = "https://your-app.vercel.app"
subpath = "a"
prefix = "apps"

[[extensions]]
type = "theme_app_extension"
name = "nusense-tryon"
```

Replace `https://your-app.vercel.app` with your actual Vercel URL.

---

### Step 6: Deploy Theme Extension

1. **Update URLs in shopify.app.toml** (as shown above)

2. **Deploy the extension:**
   ```bash
   shopify app deploy
   ```

   Or manually:
   - Go to Partner Dashboard → Your App → Extensions
   - Upload and publish the theme extension

---

### Step 7: Test Your Deployment

1. **Test Health Endpoint:**
   ```bash
   curl https://your-app.vercel.app/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Test OAuth Flow:**
   - Go to your Shopify admin
   - Install the app
   - Complete OAuth flow
   - Verify redirect works

3. **Test Widget:**
   - Go to a product page
   - Click try-on button
   - Verify widget loads and works

4. **Test API Endpoints:**
   ```bash
   # Test try-on API (requires images)
   curl -X POST https://your-app.vercel.app/api/tryon/generate \
     -H "Content-Type: application/json" \
     -d '{"personImage":"...","clothingImage":"..."}'
   ```

---

## 🔧 Configuration Files

### vercel.json

The `vercel.json` file is already configured with:
- Serverless function routing for `/api/*`, `/auth/*`, `/apps/*`, `/widget/*`
- Static file serving from `dist/`
- CORS headers for API routes
- SPA routing for React app

### api/index.js

This file wraps your Express app as a Vercel serverless function.

---

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. **Go to Vercel Dashboard** → Your Project → Settings → Domains

2. **Add your domain:**
   - Enter your domain (e.g., `nusense-tryon.com`)
   - Follow DNS configuration instructions

3. **Update Shopify URLs:**
   - Update `SHOPIFY_APP_URL` in Vercel environment variables
   - Update Partner Dashboard URLs
   - Update `shopify.app.toml`

4. **Redeploy**

---

## 🔒 Security Checklist

- [ ] All environment variables set in Vercel (not in code)
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] OAuth redirect URLs whitelisted in Partner Dashboard
- [ ] API keys not exposed in frontend code
- [ ] CORS configured correctly
- [ ] Production environment variables set

---

## 📊 Monitoring

### Vercel Dashboard

- **Deployments:** View all deployments and logs
- **Analytics:** Monitor traffic and performance
- **Functions:** View serverless function logs
- **Environment Variables:** Manage secrets

### Check Logs

1. **Via Dashboard:**
   - Go to your project → Deployments → Click a deployment → Functions tab

2. **Via CLI:**
   ```bash
   vercel logs your-app-name
   ```

---

## 🚨 Troubleshooting

### Deployment Fails

**Issue:** Build fails
- **Solution:** Check build logs in Vercel dashboard
- Verify `npm run build` works locally
- Check for missing dependencies

**Issue:** Function timeout
- **Solution:** Vercel has 10s timeout for Hobby plan, 60s for Pro
- Optimize your API calls
- Consider upgrading plan if needed

### OAuth Not Working

**Issue:** Redirect URL mismatch
- **Solution:** Verify URLs match exactly in Partner Dashboard
- Check `SHOPIFY_APP_URL` environment variable
- Ensure HTTPS (not HTTP)

**Issue:** CORS errors
- **Solution:** Check `vercel.json` headers configuration
- Verify CORS middleware in `server/index.js`

### Widget Not Loading

**Issue:** 404 errors
- **Solution:** Check routing in `vercel.json`
- Verify static files are in `dist/`
- Check browser console for errors

**Issue:** API calls failing
- **Solution:** Check serverless function logs
- Verify environment variables are set
- Test API endpoints directly

---

## 🔄 Updating Your Deployment

### Automatic Deployments

Vercel automatically deploys when you push to your main branch:
```bash
git push origin main
```

### Manual Deployment

```bash
vercel --prod
```

### Preview Deployments

Every pull request gets a preview deployment automatically.

---

## 📝 Environment Variables Reference

Required environment variables in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `SHOPIFY_API_KEY` | Your Shopify app API key | `8c0ff99d006911df268ba38b356149d8` |
| `SHOPIFY_API_SECRET` | Your Shopify app API secret | `your_secret_key` |
| `SHOPIFY_APP_URL` | Your Vercel deployment URL | `https://your-app.vercel.app` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (optional) | `3000` |

---

## ✅ Deployment Checklist

Before going live:

- [ ] Code tested locally
- [ ] Frontend built successfully (`npm run build`)
- [ ] Deployed to Vercel
- [ ] Environment variables configured
- [ ] Health endpoint working (`/health`)
- [ ] Shopify Partner Dashboard URLs updated
- [ ] `shopify.app.toml` updated with production URLs
- [ ] Theme extension deployed
- [ ] OAuth flow tested
- [ ] Widget tested on product page
- [ ] API endpoints tested
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring set up
- [ ] Error logging configured

---

## 🎉 Success!

Your app is now deployed to production! 🚀

**Next Steps:**
1. Test thoroughly on a development store
2. Gather feedback
3. Monitor usage and errors
4. Submit to Shopify App Store (if publishing publicly)

---

## 📞 Need Help?

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Shopify Docs:** [shopify.dev](https://shopify.dev)

---

**That's it! Your app is now live on Vercel! 🎉**

