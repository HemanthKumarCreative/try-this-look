import "@shopify/shopify-api/adapters/node";
import express from "express";
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
// In Vercel, environment variables are automatically available
// Only load .env file in local development
if (process.env.VERCEL !== "1" && !process.env.VERCEL_ENV) {
  try {
    dotenv.config({ path: join(__dirname, "../.env") });
  } catch (error) {
    // Could not load .env file
  }
}

const portInput = process.env.VITE_PORT || process.env.PORT || "3000";
const PORT = Number.parseInt(portInput, 10);
const isDev =
  (process.env.VITE_NODE_ENV || process.env.NODE_ENV) !== "production";

// Initialize Shopify API
// Validate required environment variables
const apiKey = process.env.VITE_SHOPIFY_API_KEY;
const apiSecret = process.env.VITE_SHOPIFY_API_SECRET;
const appUrl = process.env.VITE_SHOPIFY_APP_URL;

if (!apiKey || !apiSecret) {
  // Missing required environment variables
}

// Extract hostname from app URL safely
let hostName = "localhost";
if (appUrl) {
  try {
    const url = new URL(appUrl);
    hostName = url.hostname;
  } catch (error) {
    // If URL parsing fails, try to extract hostname manually
    hostName = appUrl
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .split(":")[0];
  }
}

const shopify = shopifyApi({
  apiKey: apiKey || "",
  apiSecretKey: apiSecret || "",
  scopes: (process.env.VITE_SCOPES || "")
    .split(",")
    .map((scope) => scope.trim())
    .filter(Boolean),
  hostName: hostName,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  restResources,
});

const app = express();

// Middleware
// For webhooks, we need raw body for HMAC verification
app.use((req, res, next) => {
  if (req.path.startsWith("/webhooks/")) {
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

// HMAC signature verification middleware for webhooks
// This middleware MUST return HTTP 401 for invalid signatures to comply with Shopify requirements
const verifyWebhookSignature = (req, res, next) => {
  try {
    const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
    const topicHeader = req.get("X-Shopify-Topic");
    const shopHeader = req.get("X-Shopify-Shop-Domain");

    // Missing required headers - return 401
    if (!hmacHeader || !topicHeader || !shopHeader) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Missing required webhook headers",
      });
    }

    // Missing API secret - return 500 (server error, not auth error)
    if (!apiSecret) {
      return res.status(500).json({
        error: "Server configuration error",
        message: "API secret not configured",
      });
    }

    // Ensure body is a Buffer for HMAC calculation
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(req.body || "");

    // Calculate HMAC from raw body
    // Shopify sends HMAC as base64-encoded string in X-Shopify-Hmac-Sha256 header
    const calculatedHmacDigest = crypto
      .createHmac("sha256", apiSecret)
      .update(rawBody)
      .digest("base64");

    // Compare base64 strings using timing-safe comparison
    // Convert both base64 strings to buffers for constant-time comparison
    const providedHmacBuffer = Buffer.from(hmacHeader, "utf8");
    const calculatedHmacBuffer = Buffer.from(calculatedHmacDigest, "utf8");

    // Length mismatch - return 401
    if (providedHmacBuffer.length !== calculatedHmacBuffer.length) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid webhook signature",
      });
    }

    // Use crypto.timingSafeEqual for constant-time comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(providedHmacBuffer, calculatedHmacBuffer)) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid webhook signature",
      });
    }

    // HMAC is valid - parse body and attach metadata
    try {
      req.webhookData = JSON.parse(rawBody.toString());
      req.webhookTopic = topicHeader;
      req.webhookShop = shopHeader;
    } catch (error) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid JSON in webhook body",
      });
    }

    next();
  } catch (error) {
    // Any unexpected error during validation - return 401 for security
    console.error("Error in webhook signature verification:", error);
    return res.status(401).json({
      error: "Unauthorized",
      message: "Webhook signature verification failed",
    });
  }
};

// Serve static files only in non-Vercel environment
// In Vercel, static files are served directly by the platform
// Check for Vercel environment
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV;
if (!isVercel) {
  app.use(express.static(join(__dirname, "../dist")));
}

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use((req, res, next) => {
  // Remove X-Frame-Options for embedded apps
  res.removeHeader("X-Frame-Options");
  
  // Updated CSP for App Bridge - allows embedding in Shopify Admin and App Bridge scripts
  res.setHeader(
    "Content-Security-Policy",
    [
      "frame-ancestors https://admin.shopify.com https://*.myshopify.com https://*.shopify.com;",
      "script-src 'self' https://cdn.shopify.com https://*.shopify.com 'unsafe-inline' 'unsafe-eval';",
      "connect-src 'self' https://*.shopify.com https://*.myshopify.com https://admin.shopify.com;",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
      "font-src 'self' https://fonts.gstatic.com;",
    ].join(" ")
  );
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// OAuth routes
app.get("/auth", async (req, res) => {
  try {
    const shop = req.query.shop;

    // Validate shop parameter
    if (!shop) {
      return res.status(400).json({
        error: "Missing shop parameter",
        message: "Please provide a shop parameter in the query string",
      });
    }

    // Validate shop format (should be a .myshopify.com domain or just the shop name)
    const shopDomain = shop.includes(".myshopify.com")
      ? shop
      : `${shop}.myshopify.com`;

    const authRoute = await shopify.auth.begin({
      shop: shopDomain,
      callbackPath: "/auth/callback",
      isOnline: true, // Changed to online sessions for user-specific authentication
      rawRequest: req,
      rawResponse: res,
    });

    res.redirect(authRoute);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to initiate OAuth",
        message: error.message || "An error occurred during authentication",
      });
    }
  }
});

app.get("/auth/callback", async (req, res) => {
  try {
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callbackResponse;

    if (!session) {
      return res.status(500).json({
        error: "Authentication failed",
        message: "No session was created during authentication",
      });
    }

    // Sessions are automatically stored by the Shopify API library
    // The library handles session storage internally based on your configuration

    // Get host and shop from query/session
    const host = req.query.host;
    const shop = session.shop;
    const apiKey = process.env.VITE_SHOPIFY_API_KEY;

    if (!shop || !apiKey) {
      return res.status(500).json({
        error: "Invalid session data",
        message: "Missing shop or API key information",
      });
    }

    // For embedded apps, redirect to app with host parameter
    // Validate host parameter for security (should be base64 encoded string)
    if (host) {
      // Embedded app redirect - host parameter is required for embedded apps
      const redirectUrl = `https://${shop}/admin/apps/${apiKey}?host=${encodeURIComponent(host)}`;
      res.redirect(redirectUrl);
    } else {
      // Fallback for non-embedded (shouldn't happen with embedded = true, but handle gracefully)
      const redirectUrl = `https://${shop}/admin/apps/${apiKey}`;
      res.redirect(redirectUrl);
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        error: "OAuth callback failed",
        message: error.message || "An error occurred during the OAuth callback",
      });
    }
  }
});

// Webhook Routes - Mandatory Compliance Webhooks
// All webhooks must be registered in shopify.app.toml and verified with HMAC

// App uninstalled webhook - mandatory for app lifecycle
app.post(
  "/webhooks/app/uninstalled",
  verifyWebhookSignature,
  async (req, res) => {
    try {
      const { shop_domain } = req.webhookData;

      // Handle app uninstallation
      // Clean up any app-specific data, sessions, or resources
      // This is a mandatory webhook for compliance

      // Implement cleanup logic (delete sessions, remove app data, etc.)
      // This webhook is called when the app is uninstalled from a shop

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error handling app/uninstalled webhook:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

// Customer data request webhook - mandatory for GDPR compliance
app.post(
  "/webhooks/customers/data_request",
  verifyWebhookSignature,
  async (req, res) => {
    try {
      const { shop_id, shop_domain, customer, orders_requested } =
        req.webhookData;

      // Handle GDPR data request
      // Must provide customer data within 30 days
      // This is a mandatory webhook for GDPR compliance

      // Collect and prepare customer data
      // Data should include all information stored about the customer
      // Must provide customer data within 30 days of this webhook

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error handling customers/data_request webhook:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

// Customer redact webhook - mandatory for GDPR compliance
app.post(
  "/webhooks/customers/redact",
  verifyWebhookSignature,
  async (req, res) => {
    try {
      const { shop_id, shop_domain, customer, orders_to_redact } =
        req.webhookData;

      // Handle GDPR customer data deletion
      // Must delete all customer data within 10 days
      // This is a mandatory webhook for GDPR compliance

      // Delete all customer-related data
      // This includes any stored customer information, images, preferences, etc.
      // Must delete all customer data within 10 days of this webhook

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error handling customers/redact webhook:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

// Shop redact webhook - mandatory for GDPR compliance
app.post("/webhooks/shop/redact", verifyWebhookSignature, async (req, res) => {
  try {
    const { shop_id, shop_domain } = req.webhookData;

    // Handle GDPR shop data deletion
    // Must delete all shop data within 10 days
    // This is a mandatory webhook for GDPR compliance

    // Delete all shop-related data
    // This includes any stored shop information, configurations, etc.
    // Must delete all shop data within 10 days of this webhook

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error handling shop/redact webhook:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// API Routes
app.post("/api/tryon/generate", async (req, res) => {
  try {
    const { personImage, clothingImage, storeName } = req.body;

    if (!personImage || !clothingImage) {
      return res.status(400).json({ error: "Missing required images" });
    }

    // Convert base64 to Blob for FormData
    const personBlob = await fetch(personImage).then((r) => r.blob());
    const clothingBlob = await fetch(clothingImage).then((r) => r.blob());

    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append("personImage", personBlob, "person.jpg");
    formData.append("clothingImage", clothingBlob, "clothing.jpg");

    // Add storeName if provided
    if (storeName) {
      formData.append("storeName", storeName);
    }

    // Forward to your existing API
    const response = await fetch(
      "https://try-on-server-v1.onrender.com/api/fashion-photo",
      {
        method: "POST",
        headers: {
          "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
          "Content-Language": "fr",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate try-on image",
      message: error.message,
    });
  }
});

// Session token validation endpoint for App Bridge authentication
// This endpoint validates session tokens and logs session information
app.post("/api/validate-session", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Missing or invalid authorization header",
      });
    }

    const sessionToken = authHeader.replace("Bearer ", "");

    if (!sessionToken) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Session token is required",
      });
    }

    if (!apiSecret) {
      return res.status(500).json({
        error: "Server configuration error",
        message: "API secret not configured",
      });
    }

    // Validate and decode the session token using Shopify API library
    let decodedToken;
    try {
      decodedToken = await shopify.session.decodeSessionToken(sessionToken);
    } catch (error) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid session token",
        details: error.message,
      });
    }

    // Log session information for review checks
    const sessionInfo = {
      shop: decodedToken.dest || decodedToken.iss || "unknown",
      sub: decodedToken.sub || "unknown",
      exp: decodedToken.exp || null,
      iat: decodedToken.iat || null,
      sid: decodedToken.sid || "unknown",
      timestamp: new Date().toISOString(),
    };

    console.log("Session token validated successfully:", sessionInfo);

    // Return success response with session information
    res.status(200).json({
      success: true,
      message: "Session token validated successfully",
      session: sessionInfo,
    });
  } catch (error) {
    console.error("Error validating session token:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message || "Failed to validate session token",
    });
  }
});

// Product data endpoint (public - for widget use)
app.get("/api/products/:productId", async (req, res) => {
  try {
    // This endpoint can be public for widget use
    // For authenticated requests, use session from res.locals.shopify.session
    const session = res.locals.shopify?.session;

    if (session) {
      // Authenticated request - use Shopify API
      const client = new shopify.clients.Rest({ session });
      const product = await client.get({
        path: `products/${req.params.productId}`,
      });
      res.json(product.body);
    } else {
      // Public request - return basic product info from query
      // Widget will get product data from page context
      res.json({
        id: req.params.productId,
        message: "Product data available from page context",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch product", message: error.message });
  }
});

// Widget route - serves the widget page
app.get("/widget", (req, res) => {
  // In Vercel, static files are handled by the platform
  // This route is mainly for API proxy scenarios
  if (isVercel) {
    // In Vercel, redirect to the static file
    res.redirect("/index.html");
  } else {
    res.sendFile(join(__dirname, "../dist/index.html"));
  }
});

// App proxy route for Shopify app proxy
// Shopify app proxy format: /apps/{prefix}/{subpath}/{path}
// With prefix="apps" and subpath="a", the URL becomes: /apps/apps/a/{path}
app.get("/apps/apps/a/*", (req, res) => {
  // Handle app proxy requests
  // Extract path after /apps/apps/a/
  const proxyPath = req.path.replace("/apps/apps/a", "");

  if (proxyPath === "/widget" || proxyPath.startsWith("/widget")) {
    if (isVercel) {
      res.redirect("/index.html");
    } else {
      res.sendFile(join(__dirname, "../dist/index.html"));
    }
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

// Serve frontend (only in non-Vercel environment)
// In Vercel, static files and SPA routing are handled by vercel.json
if (!isVercel) {
  app.get("*", (req, res) => {
    res.sendFile(join(__dirname, "../dist/index.html"));
  });
}

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: err.message || "Internal server error",
    });
  }
});

// Only start server if not in Vercel environment
if (!isVercel) {
  app.listen(PORT, () => {
    // Server running
  });
}

// Export app for Vercel serverless functions
export default app;
