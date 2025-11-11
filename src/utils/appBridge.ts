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
    // Wait for App Bridge to load
    const bridgeLoaded = await waitForAppBridge();
    if (!bridgeLoaded) {
      console.warn('App Bridge not loaded after waiting');
      return null;
    }

    // Get API key from meta tag
    const apiKeyMeta = document.querySelector('meta[name="shopify-api-key"]');
    if (!apiKeyMeta) {
      console.warn('Shopify API key meta tag not found');
      return null;
    }

    const apiKey = apiKeyMeta.getAttribute('content');
    if (!apiKey) {
      console.warn('Shopify API key not found in meta tag');
      return null;
    }

    // Get host parameter from URL (required for embedded apps)
    const urlParams = new URLSearchParams(window.location.search);
    const host = urlParams.get('host');

    if (!host) {
      console.warn('Host parameter not found in URL');
      return null;
    }

    // Try different App Bridge API structures
    let app: any = null;
    let getSessionTokenFn: ((app: any) => Promise<string>) | null = null;

    // Method 1: window['app-bridge'] with actions.SessionToken
    if (window['app-bridge']) {
      try {
        const appBridge = window['app-bridge'];
        const createApp = appBridge.default?.createApp || appBridge.createApp;
        
        if (createApp) {
          app = createApp({
            apiKey: apiKey,
            host: host,
          });

          // Try to get getSessionToken from actions
          if (appBridge.actions?.SessionToken?.getSessionToken) {
            getSessionTokenFn = appBridge.actions.SessionToken.getSessionToken;
          } else if (appBridge.default?.utils?.getSessionToken) {
            getSessionTokenFn = appBridge.default.utils.getSessionToken;
          } else if (appBridge.utils?.getSessionToken) {
            getSessionTokenFn = appBridge.utils.getSessionToken;
          }
        }
      } catch (error) {
        console.warn('Error with window["app-bridge"]:', error);
      }
    }

    // Method 2: window.AppBridge
    if (!app && window.AppBridge) {
      try {
        if (window.AppBridge.createApp) {
          app = window.AppBridge.createApp({
            apiKey: apiKey,
            host: host,
          });

          if (window.AppBridge.utils?.getSessionToken) {
            getSessionTokenFn = window.AppBridge.utils.getSessionToken;
          } else if (window.AppBridge.getSessionToken) {
            getSessionTokenFn = window.AppBridge.getSessionToken;
          }
        }
      } catch (error) {
        console.warn('Error with window.AppBridge:', error);
      }
    }

    // Method 3: window.shopify (App Bridge 4.x)
    if (!app && window.shopify) {
      try {
        if (window.shopify.getSessionToken) {
          const token = await window.shopify.getSessionToken();
          return token;
        }
      } catch (error) {
        console.warn('Error with window.shopify:', error);
      }
    }

    if (!app) {
      console.warn('Could not initialize App Bridge - no compatible API found');
      return null;
    }

    if (!getSessionTokenFn) {
      console.warn('getSessionToken function not found in App Bridge');
      return null;
    }

    // Get session token
    const token = await getSessionTokenFn(app);
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
