# 🔗 Shopify App URLs Guide - App URL & Redirection URLs

Complete guide to understand and set up App URL and Allowed Redirection URLs for your Shopify app.

---

## 📖 What Are These URLs?

### **App URL** (Main Application URL)
- **What it is:** The main URL where your Shopify app is hosted
- **Purpose:** Where Shopify redirects merchants after they install your app
- **Example:** `https://your-app.ngrok.io` or `https://your-app.com`
- **Required:** ✅ Yes - Must be HTTPS

### **Allowed Redirection URLs** (OAuth Callback URLs)
- **What it is:** URLs where Shopify can redirect users after OAuth authentication
- **Purpose:** Security - Shopify only redirects to URLs you explicitly allow
- **Example:** `https://your-app.ngrok.io/auth/callback`
- **Required:** ✅ Yes - Must match exactly (including https://)

---

## 🚀 How to Get These URLs

### **Option 1: Local Development (Using ngrok)**

#### Step 1: Install ngrok
```bash
# Install ngrok globally
npm install -g ngrok

# Or download from https://ngrok.com/download
```

#### Step 2: Start Your Server
```bash
# Terminal 1: Start your backend server
npm run server:dev
# Server runs on http://localhost:3000
```

#### Step 3: Start ngrok
```bash
# Terminal 2: Start ngrok
ngrok http 3000
```

#### Step 4: Get Your ngrok URL
After running ngrok, you'll see:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Your URLs:**
- **App URL:** `https://abc123.ngrok.io`
- **Allowed Redirection URLs:**
  - `https://abc123.ngrok.io/auth/callback`
  - `https://abc123.ngrok.io/auth/shopify/callback`

#### Step 5: Configure in Partner Dashboard

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Navigate to **Apps** → Your App → **App setup**
3. Set **App URL:** `https://abc123.ngrok.io`
4. Add **Allowed redirection URL(s):**
   - `https://abc123.ngrok.io/auth/callback`
   - `https://abc123.ngrok.io/auth/shopify/callback`
5. Click **Save**

#### Step 6: Update Your Project

**Update `.env`:**
```env
SHOPIFY_APP_URL=https://abc123.ngrok.io
```

**Update `shopify.app.toml`:**
```toml
application_url = "https://abc123.ngrok.io"

[auth]
redirect_urls = [
  "https://abc123.ngrok.io/auth/callback",
  "https://abc123.ngrok.io/auth/shopify/callback"
]
```

⚠️ **Important:** ngrok URLs change every time you restart ngrok (unless you have a paid plan with a fixed domain)

---

### **Option 2: Production Deployment**

#### Step 1: Deploy Your App

**Frontend (React App):**
- Deploy to Vercel, Netlify, or similar
- Example: `https://nusense-tryon.vercel.app`

**Backend (Server):**
- Deploy to Railway, Heroku, Render, or similar
- Example: `https://nusense-tryon-api.railway.app`

#### Step 2: Get Your Production URLs

**Option A: Same Domain (Recommended)**
- Deploy both frontend and backend on the same domain
- Example: `https://nusense-tryon.com`
- Backend: `https://nusense-tryon.com` (handles API routes)
- Frontend: `https://nusense-tryon.com` (serves React app)

**Option B: Separate Domains**
- Frontend: `https://nusense-tryon.vercel.app`
- Backend: `https://nusense-tryon-api.railway.app`
- **App URL:** Use backend URL (handles OAuth)
- Frontend can call backend API

#### Step 3: Configure in Partner Dashboard

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Navigate to **Apps** → Your App → **App setup**
3. Set **App URL:** `https://your-production-url.com`
4. Add **Allowed redirection URL(s):**
   - `https://your-production-url.com/auth/callback`
   - `https://your-production-url.com/auth/shopify/callback`
5. Click **Save**

---

## 📋 Complete URL Configuration Example

### **For Local Development (ngrok):**

```
App URL:
https://abc123.ngrok.io

Allowed Redirection URLs:
https://abc123.ngrok.io/auth/callback
https://abc123.ngrok.io/auth/shopify/callback
https://abc123.ngrok.io/api/auth/callback
```

### **For Production:**

```
App URL:
https://nusense-tryon.com

Allowed Redirection URLs:
https://nusense-tryon.com/auth/callback
https://nusense-tryon.com/auth/shopify/callback
https://nusense-tryon.com/api/auth/callback
```

---

## 🔧 Step-by-Step Setup Process

### **Step 1: Create App in Partner Dashboard**

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Click **Apps** → **Create app**
3. Choose **Create app manually**
4. Enter app name: "NUSENSE TryON"
5. Click **Create app**

### **Step 2: Get API Credentials**

1. In your app → **API credentials**
2. Copy **API key** (Client ID)
3. Copy **API secret key**

### **Step 3: Set Up ngrok (Development)**

```bash
# Terminal 1: Start server
npm run server:dev

# Terminal 2: Start ngrok
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

### **Step 4: Configure Partner Dashboard**

1. Go to your app → **App setup**
2. **App URL:** `https://abc123.ngrok.io`
3. **Allowed redirection URL(s):** Add these:
   ```
   https://abc123.ngrok.io/auth/callback
   https://abc123.ngrok.io/auth/shopify/callback
   ```
4. Click **Save**

### **Step 5: Configure Your Project**

**Update `.env`:**
```env
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_APP_URL=https://abc123.ngrok.io
```

**Update `shopify.app.toml`:**
```toml
client_id = "your_api_key_here"
application_url = "https://abc123.ngrok.io"

[auth]
redirect_urls = [
  "https://abc123.ngrok.io/auth/callback",
  "https://abc123.ngrok.io/auth/shopify/callback"
]
```

---

## ⚠️ Important Notes

### **URL Requirements:**
- ✅ Must be HTTPS (not HTTP)
- ✅ Must be publicly accessible
- ✅ Must match exactly (including trailing slashes)
- ✅ No trailing slashes in App URL
- ✅ Wildcards not allowed

### **Common Mistakes:**
- ❌ Using `http://` instead of `https://`
- ❌ Missing trailing slash in callback URLs
- ❌ Using localhost directly (won't work with Shopify)
- ❌ Typos in URLs
- ❌ Not updating URLs after ngrok restart

### **ngrok Notes:**
- Free ngrok URLs change on restart
- Paid ngrok plans have fixed domains
- For development, you can use free ngrok
- For production, use a fixed domain

---

## 🎯 Quick Reference

### **Development URLs:**
```bash
# Start ngrok
ngrok http 3000

# Copy the Forwarding URL
App URL: https://abc123.ngrok.io
Callback: https://abc123.ngrok.io/auth/callback
```

### **Production URLs:**
```
App URL: https://your-domain.com
Callback: https://your-domain.com/auth/callback
```

---

## ✅ Checklist

Before testing your app:

- [ ] ngrok is running (for development)
- [ ] Server is running on port 3000
- [ ] App URL set in Partner Dashboard
- [ ] Allowed redirection URLs added in Partner Dashboard
- [ ] `.env` file updated with ngrok URL
- [ ] `shopify.app.toml` updated with ngrok URL
- [ ] URLs match exactly (no typos)

---

## 🚀 Next Steps

After setting up URLs:

1. **Test OAuth:**
   ```bash
   npm run shopify:dev
   ```

2. **Install on dev store:**
   - Shopify CLI will open browser
   - Complete OAuth flow
   - Verify redirect works

3. **Test widget:**
   - Activate theme extension
   - Visit product page
   - Click try-on button
   - Verify widget opens

---

## 📞 Need Help?

If URLs aren't working:
1. Check ngrok is running
2. Verify URLs match exactly in Partner Dashboard
3. Check server logs for errors
4. Verify `.env` file has correct URL
5. Check browser console for errors

---

**That's it! You now have your App URL and Redirection URLs configured! 🎉**

