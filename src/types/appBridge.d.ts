/**
 * Type definitions for Shopify App Bridge 3.x
 * App Bridge 3.x provides a global `shopify` variable after initialization
 */

declare global {
  interface Window {
    shopify?: {
      /**
       * Show a toast notification
       */
      toast: {
        show: (message: string, options?: { duration?: number; isError?: boolean }) => Promise<void>;
      };
      
      /**
       * Navigation API
       */
      navigation: {
        navigate: (path: string) => Promise<void>;
      };
      
      /**
       * Get current user information
       */
      user: () => Promise<{
        id: string;
        email: string;
        name: string;
      } | null>;
      
      /**
       * Resource Picker API
       */
      resourcePicker: (options: {
        type: 'product' | 'collection' | 'customer' | 'order';
        action?: 'select' | 'select-multiple';
        limit?: number;
      }) => Promise<any>;
      
      /**
       * Get app configuration
       */
      config: () => Promise<{
        apiKey: string;
        shop: string;
        host: string;
      }>;
    };
  }
}

export {};

