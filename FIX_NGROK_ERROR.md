# 🔧 Fix "ngrok endpoint is offline" Error

The error "The endpoint a3ef1c377916.ngrok-free.app is offline" means Shopify is still trying to use the old ngrok URL. Here's how to fix it:

---

## ✅ Step-by-Step Fix

### Step 1: Update Shopify Partner Dashboard URLs

**This is the most important step!**

1. **Go to [partners.shopify.com](https://partners.shopify.com)**
2. **Navigate to:** Apps → Your App → **App setup**
3. **Scroll to "URLs" section**
4. **Update App URL:**
   ```
   https://try-this-look.vercel.app
   ```
5. **Update Allowed redirection URL(s):**
   Remove the old ngrok URLs and add these:
   ```
   https://try-this-look.vercel.app/auth/callback
   https://try-this-look.vercel.app/auth/shopify/callback
   https://try-this-look.vercel.app/api/auth/callback
   ```
6. **Click "Save"** (very important!)

---

### Step 2: Update App Proxy URL

1. **In Partner Dashboard**, go to **App setup** → **App proxy**
2. **Update Proxy URL:**
   ```
   https://try-this-look.vercel.app
   ```
3. **Verify settings:**
   - Subpath prefix: `apps`
   - Subpath: `a`
4. **Click "Save"**

---

### Step 3: Redeploy Theme Extension

The theme extension might be cached with the old URL. Redeploy it:

```bash
shopify app deploy
```

Or manually:
1. Go to Partner Dashboard → Your App → **Extensions**
2. Click on your theme extension
3. Click **"Publish"** or **"Update"**

---

### Step 4: Clear App Cache

1. **Uninstall the app** from your test store (if installed)
2. **Reinstall the app** to get fresh configuration
3. Or wait 5-10 minutes for Shopify's cache to clear

---

### Step 5: Verify Configuration

Check that all URLs are correct:

1. **Partner Dashboard URLs:**
   - App URL: `https://try-this-look.vercel.app`
   - Redirect URLs: All should use `try-this-look.vercel.app`
   - App Proxy URL: `https://try-this-look.vercel.app`

2. **Your `shopify.app.toml` file:**
   ```toml
   application_url = "https://try-this-look.vercel.app"
   [auth]
   redirect_urls = [
     "https://try-this-look.vercel.app/auth/callback",
     "https://try-this-look.vercel.app/auth/shopify/callback",
     "https://try-this-look.vercel.app/api/auth/callback"
   ]
   [app_proxy]
   url = "https://try-this-look.vercel.app"
   ```

3. **Vercel Environment Variables:**
   - `SHOPIFY_APP_URL=https://try-this-look.vercel.app`

---

### Step 6: Test the Fix

1. **Test Health Endpoint:**
   ```bash
   curl https://try-this-look.vercel.app/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Test OAuth:**
   - Go to your Shopify admin
   - Uninstall the app (if installed)
   - Reinstall the app
   - Complete OAuth flow
   - Should redirect to Vercel URL, not ngrok

3. **Test Widget:**
   - Go to a product page
   - Click try-on button
   - Should load from Vercel URL

---

## 🚨 Common Issues

### Issue: Still seeing ngrok URL after updating

**Solution:**
- Wait 5-10 minutes for Shopify's cache to clear
- Uninstall and reinstall the app
- Clear browser cache
- Check Partner Dashboard URLs again (make sure you clicked "Save")

### Issue: OAuth redirect fails

**Solution:**
- Verify redirect URLs match exactly in Partner Dashboard
- Check for typos (https:// not http://)
- Ensure no trailing slashes
- Verify `SHOPIFY_APP_URL` in Vercel environment variables

### Issue: Widget not loading

**Solution:**
- Check browser console for errors
- Verify widget script URL: `https://try-this-look.vercel.app/nusense-tryon-widget.js`
- Check if theme extension is published
- Verify app proxy is configured correctly

---

## 📋 Checklist

Before testing, verify:

- [ ] Partner Dashboard App URL updated to Vercel URL
- [ ] Partner Dashboard Redirect URLs updated (all 3)
- [ ] Partner Dashboard App Proxy URL updated
- [ ] Clicked "Save" in Partner Dashboard
- [ ] `shopify.app.toml` has correct URLs
- [ ] Theme extension redeployed (`shopify app deploy`)
- [ ] Vercel environment variable `SHOPIFY_APP_URL` set correctly
- [ ] App uninstalled and reinstalled (to clear cache)
- [ ] Health endpoint works: `https://try-this-look.vercel.app/health`

---

## 🎯 Quick Fix Summary

1. **Partner Dashboard** → App setup → URLs → Update to Vercel URL → **Save**
2. **Partner Dashboard** → App setup → App proxy → Update to Vercel URL → **Save**
3. **Redeploy extension:** `shopify app deploy`
4. **Uninstall/reinstall app** on test store
5. **Test again**

---

## 💡 Why This Happens

Shopify caches app configuration for performance. When you change URLs:
- Partner Dashboard needs to be updated
- Theme extension needs to be redeployed
- App needs to be reinstalled to clear cache
- Sometimes takes 5-10 minutes for changes to propagate

---

**After following these steps, the ngrok error should be resolved!** ✅

