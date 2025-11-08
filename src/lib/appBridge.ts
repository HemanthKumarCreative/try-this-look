const HOST_STORAGE_KEY = "shopify_app_host";
const SHOP_STORAGE_KEY = "shopify_app_shop";

const coerceString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  return trimmedValue;
};

const resolveMetaApiKey = (): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const metaTag = document.querySelector<HTMLMetaElement>(
    'meta[name="shopify-api-key"]'
  );

  if (metaTag?.content) {
    return metaTag.content.trim() || null;
  }

  return null;
};

const persistSessionValue = (key: string, value: string | null) => {
  try {
    if (!value) {
      sessionStorage.removeItem(key);
      return;
    }

    sessionStorage.setItem(key, value);
  } catch {
    // Storage is unavailable (Safari private mode or similar)
  }
};

const restoreSessionValue = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const persistHost = (host: string | null) => {
  persistSessionValue(HOST_STORAGE_KEY, host);
};

const restoreHost = (): string | null => restoreSessionValue(HOST_STORAGE_KEY);

const extractHostFromHash = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!window.location.hash) {
    return null;
  }

  const hashQuery = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hashQuery);
  const host = params.get("host");

  if (host) {
    persistHost(host);
  }

  return host;
};

const resolveHostParam = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const host = params.get("host");

  if (host) {
    persistHost(host);
    return host;
  }

  const hashHost = extractHostFromHash();
  if (hashHost) {
    return hashHost;
  }

  return restoreHost();
};

const persistShop = (shop: string | null) => {
  persistSessionValue(SHOP_STORAGE_KEY, shop);
};

const restoreShop = (): string | null => restoreSessionValue(SHOP_STORAGE_KEY);

const extractShopFromHash = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!window.location.hash) {
    return null;
  }

  const hashQuery = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hashQuery);
  const shop = params.get("shop");

  if (shop) {
    persistShop(shop);
  }

  return shop;
};

const resolveShopParam = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");

  if (shop) {
    persistShop(shop);
    return shop;
  }

  const hashShop = extractShopFromHash();
  if (hashShop) {
    return hashShop;
  }

  return restoreShop();
};

const decodeBase64 = (value: string): string | null => {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded =
      normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    return typeof window === "undefined" ? null : window.atob(padded);
  } catch {
    return null;
  }
};

const deriveShopFromHost = (host: string | null): string | null => {
  if (!host) {
    return null;
  }

  const decodedHost = decodeBase64(host);
  if (!decodedHost) {
    return null;
  }

  const trimmedHost = decodedHost.trim();

  if (!trimmedHost) {
    return null;
  }

  const storeSegment = trimmedHost
    .split("/store/")
    .pop()
    ?.split(/[/?#]/)[0]
    ?.trim();

  if (storeSegment) {
    return `${storeSegment}.myshopify.com`;
  }

  const myShopifyMatch = trimmedHost.match(
    /([a-z0-9-]+\.myshopify\.com)/i
  );

  if (myShopifyMatch?.[1]) {
    return myShopifyMatch[1].toLowerCase();
  }

  return null;
};

const resolveApiKey = (): string | null => {
  const envKey = coerceString(import.meta?.env?.VITE_SHOPIFY_API_KEY);

  if (envKey) {
    return envKey;
  }

  return resolveMetaApiKey();
};

let cachedAppBridge: any | null = null;
let cachedHost: string | null = null;
let cachedShop: string | null = null;

export const initializeAppBridge = (): any | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const appBridgeGlobal = (window as unknown as Record<string, any>)["app-bridge"];
  if (!appBridgeGlobal?.createApp) {
    return null;
  }

  const apiKey = resolveApiKey();
  const host = resolveHostParam();
  let shop = resolveShopParam();

  if (!shop) {
    const derivedShop = deriveShopFromHost(host);
    if (derivedShop) {
      persistShop(derivedShop);
      shop = derivedShop;
    } else if (import.meta?.env?.MODE === "development") {
      console.warn("[AppBridge] Unable to derive shop from host.", {
        host,
      });
    }
  }

  if (!apiKey || !host) {
    if (import.meta?.env?.MODE === "development") {
      console.warn(
        "[AppBridge] Missing apiKey or host. Ensure the app is loaded from Shopify admin and VITE_SHOPIFY_API_KEY is configured."
      );
    }
    return null;
  }

  if (!shop && import.meta?.env?.MODE === "development") {
    console.warn(
      "[AppBridge] Missing shop parameter. Attempting initialization without shop. Verify the app is launched from Shopify admin."
    );
  }

  const normalizedShop = shop ?? null;

  if (
    cachedAppBridge &&
    cachedHost === host &&
    cachedShop === normalizedShop
  ) {
    return cachedAppBridge;
  }

  const config: Record<string, string> = {
    apiKey,
    host,
  };

  if (normalizedShop) {
    config.shop = normalizedShop;
  }

  const app = appBridgeGlobal.createApp(config);

  cachedAppBridge = app;
  cachedHost = host;
  cachedShop = normalizedShop;

  return app;
};

export const fetchSessionToken = async (): Promise<string> => {
  if (typeof window === "undefined") {
    throw new Error("Session tokens are unavailable outside the browser.");
  }

  const appBridge = initializeAppBridge();
  if (!appBridge) {
    throw new Error("App Bridge is not available in the current context.");
  }

  const utilities = (window as unknown as Record<string, any>)["app-bridge"]
    ?.utilities;
  if (!utilities?.getSessionToken) {
    throw new Error("App Bridge utilities are unavailable.");
  }

  return utilities.getSessionToken(appBridge);
};

export const authenticatedFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {}
) => {
  const sessionToken = await fetchSessionToken();
  const headers = new Headers(init.headers || {});

  headers.set("Authorization", `Bearer ${sessionToken}`);
  headers.set("Accept", headers.get("Accept") || "application/json");

  return fetch(input, {
    ...init,
    headers,
  });
};

export const isEmbeddedApp = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const apiKey = resolveApiKey();
  const host = resolveHostParam();
  const shop = resolveShopParam() ?? deriveShopFromHost(host);

  if (shop) {
    persistShop(shop);
  }

  const inIframe = window.parent !== window;
  if (!inIframe) {
    return false;
  }

  return Boolean(apiKey && host);
};

