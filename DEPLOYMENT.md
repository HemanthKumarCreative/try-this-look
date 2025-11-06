# NUSENSE TryON - Deployment Guide

Complete guide to deploy your NUSENSE TryON Shopify app to production.

## 🚀 Deployment Checklist

- [ ] Frontend built and deployed
- [ ] Backend server deployed
- [ ] Environment variables configured
- [ ] Shopify app configured in Partner Dashboard
- [ ] OAuth redirect URLs updated
- [ ] App proxy URL configured
- [ ] Theme extension deployed
- [ ] Testing completed

## 📦 Step 1: Build Frontend

```bash
npm run build
```

This creates the `dist/` folder with all compiled assets.

## 🖥️ Step 2: Deploy Frontend

### Option A: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Configure:**
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Set install command: `npm install`

### Option B: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

3. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option C: Other Hosting

Deploy the `dist/` folder to any static hosting service:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage
- Your own server

## 🔧 Step 3: Deploy Backend

### Option A: Railway (Recommended)

1. **Create Railway project**
2. **Connect GitHub repository**
3. **Set root directory:** `server/`
4. **Set start command:** `npm start`
5. **Configure environment variables:**
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
   - `SHOPIFY_APP_URL`
   - `PORT`
   - `NODE_ENV=production`

### Option B: Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Create app:**
   ```bash
   cd server
   heroku create your-app-name
   ```

3. **Configure environment:**
   ```bash
   heroku config:set SHOPIFY_API_KEY=your_key
   heroku config:set SHOPIFY_API_SECRET=your_secret
   heroku config:set SHOPIFY_APP_URL=https://your-app.herokuapp.com
   heroku config:set NODE_ENV=production
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option C: Other Node.js Hosting

Deploy `server/` folder to:
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service
- DigitalOcean App Platform
- Your own server

## ⚙️ Step 4: Configure Shopify App

1. **Update `shopify.app.toml`:**
   ```toml
   application_url = "https://your-frontend-url.com"
   ```

2. **Update Partner Dashboard:**
   - Go to your app in Partner Dashboard
   - Navigate to App setup > URLs
   - Update App URL: `https://your-frontend-url.com`
   - Update Allowed redirection URLs:
     - `https://your-frontend-url.com/auth/callback`
     - `https://your-backend-url.com/auth/callback`

3. **Configure App Proxy:**
   - Subpath: `apps`
   - Subpath prefix: `nusense`
   - Proxy URL: `https://your-backend-url.com`

## 🎨 Step 5: Deploy Theme Extension

```bash
shopify app deploy
```

Or deploy manually:
1. Go to Partner Dashboard > Your App > Extensions
2. Click "Theme app extension"
3. Upload the `extensions/theme-app-extension/` folder
4. Publish the extension

## ✅ Step 6: Testing

1. **Install on test store:**
   - Go to Partner Dashboard
   - Create a test store
   - Install your app

2. **Test OAuth:**
   - Visit app URL
   - Complete OAuth flow
   - Verify redirect works

3. **Test Widget:**
   - Go to product page
   - Click try-on button
   - Test full flow
   - Verify results

4. **Test Theme Extension:**
   - Open theme editor
   - Add try-on button block
   - Customize settings
   - Save and test

## 🔒 Security Checklist

- [ ] HTTPS enabled on all URLs
- [ ] Environment variables secured
- [ ] API keys not exposed in frontend
- [ ] CORS configured correctly
- [ ] OAuth redirect URLs whitelisted
- [ ] Session storage secured
- [ ] API rate limiting enabled

## 📊 Monitoring

Set up monitoring for:
- Server uptime
- API response times
- Error rates
- OAuth success rates
- Widget usage statistics

## 🚨 Troubleshooting

### App Not Installing

- Check OAuth redirect URLs match exactly
- Verify API credentials are correct
- Ensure app URL is accessible
- Check Partner Dashboard settings

### Widget Not Loading

- Verify widget script URL is correct
- Check CORS headers on backend
- Ensure product data is available
- Check browser console for errors

### OAuth Errors

- Verify API key and secret are correct
- Check redirect URLs match
- Ensure scopes are correct
- Check session storage implementation

## 📝 Post-Deployment

1. **Update documentation** with production URLs
2. **Submit to App Store** (if publishing publicly)
3. **Monitor usage** and errors
4. **Gather feedback** from test merchants
5. **Iterate** based on feedback

## 🎉 Success!

Your app is now deployed and ready for merchants to install and use!

---

For support, contact: support@nusense.com

