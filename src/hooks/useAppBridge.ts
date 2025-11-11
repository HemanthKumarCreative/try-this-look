import { useAppBridge } from '@shopify/app-bridge-react';

/**
 * Custom hook for Shopify App Bridge
 * 
 * App Bridge 4.x provides access via the global `shopify` variable.
 * The `useAppBridge` hook returns this global variable, which provides:
 * - Toast notifications: `shopify.toast.show()`
 * - Resource picker: `shopify.resourcePicker()`
 * - Navigation: `shopify.navigation.visit()`
 * - And other App Bridge APIs
 * 
 * For authenticated API calls, use the `shopify:admin` protocol:
 * ```ts
 * const response = await fetch('shopify:admin/api/2024-01/graphql.json', {
 *   method: 'POST',
 *   body: JSON.stringify({ query: '...' })
 * });
 * ```
 * 
 * @returns The `shopify` global variable or null if not available
 * 
 * @example
 * ```tsx
 * const shopify = useShopifyAppBridge();
 * 
 * const showToast = () => {
 *   if (shopify) {
 *     shopify.toast.show('Hello from App Bridge!');
 *   }
 * };
 * 
 * // For authenticated API calls
 * const fetchProducts = async () => {
 *   const response = await fetch('shopify:admin/api/2024-01/graphql.json', {
 *     method: 'POST',
 *     body: JSON.stringify({
 *       query: '{ products(first: 10) { edges { node { id title } } } }'
 *     })
 *   });
 *   const data = await response.json();
 *   return data;
 * };
 * ```
 */
export const useShopifyAppBridge = () => {
  let shopify = null;
  let isEmbedded = false;
  
  try {
    // useAppBridge returns the global `shopify` variable
    // It throws an error if App Bridge is not initialized
    shopify = useAppBridge();
    isEmbedded = shopify !== null;
  } catch (error) {
    // Not in App Bridge context (e.g., storefront widget, development)
    // This is expected and handled gracefully
    shopify = null;
    isEmbedded = false;
  }

  // Also check if we're in an embedded context by checking for host parameter
  if (!isEmbedded && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const hostParam = urlParams.get('host');
    isEmbedded = !!hostParam;
  }

  return {
    shopify,
    isEmbedded,
  };
};
