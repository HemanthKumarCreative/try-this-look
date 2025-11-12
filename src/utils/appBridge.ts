/**
 * App Bridge Utilities
 * Helper functions for working with Shopify App Bridge
 */

/**
 * Get the shopify global variable
 * @returns The shopify global variable or null if not available
 */
export const getShopify = (): typeof window.shopify | null => {
  if (typeof window !== "undefined" && (window as any).shopify) {
    return (window as any).shopify;
  }
  return null;
};

/**
 * Check if App Bridge is ready
 * @returns true if App Bridge is available, false otherwise
 */
export const isAppBridgeReady = (): boolean => {
  return getShopify() !== null;
};

/**
 * Make an authenticated fetch request
 * App Bridge 3.x automatically adds session tokens to fetch requests
 * This is a wrapper that ensures the request goes through App Bridge
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns Promise<Response>
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // App Bridge 3.x automatically adds session tokens to all fetch requests
  // So we can use the standard fetch API
  // The session token will be in the Authorization header automatically
  
  // Ensure we're making a request to our backend
  // If the URL is relative, it will automatically include the session token
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Handle 401 Unauthorized - might need to refresh session token
  if (response.status === 401) {
    // Check if there's a retry header
    const retryHeader = response.headers.get("X-Shopify-Retry-Invalid-Session-Request");
    if (retryHeader === "1") {
      // App Bridge will automatically retry with a new session token
      // Just return the response
      return response;
    }
  }

  return response;
};

/**
 * Make an authenticated API request to the backend
 * @param endpoint - The API endpoint (relative path)
 * @param options - Fetch options
 * @returns Promise<Response>
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  // Use authenticated fetch
  return authenticatedFetch(path, options);
};

/**
 * Get session token from App Bridge
 * Note: In App Bridge 3.x, session tokens are automatically added to requests
 * This function is mainly for debugging or manual token retrieval
 * @returns Promise<string | null> - The session token or null if not available
 */
export const getSessionToken = async (): Promise<string | null> => {
  const shopify = getShopify();
  
  if (!shopify) {
    return null;
  }

  // In App Bridge 3.x, we can't directly get the session token
  // It's automatically added to requests
  // However, we can check if App Bridge is ready
  try {
    // Try to get user info to verify App Bridge is working
    const user = await shopify.user();
    if (user) {
      // App Bridge is working - session tokens will be added automatically
      return "auto"; // Indicates automatic session token handling
    }
  } catch (error) {
    console.warn("Failed to verify App Bridge:", error);
  }

  return null;
};

/**
 * Show a toast notification using App Bridge
 * @param message - The message to display
 * @param options - Toast options
 */
export const showToast = async (
  message: string,
  options?: { duration?: number; isError?: boolean }
): Promise<void> => {
  const shopify = getShopify();
  
  if (!shopify) {
    console.warn("App Bridge not available, cannot show toast");
    return;
  }

  try {
    await shopify.toast.show(message, {
      duration: options?.duration || 5000,
      isError: options?.isError || false,
    });
  } catch (error) {
    console.error("Failed to show toast:", error);
  }
};

/**
 * Navigate using App Bridge
 * @param path - The path to navigate to
 */
export const navigate = async (path: string): Promise<void> => {
  const shopify = getShopify();
  
  if (!shopify) {
    // Fallback to window.location if App Bridge is not available
    window.location.href = path;
    return;
  }

  try {
    await shopify.navigation.navigate(path);
  } catch (error) {
    console.error("Failed to navigate:", error);
    // Fallback to window.location
    window.location.href = path;
  }
};

