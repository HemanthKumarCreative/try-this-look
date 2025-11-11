# Shopify App Bridge Implementation Plan

## Executive Summary

This document outlines a comprehensive plan to correctly implement Shopify App Bridge in the NUSENSE TryON Shopify app. The app is currently configured as a **non-embedded app** (`embedded = false`) and needs to be migrated to an **embedded app** to leverage App Bridge features and provide a seamless experience within the Shopify Admin.

---

## Current State Analysis

### 1. Configuration Issues
- **shopify.app.toml**: `embedded = false` (line 6)
- **server/index.js**: `isEmbeddedApp: false` (line 64)
- **Missing App Bridge**: No App Bridge script or React library installed
- **No App Bridge Provider**: React app doesn't use App Bridge Provider
- **Authentication Flow**: Uses legacy OAuth flow (redirects required)

### 2. Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + @shopify/shopify-api v11.0.0
- **Routing**: React Router DOM v6
- **UI Components**: Shadcn/Radix UI components
- **Current Pages**: Index, Widget, ProductDemo, NotFound

### 3. Current App Behavior
- App opens in a new window/tab (non-embedded)
- Uses traditional OAuth redirect flow
- Widget functionality works via iframe on storefront
- No integration with Shopify Admin UI

---

## Implementation Plan

### Phase 1: Configuration Updates

#### 1.1 Update shopify.app.toml
**File**: `shopify.app.toml`

**Changes Required**:
```toml
# Change from:
embedded = false

# To:
embedded = true
```

**Additional Configuration** (if needed):
```toml
[admin]
# Enable direct API access for embedded apps
direct_api_access = true
# Use online access mode for user-specific tokens
access_mode = "online"
```

#### 1.2 Update Server Configuration
**File**: `server/index.js`

**Changes Required**:
```javascript
// Change from:
isEmbeddedApp: false,

// To:
isEmbeddedApp: true,
```

**Additional Server Updates**:
- Update OAuth callback to handle `host` parameter from Shopify Admin
- Ensure proper session storage for embedded app context
- Update CSP headers for iframe embedding
- Handle token exchange for embedded apps (if using new auth strategy)

#### 1.3 Update Authentication Flow
**File**: `server/index.js` (OAuth routes)

**Changes Required**:
- Update `/auth/callback` to preserve `host` parameter
- Ensure redirect URL includes `host` parameter for embedded app
- Handle embedded app authentication redirects correctly

**Current Code** (lines 233-280):
```javascript
app.get("/auth/callback", async (req, res) => {
  // ... existing code ...
  const host = req.query.host;
  const shop = session.shop;
  const apiKey = process.env.VITE_SHOPIFY_API_KEY;
  
  // Construct redirect URL after OAuth
  let redirectUrl = `https://${shop}/admin/apps/${apiKey}`;
  
  if (host) {
    redirectUrl += `?host=${encodeURIComponent(host)}`;
  }
  
  res.redirect(redirectUrl);
});
```

**Required Updates**:
- Ensure `host` parameter is properly encoded
- Validate `host` parameter for security
- Handle both embedded and non-embedded scenarios

---

### Phase 2: Frontend Dependencies

#### 2.1 Install App Bridge React Library
**Command**:
```bash
npm install @shopify/app-bridge-react
```

**Package**: `@shopify/app-bridge-react`
- Provides React components and hooks for App Bridge
- Includes TypeScript types
- Version: Latest stable (check npm for current version)

#### 2.2 Update package.json
**File**: `package.json`

**Add Dependency**:
```json
{
  "dependencies": {
    "@shopify/app-bridge-react": "^4.0.0" // Use latest version
  }
}
```

---

### Phase 3: HTML Configuration

#### 3.1 Update index.html
**File**: `index.html`

**Changes Required**:

**Option A: CDN (Recommended for Quick Setup)**
```html
<head>
  <!-- Existing meta tags -->
  
  <!-- Add App Bridge Meta Tag -->
  <meta name="shopify-api-key" content="%SHOPIFY_API_KEY%" />
  
  <!-- Add App Bridge Script -->
  <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
  
  <!-- Existing head content -->
</head>
```

**Option B: Environment Variable Injection**
Since the app uses Vite, inject the API key from environment variables:
```html
<head>
  <meta name="shopify-api-key" content="%VITE_SHOPIFY_API_KEY%" />
  <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
</head>
```

**Implementation Notes**:
- Replace `%SHOPIFY_API_KEY%` or `%VITE_SHOPIFY_API_KEY%` with actual API key
- Use Vite's environment variable replacement: `import.meta.env.VITE_SHOPIFY_API_KEY`
- Consider server-side rendering for secure API key injection

---

### Phase 4: React App Integration

#### 4.1 Create App Bridge Provider Wrapper
**New File**: `src/providers/AppBridgeProvider.tsx`

**Implementation**:
```typescript
import { useEffect, useState } from 'react';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import { getSessionToken } from '@shopify/app-bridge-utils';

interface AppBridgeConfig {
  apiKey: string;
  host: string;
  forceRedirect?: boolean;
}

interface AppBridgeProviderWrapperProps {
  children: React.ReactNode;
  apiKey: string;
}

export const AppBridgeProviderWrapper = ({ 
  children, 
  apiKey 
}: AppBridgeProviderWrapperProps) => {
  const [host, setHost] = useState<string>('');
  const [config, setConfig] = useState<AppBridgeConfig | null>(null);

  useEffect(() => {
    // Get host parameter from URL (Shopify Admin provides this)
    const urlParams = new URLSearchParams(window.location.search);
    const hostParam = urlParams.get('host');
    
    if (hostParam) {
      setHost(hostParam);
      setConfig({
        apiKey,
        host: hostParam,
        forceRedirect: true,
      });
    } else {
      // For development or non-embedded scenarios
      // Check if we're in an iframe (Shopify Admin context)
      const isInIframe = window.self !== window.top;
      
      if (isInIframe) {
        // Try to get host from parent or use default
        setHost(window.location.hostname);
        setConfig({
          apiKey,
          host: window.location.hostname,
        });
      }
    }
  }, [apiKey]);

  // Don't render App Bridge Provider if config is not ready
  if (!config || !host) {
    return <>{children}</>;
  }

  return (
    <AppBridgeProvider config={config}>
      {children}
    </AppBridgeProvider>
  );
};
```

#### 4.2 Update App.tsx
**File**: `src/App.tsx`

**Changes Required**:
```typescript
import { AppBridgeProviderWrapper } from '@/providers/AppBridgeProvider';

const App = () => {
  // Get API key from environment variable
  const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY || '';

  return (
    <AppBridgeProviderWrapper apiKey={apiKey}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/demo" element={<ProductDemo />} />
              <Route path="/widget" element={<Widget />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AppBridgeProviderWrapper>
  );
};
```

#### 4.3 Create Hook for App Bridge Context
**New File**: `src/hooks/useAppBridge.ts`

**Implementation**:
```typescript
import { useAppBridge } from '@shopify/app-bridge-react';
import { getSessionToken } from '@shopify/app-bridge-utils';

export const useShopifyAppBridge = () => {
  const app = useAppBridge();

  const getToken = async (): Promise<string | null> => {
    try {
      const token = await getSessionToken(app);
      return token;
    } catch (error) {
      console.error('Error getting session token:', error);
      return null;
    }
  };

  return {
    app,
    getToken,
  };
};
```

---

### Phase 5: Routing Integration

#### 5.1 Update Router for App Bridge
**File**: `src/App.tsx`

**Changes Required**:
App Bridge React library provides routing utilities. Update routing to work with App Bridge:

```typescript
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoutePropagation } from '@shopify/app-bridge-react';

// Create a component that handles route propagation
const AppBridgeRouter = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Sync routes with Shopify Admin
  useRoutePropagation(location);

  return <>{children}</>;
};

// Update App component
const App = () => {
  const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY || '';

  return (
    <AppBridgeProviderWrapper apiKey={apiKey}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <AppBridgeRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/demo" element={<ProductDemo />} />
                <Route path="/widget" element={<Widget />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppBridgeRouter>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AppBridgeProviderWrapper>
  );
};
```

---

### Phase 6: Server-Side Updates

#### 6.1 Update CSP Headers
**File**: `server/index.js`

**Current Code** (lines 182-189):
```javascript
app.use((req, res, next) => {
  res.removeHeader("X-Frame-Options");
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors https://admin.shopify.com https://*.myshopify.com https://*.shopify.com;"
  );
  next();
});
```

**Required Updates**:
- Ensure CSP allows embedding in Shopify Admin
- Add App Bridge script sources to CSP
- Update frame-ancestors for embedded apps

**Updated Code**:
```javascript
app.use((req, res, next) => {
  // Remove X-Frame-Options for embedded apps
  res.removeHeader("X-Frame-Options");
  
  // Updated CSP for App Bridge
  res.setHeader(
    "Content-Security-Policy",
    [
      "frame-ancestors https://admin.shopify.com https://*.myshopify.com https://*.shopify.com;",
      "script-src 'self' https://cdn.shopify.com https://*.shopify.com 'unsafe-inline' 'unsafe-eval';",
      "connect-src 'self' https://*.shopify.com https://*.myshopify.com;",
    ].join(" ")
  );
  next();
});
```

#### 6.2 Update OAuth Callback
**File**: `server/index.js`

**Ensure Proper Host Handling**:
```javascript
app.get("/auth/callback", async (req, res) => {
  try {
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callbackResponse;
    const host = req.query.host;
    const shop = session.shop;
    const apiKey = process.env.VITE_SHOPIFY_API_KEY;

    if (!shop || !apiKey) {
      return res.status(500).json({
        error: "Invalid session data",
        message: "Missing shop or API key information",
      });
    }

    // For embedded apps, redirect to app with host parameter
    if (host) {
      // Embedded app redirect
      const redirectUrl = `https://${shop}/admin/apps/${apiKey}?host=${encodeURIComponent(host)}`;
      res.redirect(redirectUrl);
    } else {
      // Fallback for non-embedded (shouldn't happen with embedded = true)
      const redirectUrl = `https://${shop}/admin/apps/${apiKey}`;
      res.redirect(redirectUrl);
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        error: "OAuth callback failed",
        message: error.message || "An error occurred during the OAuth callback",
      });
    }
  }
});
```

---

### Phase 7: Environment Variables

#### 7.1 Update Environment Variables
**Files**: `.env`, `.env.example`

**Required Variables**:
```bash
# Shopify App Configuration
VITE_SHOPIFY_API_KEY=your_api_key_here
VITE_SHOPIFY_API_SECRET=your_api_secret_here
VITE_SHOPIFY_APP_URL=https://try-this-look.vercel.app
VITE_SCOPES=write_products,read_products,write_themes,read_themes
```

**Notes**:
- Ensure `VITE_SHOPIFY_API_KEY` is available in frontend code
- Keep `VITE_SHOPIFY_API_SECRET` server-side only (not exposed to frontend)
- Update Vercel environment variables if deploying

---

### Phase 8: Testing Strategy

#### 8.1 Development Testing
1. **Local Development**:
   - Use `shopify app dev` command
   - Test embedded app in Shopify Admin
   - Verify App Bridge initialization
   - Test routing and navigation

2. **Embedded App Testing**:
   - Install app on development store
   - Verify app loads in Shopify Admin iframe
   - Test OAuth flow with `host` parameter
   - Verify session token retrieval

3. **Widget Testing**:
   - Ensure widget still works on storefront
   - Test iframe communication
   - Verify product data extraction

#### 8.2 Test Checklist
- [ ] App loads in Shopify Admin (embedded)
- [ ] App Bridge script loads correctly
- [ ] App Bridge Provider initializes
- [ ] OAuth flow completes successfully
- [ ] Session token can be retrieved
- [ ] Routes sync with Shopify Admin
- [ ] Widget functionality works on storefront
- [ ] CSP headers allow embedding
- [ ] Host parameter is handled correctly

---

### Phase 9: Migration Considerations

#### 9.1 Backward Compatibility
- **Widget Functionality**: Must continue to work on storefront
- **Non-Embedded Access**: Consider keeping support for direct access
- **Theme App Extension**: Should continue to work independently

#### 9.2 Rollout Strategy
1. **Development**: Test in development store
2. **Staging**: Deploy to staging environment
3. **Production**: Deploy with feature flag (if possible)
4. **Monitor**: Watch for errors and user feedback

#### 9.3 Rollback Plan
- Keep `embedded = false` configuration as backup
- Maintain non-embedded OAuth flow
- Test rollback procedure before deployment

---

### Phase 10: Additional Features (Optional)

#### 10.1 App Bridge Features to Implement
1. **Toast Notifications**: Use App Bridge toast API
2. **Modal Dialogs**: Use App Bridge modal API
3. **Loading States**: Use App Bridge loading API
4. **Context Bar**: Use App Bridge context bar for actions
5. **Banner**: Use App Bridge banner for announcements

#### 10.2 Polaris Integration (Optional)
- Consider integrating Shopify Polaris design system
- Provides consistent UI with Shopify Admin
- Better user experience for merchants

---

## Implementation Order

### Step 1: Configuration (Critical)
1. Update `shopify.app.toml`: Set `embedded = true`
2. Update `server/index.js`: Set `isEmbeddedApp: true`
3. Update CSP headers for embedded app

### Step 2: Dependencies (Critical)
1. Install `@shopify/app-bridge-react`
2. Update `package.json`

### Step 3: Frontend Integration (Critical)
1. Add App Bridge script to `index.html`
2. Create `AppBridgeProviderWrapper` component
3. Update `App.tsx` to use App Bridge Provider
4. Create `useAppBridge` hook

### Step 4: Routing (Important)
1. Update router for App Bridge route propagation
2. Test routing in embedded context

### Step 5: Server Updates (Important)
1. Update OAuth callback for `host` parameter
2. Test authentication flow

### Step 6: Testing (Critical)
1. Test in development store
2. Verify all functionality works
3. Test widget on storefront

### Step 7: Deployment (Critical)
1. Deploy to staging
2. Test in production-like environment
3. Deploy to production

---

## Key Files to Modify

### Configuration Files
- `shopify.app.toml` - Set `embedded = true`
- `package.json` - Add `@shopify/app-bridge-react`
- `.env` - Ensure API key is set

### Frontend Files
- `index.html` - Add App Bridge script and meta tag
- `src/App.tsx` - Wrap with App Bridge Provider
- `src/main.tsx` - Ensure API key is available
- `src/providers/AppBridgeProvider.tsx` - **NEW FILE**
- `src/hooks/useAppBridge.ts` - **NEW FILE**

### Backend Files
- `server/index.js` - Update `isEmbeddedApp`, CSP headers, OAuth callback

### Documentation
- Update README with App Bridge setup instructions
- Document environment variables
- Document deployment process

---

## Security Considerations

### 1. API Key Exposure
- **Risk**: API key exposed in frontend code
- **Mitigation**: Use environment variables, validate on server
- **Note**: App Bridge requires API key in frontend (this is expected)

### 2. Host Parameter Validation
- **Risk**: Malicious `host` parameter in OAuth callback
- **Mitigation**: Validate `host` parameter format
- **Implementation**: Check host matches Shopify domain pattern

### 3. CSP Headers
- **Risk**: XSS attacks through iframe
- **Mitigation**: Proper CSP headers, validate all inputs
- **Implementation**: Restrict script sources, frame ancestors

### 4. Session Token Security
- **Risk**: Token interception
- **Mitigation**: Use HTTPS, validate tokens on server
- **Implementation**: Verify token signature, check expiration

---

## Troubleshooting Guide

### Issue: App Bridge Not Initializing
**Symptoms**: `shopify` global variable not available
**Solutions**:
1. Check App Bridge script is loaded
2. Verify API key is correct
3. Check browser console for errors
4. Ensure `host` parameter is present

### Issue: OAuth Redirect Fails
**Symptoms**: Redirect loop or authentication failure
**Solutions**:
1. Verify `host` parameter in callback
2. Check redirect URLs in `shopify.app.toml`
3. Verify session storage is working
4. Check server logs for errors

### Issue: Routes Not Syncing
**Symptoms**: URL in admin doesn't match app URL
**Solutions**:
1. Verify `useRoutePropagation` is called
2. Check router configuration
3. Ensure App Bridge Provider is mounted
4. Check for console errors

### Issue: Widget Not Working
**Symptoms**: Widget doesn't load on storefront
**Solutions**:
1. Verify widget route is accessible
2. Check iframe permissions
3. Verify product data extraction
4. Check CSP headers allow embedding

---

## Resources

### Documentation
- [App Bridge Library](https://shopify.dev/docs/api/app-bridge-library)
- [Embedded Apps](https://shopify.dev/docs/apps/admin/embedded-app-home)
- [App Bridge React](https://shopify.dev/docs/api/app-bridge-library/react-components)
- [Authentication](https://shopify.dev/docs/apps/auth)

### Tools
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [App Bridge DevTools](https://shopify.dev/docs/api/app-bridge-library#global-variable)

### Community
- [Shopify Community Forums](https://community.shopify.com/)
- [App Bridge GitHub](https://github.com/Shopify/shopify-app-bridge)

---

## Next Steps

1. **Review this plan** with the team
2. **Set up development environment** with Shopify CLI
3. **Create feature branch** for App Bridge implementation
4. **Follow implementation order** step by step
5. **Test thoroughly** before deployment
6. **Deploy to staging** first
7. **Monitor and iterate** based on feedback

---

## Notes

- This plan assumes the app will be **fully embedded** in Shopify Admin
- Widget functionality on storefront should **continue to work** independently
- Consider **gradual rollout** if you have active users
- Keep **backward compatibility** in mind during migration
- **Test extensively** in development store before production deployment

---

## Conclusion

This implementation plan provides a comprehensive guide to correctly implement Shopify App Bridge in the NUSENSE TryON app. Following this plan will ensure:

1. ✅ Proper embedded app configuration
2. ✅ Correct App Bridge integration
3. ✅ Seamless Shopify Admin experience
4. ✅ Maintained widget functionality
5. ✅ Secure authentication flow
6. ✅ Proper routing synchronization

**Estimated Implementation Time**: 2-3 days (including testing)
**Complexity**: Medium
**Risk Level**: Low (with proper testing)

---

**Last Updated**: [Current Date]
**Version**: 1.0
**Status**: Planning Phase

