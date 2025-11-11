# Shopify App Bridge Architecture Overview

## Current Architecture (Non-Embedded)

```
┌─────────────────────────────────────────────────────────┐
│                    Shopify Admin                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  User clicks "Open App"                          │  │
│  │  → Opens app in NEW WINDOW/TAB                   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              NUSENSE TryON App (Standalone)             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React App (No App Bridge)                       │  │
│  │  - Index Page                                    │  │
│  │  - Widget Page                                   │  │
│  │  - Product Demo Page                             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Storefront (Widget Usage)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Theme App Extension                             │  │
│  │  - iframe with widget                            │  │
│  │  - Product data extraction                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Target Architecture (Embedded with App Bridge)

```
┌─────────────────────────────────────────────────────────┐
│                    Shopify Admin                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  App Home (Embedded iframe)                      │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  App Bridge Provider                       │  │  │
│  │  │  ┌──────────────────────────────────────┐  │  │  │
│  │  │  │  React App                           │  │  │  │
│  │  │  │  - Index Page                        │  │  │  │
│  │  │  │  - Widget Page                       │  │  │  │
│  │  │  │  - Product Demo Page                 │  │  │  │
│  │  │  └──────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │  ↑                                               │  │
│  │  │ App Bridge Communication                     │  │
│  │  │ - Route sync                                 │  │
│  │  │ - Toast notifications                        │  │
│  │  │ - Modal dialogs                              │  │
│  │  │ - Session tokens                             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Storefront (Widget Usage)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Theme App Extension (Unchanged)                 │  │
│  │  - iframe with widget                            │  │
│  │  - Product data extraction                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Component Hierarchy

### Before (Current)
```
App.tsx
├── QueryClientProvider
├── TooltipProvider
├── Sonner
└── BrowserRouter
    └── Routes
        ├── Index
        ├── Widget
        ├── ProductDemo
        └── NotFound
```

### After (With App Bridge)
```
App.tsx
├── AppBridgeProviderWrapper  ← NEW
│   └── AppBridgeProvider (from @shopify/app-bridge-react)
│       ├── QueryClientProvider
│       ├── TooltipProvider
│       ├── Sonner
│       └── BrowserRouter
│           └── AppBridgeRouter  ← NEW (Route Propagation)
│               └── Routes
│                   ├── Index
│                   ├── Widget
│                   ├── ProductDemo
│                   └── NotFound
```

## Data Flow

### Authentication Flow (Embedded App)

```
1. User opens app in Shopify Admin
   ↓
2. Shopify Admin loads app iframe with:
   - apiKey (from meta tag)
   - host parameter (in URL)
   ↓
3. App Bridge Provider initializes:
   - Reads apiKey from meta tag
   - Reads host from URL parameters
   - Creates App Bridge config
   ↓
4. If not authenticated:
   - App Bridge handles OAuth flow
   - Token exchange (if using new auth strategy)
   - Session token retrieval
   ↓
5. App renders with authenticated context
```

### API Request Flow (Embedded App)

```
React Component
  ↓
useAppBridge() hook
  ↓
getSessionToken(app)
  ↓
App Bridge (handles token)
  ↓
Fetch API call to Shopify Admin API
  ↓
Shopify Admin API (authenticated)
  ↓
Response data
```

## Key Configuration Changes

### 1. shopify.app.toml
```diff
- embedded = false
+ embedded = true

+ [admin]
+ direct_api_access = true
+ access_mode = "online"
```

### 2. server/index.js
```diff
const shopify = shopifyApi({
  apiKey: apiKey || "",
  apiSecretKey: apiSecret || "",
  scopes: ...,
  hostName: hostName,
  apiVersion: LATEST_API_VERSION,
- isEmbeddedApp: false,
+ isEmbeddedApp: true,
  restResources,
});
```

### 3. index.html
```diff
<head>
+ <meta name="shopify-api-key" content="%VITE_SHOPIFY_API_KEY%" />
+ <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
  <!-- existing head content -->
</head>
```

### 4. App.tsx
```diff
+ import { AppBridgeProviderWrapper } from '@/providers/AppBridgeProvider';

const App = () => {
+ const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY || '';

  return (
+   <AppBridgeProviderWrapper apiKey={apiKey}>
      <QueryClientProvider client={queryClient}>
        {/* existing providers */}
      </QueryClientProvider>
+   </AppBridgeProviderWrapper>
  );
};
```

## File Structure

### New Files to Create
```
src/
├── providers/
│   └── AppBridgeProvider.tsx  ← NEW
├── hooks/
│   └── useAppBridge.ts  ← NEW
└── ... (existing files)
```

### Files to Modify
```
├── shopify.app.toml  ← Modify
├── package.json  ← Modify
├── index.html  ← Modify
├── src/
│   ├── App.tsx  ← Modify
│   └── main.tsx  ← Modify (if needed)
└── server/
    └── index.js  ← Modify
```

## Environment Variables

### Required Variables
```bash
# Frontend (exposed to browser)
VITE_SHOPIFY_API_KEY=your_api_key_here

# Backend (server-side only)
VITE_SHOPIFY_API_SECRET=your_api_secret_here
VITE_SHOPIFY_APP_URL=https://try-this-look.vercel.app
VITE_SCOPES=write_products,read_products,write_themes,read_themes
```

## Dependencies

### New Dependencies
```json
{
  "dependencies": {
    "@shopify/app-bridge-react": "^4.0.0"
  }
}
```

### Existing Dependencies (No Changes)
```json
{
  "dependencies": {
    "@shopify/shopify-api": "^11.0.0",
    "react": "^18.3.1",
    "react-router-dom": "^6.30.1"
  }
}
```

## Security Considerations

### 1. API Key in Frontend
- **Expected**: App Bridge requires API key in frontend
- **Security**: API key is public, but paired with API secret on server
- **Mitigation**: Validate all requests on server

### 2. Host Parameter
- **Risk**: Malicious host parameter
- **Mitigation**: Validate host format (Shopify domain pattern)
- **Implementation**: Check host matches `*.myshopify.com` or `admin.shopify.com`

### 3. CSP Headers
- **Requirement**: Allow embedding in Shopify Admin
- **Implementation**: `frame-ancestors https://admin.shopify.com https://*.myshopify.com`
- **Scripts**: Allow App Bridge CDN scripts

### 4. Session Tokens
- **Security**: Tokens are short-lived (online access mode)
- **Validation**: Verify token signature on server
- **Storage**: Tokens handled by App Bridge (not stored in localStorage)

## Testing Strategy

### 1. Development Store Testing
```
1. Install app on development store
2. Open app in Shopify Admin
3. Verify App Bridge initializes
4. Test authentication flow
5. Test routing
6. Test API calls
```

### 2. Widget Testing
```
1. Install theme app extension
2. Add widget to product page
3. Verify widget loads
4. Test product data extraction
5. Test try-on functionality
```

### 3. Integration Testing
```
1. Test embedded app flow
2. Test widget flow (storefront)
3. Test OAuth flow
4. Test session management
5. Test error handling
```

## Migration Checklist

### Phase 1: Configuration
- [ ] Update `shopify.app.toml` (embedded = true)
- [ ] Update `server/index.js` (isEmbeddedApp: true)
- [ ] Update CSP headers
- [ ] Update OAuth callback

### Phase 2: Dependencies
- [ ] Install `@shopify/app-bridge-react`
- [ ] Update `package.json`
- [ ] Run `npm install`

### Phase 3: Frontend
- [ ] Add App Bridge script to `index.html`
- [ ] Create `AppBridgeProvider.tsx`
- [ ] Create `useAppBridge.ts` hook
- [ ] Update `App.tsx`
- [ ] Update routing

### Phase 4: Testing
- [ ] Test in development store
- [ ] Test widget functionality
- [ ] Test OAuth flow
- [ ] Test API calls
- [ ] Test error handling

### Phase 5: Deployment
- [ ] Deploy to staging
- [ ] Test in staging
- [ ] Deploy to production
- [ ] Monitor for errors

## Benefits of App Bridge

### 1. Seamless Integration
- App appears native to Shopify Admin
- Consistent UI with Shopify Admin
- Better user experience

### 2. Enhanced Features
- Toast notifications
- Modal dialogs
- Context bars
- Loading states
- Route synchronization

### 3. Simplified Authentication
- No redirects (with new auth strategy)
- Automatic token management
- Session handling

### 4. Better Performance
- Direct API access
- Optimized loading
- Cached resources

## Potential Challenges

### 1. Iframe Limitations
- **Issue**: Some browser APIs may be restricted
- **Solution**: Use App Bridge APIs instead

### 2. Routing Complexity
- **Issue**: Route synchronization between app and admin
- **Solution**: Use App Bridge route propagation

### 3. Authentication Flow
- **Issue**: OAuth flow in iframe
- **Solution**: Use App Bridge authentication

### 4. CSP Headers
- **Issue**: Content Security Policy restrictions
- **Solution**: Proper CSP configuration for embedded apps

## Success Metrics

### 1. Technical Metrics
- App Bridge initializes successfully
- OAuth flow completes without errors
- Routes sync correctly
- API calls succeed
- No console errors

### 2. User Experience Metrics
- App loads quickly in Shopify Admin
- Navigation is smooth
- No authentication issues
- Widget works on storefront

### 3. Business Metrics
- App installation rate
- User engagement
- Error rate
- Support tickets

---

## Conclusion

This architecture overview provides a visual representation of the App Bridge implementation. The key changes are:

1. **Embedded App Configuration**: App runs in iframe within Shopify Admin
2. **App Bridge Integration**: App Bridge Provider wraps the React app
3. **Route Synchronization**: Routes sync between app and admin
4. **Authentication**: Simplified OAuth flow with App Bridge
5. **API Access**: Direct API access with automatic authentication

The implementation maintains backward compatibility with the widget functionality on the storefront while adding the benefits of an embedded app in the Shopify Admin.

