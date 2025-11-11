# Shopify App Bridge Quick Reference Guide

## 🚀 Quick Start Checklist

### 1. Configuration (5 minutes)
- [ ] Set `embedded = true` in `shopify.app.toml`
- [ ] Set `isEmbeddedApp: true` in `server/index.js`
- [ ] Update CSP headers for iframe embedding

### 2. Dependencies (2 minutes)
- [ ] Run `npm install @shopify/app-bridge-react`
- [ ] Verify package added to `package.json`

### 3. HTML Setup (3 minutes)
- [ ] Add `<meta name="shopify-api-key">` to `index.html`
- [ ] Add App Bridge script: `<script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>`

### 4. React Integration (15 minutes)
- [ ] Create `src/providers/AppBridgeProvider.tsx`
- [ ] Create `src/hooks/useAppBridge.ts`
- [ ] Update `src/App.tsx` to use App Bridge Provider
- [ ] Add route propagation for routing

### 5. Server Updates (10 minutes)
- [ ] Update OAuth callback to handle `host` parameter
- [ ] Verify session storage works
- [ ] Test authentication flow

### 6. Testing (30 minutes)
- [ ] Test in development store
- [ ] Verify App Bridge initializes
- [ ] Test OAuth flow
- [ ] Test widget on storefront

**Total Time: ~65 minutes**

---

## 📋 Key Code Snippets

### 1. shopify.app.toml
```toml
embedded = true

[admin]
direct_api_access = true
access_mode = "online"
```

### 2. index.html
```html
<head>
  <meta name="shopify-api-key" content="%VITE_SHOPIFY_API_KEY%" />
  <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
</head>
```

### 3. AppBridgeProvider.tsx
```typescript
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';

export const AppBridgeProviderWrapper = ({ children, apiKey }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const host = urlParams.get('host');
  
  if (!host) return <>{children}</>;
  
  const config = {
    apiKey,
    host,
    forceRedirect: true,
  };
  
  return (
    <AppBridgeProvider config={config}>
      {children}
    </AppBridgeProvider>
  );
};
```

### 4. App.tsx
```typescript
import { AppBridgeProviderWrapper } from '@/providers/AppBridgeProvider';

const App = () => {
  const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY || '';
  
  return (
    <AppBridgeProviderWrapper apiKey={apiKey}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* your routes */}
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AppBridgeProviderWrapper>
  );
};
```

### 5. server/index.js
```javascript
const shopify = shopifyApi({
  // ... other config
  isEmbeddedApp: true, // ← Change this
});

// OAuth callback
app.get("/auth/callback", async (req, res) => {
  const { session } = await shopify.auth.callback({...});
  const host = req.query.host;
  const shop = session.shop;
  const apiKey = process.env.VITE_SHOPIFY_API_KEY;
  
  // Embedded app redirect
  const redirectUrl = `https://${shop}/admin/apps/${apiKey}?host=${encodeURIComponent(host)}`;
  res.redirect(redirectUrl);
});
```

### 6. Route Propagation
```typescript
import { useRoutePropagation } from '@shopify/app-bridge-react';
import { useLocation } from 'react-router-dom';

const AppBridgeRouter = ({ children }) => {
  const location = useLocation();
  useRoutePropagation(location); // Sync routes with Shopify Admin
  return <>{children}</>;
};
```

### 7. Get Session Token
```typescript
import { useAppBridge } from '@shopify/app-bridge-react';
import { getSessionToken } from '@shopify/app-bridge-utils';

const MyComponent = () => {
  const app = useAppBridge();
  
  const fetchData = async () => {
    const token = await getSessionToken(app);
    // Use token for API calls
  };
};
```

---

## 🔧 Common Issues & Solutions

### Issue: App Bridge not initializing
**Solution**:
1. Check API key is correct in `index.html`
2. Verify `host` parameter is in URL
3. Check browser console for errors
4. Ensure App Bridge script loads before React

### Issue: OAuth redirect loop
**Solution**:
1. Verify `host` parameter in callback
2. Check redirect URLs in `shopify.app.toml`
3. Ensure `embedded = true` in config
4. Clear browser cache and cookies

### Issue: Routes not syncing
**Solution**:
1. Add `useRoutePropagation` hook
2. Ensure App Bridge Provider is mounted
3. Check router configuration
4. Verify `host` parameter is present

### Issue: Widget not working
**Solution**:
1. Widget should work independently
2. Check iframe permissions
3. Verify product data extraction
4. Test on storefront (not in admin)

---

## 📦 Required Packages

```json
{
  "dependencies": {
    "@shopify/app-bridge-react": "^4.0.0",
    "@shopify/shopify-api": "^11.0.0",
    "react": "^18.3.1",
    "react-router-dom": "^6.30.1"
  }
}
```

---

## 🔐 Environment Variables

```bash
# Frontend (exposed)
VITE_SHOPIFY_API_KEY=your_api_key_here

# Backend (server-side)
VITE_SHOPIFY_API_SECRET=your_api_secret_here
VITE_SHOPIFY_APP_URL=https://try-this-look.vercel.app
VITE_SCOPES=write_products,read_products,write_themes,read_themes
```

---

## 🧪 Testing Commands

```bash
# Development
npm run dev
shopify app dev

# Build
npm run build

# Test in development store
shopify app dev --store=your-dev-store.myshopify.com
```

---

## 📚 Key Resources

- [App Bridge Documentation](https://shopify.dev/docs/api/app-bridge-library)
- [Embedded Apps Guide](https://shopify.dev/docs/apps/admin/embedded-app-home)
- [App Bridge React](https://shopify.dev/docs/api/app-bridge-library/react-components)
- [Authentication](https://shopify.dev/docs/apps/auth)

---

## ✅ Verification Steps

1. **App Bridge Initializes**
   - Open browser console in Shopify Admin
   - Check for `shopify` global variable
   - Verify no errors in console

2. **OAuth Works**
   - Install app on development store
   - Verify authentication completes
   - Check session is stored

3. **Routes Sync**
   - Navigate in app
   - Verify URL in admin bar updates
   - Check browser back/forward works

4. **API Calls Work**
   - Make API call from app
   - Verify request is authenticated
   - Check response is received

5. **Widget Works**
   - Add widget to product page
   - Verify widget loads
   - Test try-on functionality

---

## 🎯 Key Differences: Embedded vs Non-Embedded

| Feature | Non-Embedded | Embedded (App Bridge) |
|---------|--------------|----------------------|
| **App Location** | New window/tab | iframe in Shopify Admin |
| **OAuth Flow** | Full redirect | Token exchange (no redirect) |
| **Routing** | Independent | Synced with admin |
| **UI Integration** | Standalone | Integrated with admin |
| **API Access** | Manual tokens | Automatic authentication |
| **Notifications** | Custom | App Bridge toast API |
| **Modals** | Custom | App Bridge modal API |

---

## 🚨 Important Notes

1. **API Key in Frontend**: App Bridge requires API key in frontend (this is expected and secure)

2. **Host Parameter**: Always validate `host` parameter in OAuth callback

3. **CSP Headers**: Must allow embedding in Shopify Admin domains

4. **Widget Independence**: Widget functionality should work independently on storefront

5. **Backward Compatibility**: Consider keeping non-embedded support during migration

---

## 📞 Support

- **Documentation**: [shopify.dev](https://shopify.dev)
- **Community**: [Shopify Community Forums](https://community.shopify.com/)
- **GitHub**: [App Bridge Issues](https://github.com/Shopify/shopify-app-bridge/issues)

---

## 🎉 Success Criteria

- ✅ App loads in Shopify Admin iframe
- ✅ App Bridge initializes without errors
- ✅ OAuth flow completes successfully
- ✅ Routes sync with Shopify Admin
- ✅ API calls work with automatic authentication
- ✅ Widget continues to work on storefront
- ✅ No console errors
- ✅ Good user experience

---

**Last Updated**: [Current Date]
**Version**: 1.0

