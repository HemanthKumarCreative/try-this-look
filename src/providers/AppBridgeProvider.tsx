import { createContext, useContext, useEffect, useState, ReactNode } from "react";

/**
 * App Bridge Context
 * Provides access to the Shopify App Bridge global variable
 * App Bridge 3.x automatically initializes when the script tag is loaded
 */
interface AppBridgeContextType {
  isReady: boolean;
  shopify: typeof window.shopify | null;
}

const AppBridgeContext = createContext<AppBridgeContextType>({
  isReady: false,
  shopify: null,
});

interface AppBridgeProviderProps {
  children: ReactNode;
}

/**
 * App Bridge Provider Component
 * Wraps the app and provides App Bridge context
 * Waits for App Bridge to be ready before rendering children
 */
export const AppBridgeProvider = ({ children }: AppBridgeProviderProps) => {
  const [isReady, setIsReady] = useState(false);
  const [shopify, setShopify] = useState<typeof window.shopify | null>(null);

  useEffect(() => {
    console.log("🔍 App Bridge Provider: Starting initialization check...");
    
    // Check if App Bridge is already loaded
    const checkAppBridge = () => {
      if (typeof window === "undefined") {
        console.warn("⚠️ App Bridge Provider: window is undefined");
        return false;
      }

      const shopifyGlobal = (window as any).shopify;
      
      if (shopifyGlobal) {
        console.log("✅ App Bridge initialized successfully!");
        console.log("📦 App Bridge Object:", shopifyGlobal);
        console.log("🔑 Available App Bridge APIs:", {
          user: typeof shopifyGlobal.user === "function",
          toast: typeof shopifyGlobal.toast === "object",
          navigation: typeof shopifyGlobal.navigation === "object",
          modal: typeof shopifyGlobal.modal === "object",
          features: typeof shopifyGlobal.features === "object",
        });
        
        setShopify(shopifyGlobal);
        setIsReady(true);
        return true;
      }
      
      return false;
    };

    // Check immediately
    console.log("🔍 App Bridge Provider: Checking for App Bridge immediately...");
    if (checkAppBridge()) {
      console.log("✅ App Bridge was already loaded!");
      return;
    }

    console.log("⏳ App Bridge Provider: App Bridge not found, waiting for script to load...");
    let checkCount = 0;
    const maxChecks = 50; // 50 checks * 100ms = 5 seconds

    // Wait for App Bridge script to load
    const checkInterval = setInterval(() => {
      checkCount++;
      if (checkAppBridge()) {
        console.log(`✅ App Bridge initialized after ${checkCount * 100}ms`);
        clearInterval(checkInterval);
      } else if (checkCount % 10 === 0) {
        // Log every second
        console.log(`⏳ App Bridge Provider: Still waiting... (${checkCount * 100}ms elapsed)`);
      }
    }, 100);

    // Timeout after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      const shopifyGlobal = (window as any).shopify;
      
      if (shopifyGlobal) {
        console.log("✅ App Bridge initialized (within timeout period)");
        console.log("📦 App Bridge Object:", shopifyGlobal);
        setShopify(shopifyGlobal);
        setIsReady(true);
      } else {
        console.error("❌ App Bridge FAILED to initialize within 5 seconds");
        console.error("🔍 Debug Info:", {
          windowExists: typeof window !== "undefined",
          shopifyExists: typeof (window as any).shopify !== "undefined",
          scriptTagExists: document.querySelector('script[src*="app-bridge.js"]') !== null,
          apiKeyMetaExists: document.querySelector('meta[name="shopify-api-key"]') !== null,
        });
        // Still set ready to true to allow app to render
        setIsReady(true);
      }
    }, 5000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []); // Empty dependency array - only run once on mount

  // Log context value changes
  useEffect(() => {
    if (isReady) {
      console.log("🎯 App Bridge Context: Provider is ready", {
        isReady,
        shopifyExists: shopify !== null,
        shopifyType: shopify ? typeof shopify : "null",
      });
    }
  }, [isReady, shopify]);

  return (
    <AppBridgeContext.Provider value={{ isReady, shopify }}>
      {children}
    </AppBridgeContext.Provider>
  );
};

/**
 * Hook to access App Bridge context
 * @returns App Bridge context with isReady flag and shopify global
 */
export const useAppBridge = () => {
  const context = useContext(AppBridgeContext);
  if (!context) {
    throw new Error("useAppBridge must be used within AppBridgeProvider");
  }
  return context;
};

/**
 * Hook to get the shopify global variable directly
 * @returns The shopify global variable or null if not ready
 */
export const useShopify = () => {
  const { shopify, isReady } = useAppBridge();
  return { shopify, isReady };
};

