const HOST_STORAGE_KEY = "shopify_app_host";

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

const persistHost = (host: string | null) => {
  try {
    if (!host) {
      sessionStorage.removeItem(HOST_STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(HOST_STORAGE_KEY, host);
  } catch {
    // Storage is unavailable (Safari private mode or similar)
  }
};

const restoreHost = (): string | null => {
  try {
    return sessionStorage.getItem(HOST_STORAGE_KEY);
  } catch {
    return null;
  }
};

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

const resolveApiKey = (): string | null => {
  const envKey = coerceString(import.meta?.env?.VITE_SHOPIFY_API_KEY);

  if (envKey) {
    return envKey;
  }

  return resolveMetaApiKey();
};

let cachedAppBridge: any | null = null;
let cachedHost: string | null = null;

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

  if (!apiKey || !host) {
    if (import.meta?.env?.MODE === "development") {
      console.warn(
        "[AppBridge] Missing apiKey or host. Ensure the app is loaded from Shopify admin and VITE_SHOPIFY_API_KEY is configured."
      );
    }
    return null;
  }

  if (cachedAppBridge && cachedHost === host) {
    return cachedAppBridge;
  }

  const app = appBridgeGlobal.createApp({
    apiKey,
    host,
  });

  cachedAppBridge = app;
  cachedHost = host;

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

  const inIframe = window.parent !== window;
  if (!inIframe) {
    return false;
  }

  const apiKey = resolveApiKey();
  const host = resolveHostParam();

  return Boolean(apiKey && host);
};

