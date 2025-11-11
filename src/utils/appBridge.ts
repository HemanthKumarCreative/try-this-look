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
 * Wait for App Bridge to be loaded
 * Uses event listener on script load for immediate detection
 */
const waitForAppBridge = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if App Bridge is already loaded
    if (window['app-bridge']?.default) {
      console.log('[App Bridge] App Bridge already loaded');
      resolve(true);
      return;
    }

    // Find the App Bridge script tag
    const scriptTag = document.querySelector('script[src*="app-bridge.js"]') as HTMLScriptElement;
    
    if (!scriptTag) {
      console.warn('[App Bridge] App Bridge script tag not found');
      resolve(false);
      return;
    }

    // Helper function to check and resolve
    const checkAndResolve = () => {
      setTimeout(() => {
        if (window['app-bridge']?.default) {
          console.log('[App Bridge] App Bridge loaded successfully');
          resolve(true);
        } else {
          console.warn('[App Bridge] Script loaded but App Bridge not available');
          resolve(false);
        }
      }, 100);
    };

    // Check if script is already loaded
    // Use type assertion to access properties that may exist at runtime
    const scriptElement = scriptTag as HTMLScriptElement & { complete?: boolean; readyState?: string };
    const isComplete = scriptElement.complete || (scriptElement.readyState && scriptElement.readyState === 'complete');
    
    if (isComplete) {
      console.log('[App Bridge] Script already complete, checking for App Bridge...');
      checkAndResolve();
      return;
    }

    // Wait for script to load
    console.log('[App Bridge] Waiting for App Bridge script to load...');
    
    const loadHandler = () => {
      scriptTag.removeEventListener('load', loadHandler);
      scriptTag.removeEventListener('error', errorHandler);
      checkAndResolve();
    };

    const errorHandler = () => {
      scriptTag.removeEventListener('load', loadHandler);
      scriptTag.removeEventListener('error', errorHandler);
      console.error('[App Bridge] Failed to load App Bridge script');
      resolve(false);
    };

    scriptTag.addEventListener('load', loadHandler);
    scriptTag.addEventListener('error', errorHandler);
  });
};

/**
 * Initialize App Bridge and get session token
 * @returns Promise that resolves to the session token
 */
export const getSessionToken = async (): Promise<string | null> => {
  try {
    console.log('[App Bridge] Starting session token generation...');
    
    // Wait for App Bridge to load
    const bridgeLoaded = await waitForAppBridge();
    if (!bridgeLoaded) {
      console.warn('[App Bridge] App Bridge not loaded after waiting');
      return null;
    }
    console.log('[App Bridge] App Bridge loaded successfully');

    // Get API key from meta tag
    const apiKeyMeta = document.querySelector('meta[name="shopify-api-key"]');
    if (!apiKeyMeta) {
      console.warn('[App Bridge] Shopify API key meta tag not found');
      return null;
    }

    const apiKey = apiKeyMeta.getAttribute('content');
    if (!apiKey) {
      console.warn('[App Bridge] Shopify API key not found in meta tag');
      return null;
    }
    console.log('[App Bridge] API key retrieved:', apiKey.substring(0, 8) + '...');

    // Get host parameter from URL (required for embedded apps)
    const urlParams = new URLSearchParams(window.location.search);
    const host = urlParams.get('host');

    if (!host) {
      console.warn('[App Bridge] Host parameter not found in URL');
      return null;
    }
    console.log('[App Bridge] Host parameter retrieved:', host);

    // Access App Bridge from CDN
    const AppBridge = window['app-bridge'];
    if (!AppBridge || !AppBridge.default) {
      console.warn('[App Bridge] App Bridge default export not found');
      return null;
    }

    // Create App Bridge instance using the correct CDN API
    const createApp = AppBridge.default.createApp;
    if (!createApp) {
      console.warn('[App Bridge] createApp function not found');
      return null;
    }

    console.log('[App Bridge] Creating App Bridge instance...');
    const app = createApp({
      apiKey: apiKey,
      host: host,
    });
    console.log('[App Bridge] App Bridge instance created successfully');

    // Get SessionToken action from App Bridge
    if (!AppBridge.actions || !AppBridge.actions.SessionToken) {
      console.warn('[App Bridge] SessionToken action not found in App Bridge');
      console.warn('[App Bridge] Available actions:', AppBridge.actions ? Object.keys(AppBridge.actions) : 'none');
      return null;
    }

    const SessionToken = AppBridge.actions.SessionToken;
    if (!SessionToken.getSessionToken) {
      console.warn('[App Bridge] getSessionToken function not found in SessionToken');
      return null;
    }

    console.log('[App Bridge] Getting session token using SessionToken.getSessionToken...');
    const startTime = Date.now();
    
    // Get session token using the correct App Bridge 2.0 API
    const token = await SessionToken.getSessionToken(app);
    
    const duration = Date.now() - startTime;
    
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
    console.error('[App Bridge] Error getting session token:', error);
    if (error instanceof Error) {
      console.error('[App Bridge] Error message:', error.message);
      console.error('[App Bridge] Error stack:', error.stack);
    }
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
