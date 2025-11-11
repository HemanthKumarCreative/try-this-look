/**
 * App Bridge utilities for session token authentication
 * Uses App Bridge loaded from Shopify CDN
 * 
 * Handles different App Bridge CDN API structures
 */

declare global {
  interface Window {
    'app-bridge'?: any;
    AppBridge?: any;
    shopify?: any;
  }
}

/**
 * Wait for App Bridge to be loaded
 */
const waitForAppBridge = (maxAttempts = 50, delay = 100): Promise<boolean> => {
  return new Promise((resolve) => {
    let attempts = 0;
    const checkBridge = () => {
      // Check for different possible App Bridge global structures
      if (
        window['app-bridge'] ||
        window.AppBridge ||
        window.shopify ||
        (window as any).Shopify?.AppBridge
      ) {
        resolve(true);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkBridge, delay);
      } else {
        resolve(false);
      }
    };
    checkBridge();
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

    // Try different App Bridge API structures
    let app: any = null;
    let getSessionTokenFn: ((app: any) => Promise<string>) | null = null;
    let methodUsed = '';

    // Method 1: window['app-bridge'] with actions.SessionToken
    if (window['app-bridge']) {
      try {
        console.log('[App Bridge] Attempting Method 1: window["app-bridge"]');
        const appBridge = window['app-bridge'];
        const createApp = appBridge.default?.createApp || appBridge.createApp;
        
        if (createApp) {
          app = createApp({
            apiKey: apiKey,
            host: host,
          });
          console.log('[App Bridge] App instance created via window["app-bridge"]');

          // Try to get getSessionToken from actions
          if (appBridge.actions?.SessionToken?.getSessionToken) {
            getSessionTokenFn = appBridge.actions.SessionToken.getSessionToken;
            methodUsed = 'window["app-bridge"].actions.SessionToken.getSessionToken';
            console.log('[App Bridge] Using actions.SessionToken.getSessionToken');
          } else if (appBridge.default?.utils?.getSessionToken) {
            getSessionTokenFn = appBridge.default.utils.getSessionToken;
            methodUsed = 'window["app-bridge"].default.utils.getSessionToken';
            console.log('[App Bridge] Using default.utils.getSessionToken');
          } else if (appBridge.utils?.getSessionToken) {
            getSessionTokenFn = appBridge.utils.getSessionToken;
            methodUsed = 'window["app-bridge"].utils.getSessionToken';
            console.log('[App Bridge] Using utils.getSessionToken');
          }
        }
      } catch (error) {
        console.warn('[App Bridge] Error with window["app-bridge"]:', error);
      }
    }

    // Method 2: window.AppBridge
    if (!app && window.AppBridge) {
      try {
        console.log('[App Bridge] Attempting Method 2: window.AppBridge');
        if (window.AppBridge.createApp) {
          app = window.AppBridge.createApp({
            apiKey: apiKey,
            host: host,
          });
          console.log('[App Bridge] App instance created via window.AppBridge');

          if (window.AppBridge.utils?.getSessionToken) {
            getSessionTokenFn = window.AppBridge.utils.getSessionToken;
            methodUsed = 'window.AppBridge.utils.getSessionToken';
            console.log('[App Bridge] Using AppBridge.utils.getSessionToken');
          } else if (window.AppBridge.getSessionToken) {
            getSessionTokenFn = window.AppBridge.getSessionToken;
            methodUsed = 'window.AppBridge.getSessionToken';
            console.log('[App Bridge] Using AppBridge.getSessionToken');
          }
        }
      } catch (error) {
        console.warn('[App Bridge] Error with window.AppBridge:', error);
      }
    }

    // Method 3: window.shopify (App Bridge 4.x)
    if (!app && window.shopify) {
      try {
        console.log('[App Bridge] Attempting Method 3: window.shopify (App Bridge 4.x)');
        if (window.shopify.getSessionToken) {
          console.log('[App Bridge] Getting session token directly from shopify global');
          const token = await window.shopify.getSessionToken();
          console.log('[App Bridge] Session token generated successfully via window.shopify');
          console.log('[App Bridge] Token length:', token.length);
          console.log('[App Bridge] Token preview:', token.substring(0, 20) + '...');
          return token;
        }
      } catch (error) {
        console.warn('[App Bridge] Error with window.shopify:', error);
      }
    }

    if (!app) {
      console.warn('[App Bridge] Could not initialize App Bridge - no compatible API found');
      return null;
    }

    if (!getSessionTokenFn) {
      console.warn('[App Bridge] getSessionToken function not found in App Bridge');
      return null;
    }

    // Get session token
    console.log('[App Bridge] Calling getSessionToken function using method:', methodUsed);
    const startTime = Date.now();
    const token = await getSessionTokenFn(app);
    const duration = Date.now() - startTime;
    
    console.log('[App Bridge] Session token generated successfully');
    console.log('[App Bridge] Generation method:', methodUsed);
    console.log('[App Bridge] Token generation duration:', duration + 'ms');
    console.log('[App Bridge] Token length:', token.length);
    console.log('[App Bridge] Token preview:', token.substring(0, 20) + '...');
    console.log('[App Bridge] Token timestamp:', new Date().toISOString());
    
    return token;
  } catch (error) {
    console.error('Error getting session token:', error);
    return null;
  }
};

/**
 * Check if App Bridge is available
 */
export const isAppBridgeAvailable = (): boolean => {
  return !!(
    window['app-bridge'] ||
    window.AppBridge ||
    window.shopify ||
    (window as any).Shopify?.AppBridge
  );
};
