# URL Configuration Guide

## 🔗 URLs That Need Configuration

### 1. Widget URL (Primary Configuration)

**What it is**: The base URL where your widget application is hosted (e.g., Vercel, Netlify, or your own domain).

**Where it's used:**
- Loading the widget JavaScript file (`nusense-tryon-widget.js`)
- Creating the iframe URL when the button is clicked
- Origin validation for secure postMessage communication

**Current Default**: `https://try-this-look.vercel.app`

---

## 📝 How to Configure

### Option 1: Via Shopify Metafields (Recommended)

Configure the widget URL in your Shopify admin using metafields:

1. **Go to Shopify Admin**
   - Navigate to: `Settings → Custom Data → Shop metafields`

2. **Add/Edit Metafield**
   - **Namespace**: `nusense`
   - **Key**: `widget_url`
   - **Type**: Single line text
   - **Value**: Your widget deployment URL (e.g., `https://your-widget-domain.com`)

**Example:**
```
Namespace: nusense
Key: widget_url
Value: https://try-this-look.vercel.app
```

### Option 2: Code Default (Fallback)

If the metafield is not set, the code uses this default:
```liquid
{% assign widget_url = shop.metafields.nusense.widget_url | default: 'https://try-this-look.vercel.app' %}
```

**To change the default**, edit:
- `extensions/theme-app-extension/snippets/nusense-tryon-script.liquid` (line 6)
- `extensions/theme-app-extension/blocks/nusense-tryon-button.liquid` (line 253)

---

## 🔍 Where URLs Are Used

### 1. Widget Script Loading
```liquid
script.src = '{{ widget_url }}/nusense-tryon-widget.js';
```
**File**: `nusense-tryon-script.liquid` (line 57)

### 2. Iframe URL Creation
```liquid
const widgetUrl = '{{ widget_url }}/widget?product_id=' + productId;
iframe.src = widgetUrl;
```
**File**: `nusense-tryon-button.liquid` (line 253, 290)

### 3. Origin Validation (Optional - Currently Commented)
```javascript
const widgetUrlObj = new URL(CONFIG.widgetUrl);
return origin === widgetUrlObj.origin;
```
**File**: `nusense-tryon-script.liquid` (lines 108-109)

---

## ✅ URL Requirements

### URL Format
- **Must be HTTPS** (required for secure iframe communication)
- **No trailing slash** (the code adds paths as needed)
- **Full domain** (include protocol: `https://`)

### Examples

✅ **Correct:**
```
https://try-this-look.vercel.app
https://widget.yourdomain.com
https://nusense-widget.netlify.app
```

❌ **Incorrect:**
```
http://try-this-look.vercel.app          (HTTP not HTTPS)
https://try-this-look.vercel.app/        (trailing slash)
try-this-look.vercel.app                 (missing protocol)
```

---

## 🔒 Security Considerations

### Origin Validation

The code includes optional origin validation to ensure messages only come from your widget domain. Currently, it's set to allow all origins (`'*'`) for development.

**To enable strict origin validation** (recommended for production):

1. Edit `extensions/theme-app-extension/snippets/nusense-tryon-script.liquid`
2. Find the `handleMessage` function (around line 273)
3. Uncomment the origin validation:
```javascript
// Change from:
// if (!isValidOrigin(event.origin)) {
//   log('Invalid origin', event.origin);
//   return;
// }

// To:
if (!isValidOrigin(event.origin)) {
  log('Invalid origin', event.origin);
  return;
}
```

4. Update `allowedOrigins` in CONFIG (line 91):
```javascript
allowedOrigins: ['https://try-this-look.vercel.app']  // Remove '*' and add your domain
```

---

## 🧪 Testing URL Configuration

### 1. Verify Widget Script Loads

1. Open your Shopify product page
2. Open browser console (F12)
3. Check Network tab for: `{widget_url}/nusense-tryon-widget.js`
4. Verify it loads successfully (Status: 200)

### 2. Verify Iframe URL

1. Click the "Try Now" button
2. Check browser console for any iframe errors
3. Verify the iframe URL matches: `{widget_url}/widget?product_id=...`

### 3. Test with Debug Mode

Enable debug mode to see URL-related logs:

1. Set metafield: `nusense.debug_mode = true`
2. Open browser console
3. Look for logs showing:
   - Widget URL configuration
   - Iframe creation
   - Message communication

---

## 🚀 Deployment URLs

### Common Deployment Platforms

#### Vercel
```
https://your-project.vercel.app
```

#### Netlify
```
https://your-project.netlify.app
```

#### Custom Domain
```
https://widget.yourdomain.com
```

#### Shopify App Proxy (Advanced)
If using Shopify app proxy:
```
/apps/apps/a/{your-app-path}
```

**Note**: App proxy URLs require additional configuration in `shopify.app.toml`.

---

## 📋 Configuration Checklist

Before going live, verify:

- [ ] Widget URL is set correctly in Shopify metafields
- [ ] URL uses HTTPS (not HTTP)
- [ ] URL has no trailing slash
- [ ] Widget script is accessible at: `{widget_url}/nusense-tryon-widget.js`
- [ ] Widget page is accessible at: `{widget_url}/widget`
- [ ] CORS is configured correctly on your deployment
- [ ] Origin validation is enabled for production (optional but recommended)
- [ ] Debug mode is disabled for production

---

## 🔧 Troubleshooting

### Issue: Widget Script Not Loading

**Symptoms:**
- Console error: "Failed to load NUSENSE TryON Widget"
- Network tab shows 404 for widget script

**Solutions:**
1. Verify widget URL is correct
2. Check if script exists at: `{widget_url}/nusense-tryon-widget.js`
3. Verify CORS settings on your deployment
4. Check if URL uses HTTPS

### Issue: Iframe Not Loading

**Symptoms:**
- Widget button clicked but no iframe appears
- Console shows iframe errors

**Solutions:**
1. Verify widget URL is correct
2. Check if widget page exists at: `{widget_url}/widget`
3. Verify CORS/iframe settings on your deployment
4. Check browser console for specific errors

### Issue: Images Not Transmitting

**Symptoms:**
- Widget opens but no images appear
- Console shows message errors

**Solutions:**
1. Enable debug mode: `nusense.debug_mode = true`
2. Check console for "Image transmission listener initialized"
3. Verify widget URL matches iframe origin
4. Check origin validation settings

---

## 📞 Need Help?

For URL configuration issues:
1. Check browser console for errors
2. Enable debug mode for detailed logs
3. Verify metafield configuration in Shopify admin
4. Test widget URL accessibility directly in browser

---

**Last Updated**: 2024  
**Related Files**:
- `extensions/theme-app-extension/snippets/nusense-tryon-script.liquid`
- `extensions/theme-app-extension/blocks/nusense-tryon-button.liquid`

