/**
 * App Bridge utilities for session token authentication
 * Uses App Bridge loaded from Shopify CDN
 * 
 * Based on Shopify official documentation:
 * https://shopify.dev/docs/apps/build/authentication-authorization/session-tokens/set-up-session-tokens
 * 
 * For App Bridge 2.0 with CDN, the structure is:
 * - window['app-bridge'].default.createApp()
 * - window['app-bridge'].actions.SessionToken.getSessionToken(app)
 */

declare global {
  interface Window {
    'app-bridge'?: {
      default: {
        createApp: (config: { apiKey: string; host: string }) => any;
      };
      actions?: {
        SessionToken?: {
          getSessionToken: (app: any) => Promise<string>;
        };
      };
    };
  }
}

/**
 * Check if App Bridge is fully loaded with all required components
 */
const isAppBridgeReady = (): boolean => {
  const appBridge = window['app-bridge'];
  if (!appBridge) {
    return false;
  }
  
  const hasDefault = !!appBridge.default;
  const hasCreateApp = !!appBridge.default?.createApp;
  const hasActions = !!appBridge.actions;
  const hasSessionToken = !!appBridge.actions?.SessionToken;
  const hasGetSessionToken = !!appBridge.actions?.SessionToken?.getSessionToken;
  
  const isReady = hasDefault && hasCreateApp && hasActions && hasSessionToken && hasGetSessionToken;
  
  if (!isReady) {
    console.log('[App Bridge] Not ready yet:', {
      hasDefault,
      hasCreateApp,
      hasActions,
      hasSessionToken,
      hasGetSessionToken,
      availableKeys: appBridge ? Object.keys(appBridge) : [],
      actionsKeys: appBridge?.actions ? Object.keys(appBridge.actions) : [],
    });
  }
  
  return isReady;
};

/**
 * Wait for App Bridge to be loaded with retries
 * Uses polling with exponential backoff to ensure App Bridge is fully ready
 */
const waitForAppBridge = (maxRetries: number = 20, initialDelay: number = 100): Promise<boolean> => {
  return new Promise((resolve) => {
    // First check if already ready
    if (isAppBridgeReady()) {
      console.log('[App Bridge] App Bridge already loaded and ready');
      resolve(true);
      return;
    }

    // Find the App Bridge script tag
    const scriptTag = document.querySelector('script[src*="app-bridge.js"]') as HTMLScriptElement;
    
    if (!scriptTag) {
      console.warn('[App Bridge] App Bridge script tag not found');
      console.warn('[App Bridge] Available scripts:', Array.from(document.querySelectorAll('script[src]')).map(s => (s as HTMLScriptElement).src));
      resolve(false);
      return;
    }

    console.log('[App Bridge] Found App Bridge script tag:', scriptTag.src);

    // Helper function to check with retries
    let retryCount = 0;
    const checkWithRetry = () => {
      if (isAppBridgeReady()) {
        console.log('[App Bridge] App Bridge loaded and ready after', retryCount, 'checks');
        resolve(true);
        return;
      }

      retryCount++;
      if (retryCount >= maxRetries) {
        console.error('[App Bridge] App Bridge not ready after', maxRetries, 'retries');
        console.error('[App Bridge] Current state:', {
          windowAppBridge: window['app-bridge'] ? Object.keys(window['app-bridge']) : 'not found',
          hasDefault: !!window['app-bridge']?.default,
          hasActions: !!window['app-bridge']?.actions,
          actionsKeys: window['app-bridge']?.actions ? Object.keys(window['app-bridge'].actions) : [],
        });
        resolve(false);
        return;
      }

      // Exponential backoff: 100ms, 150ms, 200ms, etc. up to 500ms
      const delay = Math.min(initialDelay + (retryCount * 50), 500);
      setTimeout(checkWithRetry, delay);
    };

    // Check if script is already loaded
    const scriptElement = scriptTag as HTMLScriptElement & { complete?: boolean; readyState?: string };
    const isComplete = scriptElement.complete || (scriptElement.readyState && scriptElement.readyState === 'complete');
    
    if (isComplete) {
      console.log('[App Bridge] Script already complete, checking for App Bridge...');
      // Start checking immediately
      checkWithRetry();
      return;
    }

    // Wait for script to load first
    console.log('[App Bridge] Waiting for App Bridge script to load...');
    
    const loadHandler = () => {
      scriptTag.removeEventListener('load', loadHandler);
      scriptTag.removeEventListener('error', errorHandler);
      console.log('[App Bridge] Script load event fired, starting readiness checks...');
      // Start checking after script loads
      checkWithRetry();
    };

    const errorHandler = () => {
      scriptTag.removeEventListener('load', loadHandler);
      scriptTag.removeEventListener('error', errorHandler);
      console.error('[App Bridge] Failed to load App Bridge script');
      resolve(false);
    };

    scriptTag.addEventListener('load', loadHandler);
    scriptTag.addEventListener('error', errorHandler);
    
    // Also start checking in case the event already fired
    setTimeout(checkWithRetry, initialDelay);
  });
};

/**
 * Initialize App Bridge and get session token
 * @returns Promise that resolves to the session token
 */
export const getSessionToken = async (): Promise<string | null> => {
  try {
    console.log('[App Bridge] ========================================');
    console.log('[App Bridge] Starting session token generation...');
    console.log('[App Bridge] ========================================');
    console.log('[App Bridge] Current URL:', window.location.href);
    console.log('[App Bridge] Timestamp:', new Date().toISOString());
    
    // Wait for App Bridge to load with retries
    console.log('[App Bridge] Waiting for App Bridge to be fully ready...');
    const bridgeLoaded = await waitForAppBridge(30, 100); // 30 retries, 100ms initial delay
    
    if (!bridgeLoaded) {
      console.error('[App Bridge] ========================================');
      console.error('[App Bridge] ❌ App Bridge not loaded after waiting');
      console.error('[App Bridge] ========================================');
      console.error('[App Bridge] Debugging information:');
      console.error('[App Bridge] - window["app-bridge"] exists:', !!window['app-bridge']);
      console.error('[App Bridge] - window["app-bridge"].default exists:', !!window['app-bridge']?.default);
      console.error('[App Bridge] - window["app-bridge"].actions exists:', !!window['app-bridge']?.actions);
      console.error('[App Bridge] - Script tag exists:', !!document.querySelector('script[src*="app-bridge.js"]'));
      
      const scriptTag = document.querySelector('script[src*="app-bridge.js"]') as HTMLScriptElement;
      if (scriptTag) {
        console.error('[App Bridge] - Script src:', scriptTag.src);
        console.error('[App Bridge] - Script complete:', (scriptTag as any).complete);
      }
      
      if (window['app-bridge']) {
        console.error('[App Bridge] - App Bridge keys:', Object.keys(window['app-bridge']));
        if (window['app-bridge'].actions) {
          console.error('[App Bridge] - Actions keys:', Object.keys(window['app-bridge'].actions));
        }
      }
      console.error('[App Bridge] ========================================');
      return null;
    }
    
    console.log('[App Bridge] ✅ App Bridge loaded and ready');

    // Get API key from meta tag
    const apiKeyMeta = document.querySelector('meta[name="shopify-api-key"]');
    if (!apiKeyMeta) {
      console.error('[App Bridge] ❌ Shopify API key meta tag not found');
      console.error('[App Bridge] Available meta tags:', Array.from(document.querySelectorAll('meta')).map(m => ({
        name: m.getAttribute('name'),
        property: m.getAttribute('property'),
      })));
      return null;
    }

    const apiKey = apiKeyMeta.getAttribute('content');
    if (!apiKey) {
      console.error('[App Bridge] ❌ Shopify API key not found in meta tag');
      return null;
    }
    console.log('[App Bridge] ✅ API key retrieved:', apiKey.substring(0, 8) + '...');

    // Get host parameter from URL (required for embedded apps)
    const urlParams = new URLSearchParams(window.location.search);
    const host = urlParams.get('host');

    if (!host) {
      console.error('[App Bridge] ❌ Host parameter not found in URL');
      console.error('[App Bridge] Current URL params:', Object.fromEntries(urlParams.entries()));
      console.error('[App Bridge] Full URL:', window.location.href);
      return null;
    }
    console.log('[App Bridge] ✅ Host parameter retrieved:', host);

    // Access App Bridge from CDN - double check it's ready
    const AppBridge = window['app-bridge'];
    if (!AppBridge || !AppBridge.default) {
      console.error('[App Bridge] ❌ App Bridge default export not found after readiness check');
      return null;
    }

    // Create App Bridge instance using the correct CDN API
    const createApp = AppBridge.default.createApp;
    if (!createApp) {
      console.error('[App Bridge] ❌ createApp function not found');
      console.error('[App Bridge] AppBridge.default keys:', Object.keys(AppBridge.default));
      return null;
    }

    console.log('[App Bridge] Creating App Bridge instance...');
    console.log('[App Bridge] Config:', { apiKey: apiKey.substring(0, 8) + '...', host });
    
    let app;
    try {
      app = createApp({
        apiKey: apiKey,
        host: host,
      });
      console.log('[App Bridge] ✅ App Bridge instance created successfully');
      console.log('[App Bridge] App instance:', app);
    } catch (createError) {
      console.error('[App Bridge] ❌ Error creating App Bridge instance:', createError);
      if (createError instanceof Error) {
        console.error('[App Bridge] Error message:', createError.message);
        console.error('[App Bridge] Error stack:', createError.stack);
      }
      return null;
    }

    // Get SessionToken action from App Bridge
    if (!AppBridge.actions || !AppBridge.actions.SessionToken) {
      console.error('[App Bridge] ❌ SessionToken action not found in App Bridge');
      console.error('[App Bridge] Available actions:', AppBridge.actions ? Object.keys(AppBridge.actions) : 'none');
      if (AppBridge.actions) {
        console.error('[App Bridge] Actions object:', AppBridge.actions);
      }
      return null;
    }

    const SessionToken = AppBridge.actions.SessionToken;
    if (!SessionToken.getSessionToken) {
      console.error('[App Bridge] ❌ getSessionToken function not found in SessionToken');
      console.error('[App Bridge] SessionToken object:', SessionToken);
      console.error('[App Bridge] SessionToken keys:', Object.keys(SessionToken));
      return null;
    }

    console.log('[App Bridge] Getting session token using SessionToken.getSessionToken...');
    console.log('[App Bridge] SessionToken:', SessionToken);
    const startTime = Date.now();
    
    // Get session token using the correct App Bridge 2.0 API
    let token: string;
    try {
      token = await SessionToken.getSessionToken(app);
    } catch (tokenError) {
      console.error('[App Bridge] ❌ Error calling getSessionToken:', tokenError);
      if (tokenError instanceof Error) {
        console.error('[App Bridge] Error message:', tokenError.message);
        console.error('[App Bridge] Error stack:', tokenError.stack);
      }
      throw tokenError;
    }
    
    const duration = Date.now() - startTime;
    
    if (!token || typeof token !== 'string' || token.length === 0) {
      console.error('[App Bridge] ❌ Invalid token received:', token);
      return null;
    }
    
    console.log('[App Bridge] ========================================');
    console.log('[App Bridge] ✅ Session token generated successfully!');
    console.log('[App Bridge] ========================================');
    console.log('[App Bridge] Generation method: window["app-bridge"].actions.SessionToken.getSessionToken');
    console.log('[App Bridge] Token generation duration:', duration + 'ms');
    console.log('[App Bridge] Token length:', token.length);
    console.log('[App Bridge] Token (full):', token);
    console.log('[App Bridge] Token preview (first 50 chars):', token.substring(0, 50) + '...');
    console.log('[App Bridge] Token preview (last 50 chars):', '...' + token.substring(token.length - 50));
    console.log('[App Bridge] Token timestamp:', new Date().toISOString());
    console.log('[App Bridge] ========================================');
    
    return token;
  } catch (error) {
    console.error('[App Bridge] ========================================');
    console.error('[App Bridge] ❌ Error getting session token');
    console.error('[App Bridge] ========================================');
    console.error('[App Bridge] Error:', error);
    if (error instanceof Error) {
      console.error('[App Bridge] Error message:', error.message);
      console.error('[App Bridge] Error stack:', error.stack);
    }
    console.error('[App Bridge] ========================================');
    return null;
  }
};

/**
 * Check if App Bridge is available
 * Also checks for the script tag to ensure it's loaded
 */
export const isAppBridgeAvailable = (): boolean => {
  // Check if script tag exists
  const scriptTag = document.querySelector('script[src*="app-bridge.js"]');
  const scriptLoaded = !!scriptTag;
  
  // Check if App Bridge global is available
  const appBridgeGlobal = !!window['app-bridge'];
  const appBridgeDefault = !!window['app-bridge']?.default;
  
  console.log('[App Bridge] Availability check:', {
    scriptTagExists: scriptLoaded,
    appBridgeGlobal: appBridgeGlobal,
    appBridgeDefault: appBridgeDefault,
    windowAppBridge: window['app-bridge'] ? Object.keys(window['app-bridge']) : 'not found',
  });
  
  return appBridgeDefault;
};
