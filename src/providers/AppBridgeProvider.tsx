import { ReactNode } from 'react';

interface AppBridgeProviderWrapperProps {
  children: ReactNode;
  apiKey?: string;
}

/**
 * App Bridge Provider Wrapper
 * 
 * Note: App Bridge 4.x uses a global `shopify` variable created by the script tag.
 * This wrapper is a no-op for App Bridge 4.x but provides compatibility.
 * 
 * The App Bridge script in index.html initializes App Bridge automatically.
 * The `useAppBridge` hook provides access to the global `shopify` variable.
 * 
 * This component exists for backward compatibility and future extensibility.
 */
export const AppBridgeProviderWrapper = ({ 
  children, 
  apiKey 
}: AppBridgeProviderWrapperProps) => {
  // App Bridge 4.x doesn't require a Provider component
  // The script tag in index.html initializes App Bridge globally
  // Just render children - App Bridge is available via global `shopify` variable
  return <>{children}</>;
};
