# 🚀 Deploy Theme Extension Changes to Live Server

## ⚠️ Important: Changes Don't Auto-Sync

When you make changes to theme app extension files (like `nusense-tryon-button.liquid`), they **won't automatically appear on the live server**. You need to **deploy** them to Shopify.

---

## ✅ Quick Deploy Steps

### Step 1: Make Sure You're Logged In

```bash
shopify auth login
```

If you're already logged in, you can skip this step.

---

### Step 2: Deploy the Theme Extension

```bash
shopify app deploy
```

This command will:
- Upload your theme extension files to Shopify
- Make changes available to all stores using your app
- Update the extension on the live server

---

### Step 3: Wait for Deployment

The deployment usually takes 10-30 seconds. You'll see a success message when it's done.

---

### Step 4: Clear Cache (If Needed)

Sometimes changes might be cached. To see them immediately:

1. **In Shopify Admin:**
   - Go to your store admin
   - Navigate to **Online Store > Themes**
   - Click **"Customize"** on your active theme
   - Go to **App embeds**
   - Disable and re-enable **"NUSENSE TryON Button"**
   - Click **"Save"**

2. **Or wait 5-10 minutes** for Shopify's cache to clear automatically

---

## 🔄 Development Workflow

### For Development (Testing Changes Locally)

```bash
# Start development server with live reload
shopify app dev
```

This will:
- Watch for file changes
- Automatically deploy changes to your development store
- Show changes immediately (no manual deploy needed)

### For Production (Deploying to Live Server)

```bash
# Deploy to production
shopify app deploy
```

---

## 📝 Files That Need Deployment

These files require deployment after changes:

- ✅ `extensions/theme-app-extension/blocks/nusense-tryon-button.liquid`
- ✅ `extensions/theme-app-extension/snippets/nusense-tryon-script.liquid`
- ✅ `extensions/theme-app-extension/locales/*.json`
- ✅ `extensions/theme-app-extension/shopify.extension.toml`

---

## 🐛 Troubleshooting

### Changes Still Not Showing?

1. **Verify deployment succeeded:**
   ```bash
   shopify app deploy
   ```
   Check for any error messages.

2. **Check if extension is published:**
   - Go to Partner Dashboard → Your App → Extensions
   - Make sure the theme extension is **"Published"** (not just "Draft")

3. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private mode

4. **Check store has extension enabled:**
   - Go to store admin → Online Store → Themes → Customize
   - Check **App embeds** section
   - Make sure **"NUSENSE TryON Button"** is enabled

5. **Wait a few minutes:**
   - Shopify sometimes caches theme extensions
   - Changes can take 5-10 minutes to propagate

---

## 💡 Pro Tips

- **Always deploy after making changes** to theme extension files
- **Use `shopify app dev`** during development for automatic deployment
- **Use `shopify app deploy`** for production deployments
- **Test on a development store first** before deploying to production

---

## 📚 Related Commands

```bash
# Check deployment status
shopify app info

# List all extensions
shopify app list extensions

# Generate extension
shopify app generate extension

# View extension details
shopify app info --extension
```

---

**Need Help?** Check the [Shopify CLI Documentation](https://shopify.dev/docs/apps/tools/cli)

