import "@shopify/shopify-api/adapters/node";
import express from "express";
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
// In Vercel, environment variables are automatically available
// Only load .env file in local development
if (process.env.VERCEL !== "1" && !process.env.VERCEL_ENV) {
  try {
    dotenv.config({ path: join(__dirname, "../.env") });
  } catch (error) {
    console.warn("Could not load .env file:", error.message);
  }
}

const PORT = parseInt(process.env.PORT || "3000", 10);
const isDev = process.env.NODE_ENV !== "production";

// Initialize Shopify API
// Validate required environment variables
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const appUrl = process.env.SHOPIFY_APP_URL;

if (!apiKey || !apiSecret) {
  console.error("Missing required environment variables: SHOPIFY_API_KEY or SHOPIFY_API_SECRET");
}

// Extract hostname from app URL safely
let hostName = "localhost";
if (appUrl) {
  try {
    const url = new URL(appUrl);
    hostName = url.hostname;
  } catch (error) {
    // If URL parsing fails, try to extract hostname manually
    hostName = appUrl.replace(/^https?:\/\//, "").split("/")[0].split(":")[0];
  }
}

const shopify = shopifyApi({
  apiKey: apiKey || "",
  apiSecretKey: apiSecret || "",
  scopes: ["write_products", "read_products", "write_themes", "read_themes"],
  hostName: hostName,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  restResources,
});

const app = express();

// Middleware
app.use(express.json());

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
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// OAuth routes
app.get("/auth", async (req, res) => {
  try {
    const authRoute = await shopify.auth.begin({
      shop: req.query.shop,
      callbackPath: "/auth/callback",
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });
    res.redirect(authRoute);
  } catch (error) {
    console.error("OAuth error:", error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "Failed to initiate OAuth",
        message: error.message 
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
    
    // TODO: Store session in database (implement your session storage)
    // For production, use a proper database (Prisma, MongoDB, etc.)
    // For now, sessions are handled by Shopify API library
    
    // Get host from query or use shop domain
    const host = req.query.host;
    const shop = session.shop;
    const apiKey = process.env.SHOPIFY_API_KEY;
    
    // Redirect to app in Shopify admin
    const redirectUrl = host 
      ? `https://${shop}/admin/apps/${apiKey}?${host}`
      : `https://${shop}/admin/apps/${apiKey}`;
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth callback error:", error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "OAuth callback failed", 
        message: error.message 
      });
    }
  }
});

// API Routes
app.post("/api/tryon/generate", async (req, res) => {
  try {
    const { personImage, clothingImage } = req.body;

    if (!personImage || !clothingImage) {
      return res.status(400).json({ error: "Missing required images" });
    }

    // Convert base64 to Blob for FormData
    const personBlob = await fetch(personImage).then(r => r.blob());
    const clothingBlob = await fetch(clothingImage).then(r => r.blob());

    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('personImage', personBlob, 'person.jpg');
    formData.append('clothingImage', clothingBlob, 'clothing.jpg');

    // Forward to your existing API
    const response = await fetch("https://try-on-server-v1.onrender.com/api/fashion-photo", {
      method: "POST",
      headers: {
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Content-Language': 'fr',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Try-on generation error:", error);
    res.status(500).json({ 
      error: "Failed to generate try-on image",
      message: error.message 
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
        message: "Product data available from page context"
      });
    }
  } catch (error) {
    console.error("Product fetch error:", error);
    res.status(500).json({ error: "Failed to fetch product", message: error.message });
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
  console.error("Error:", err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: err.message || "Internal server error",
    });
  }
});

// Only start server if not in Vercel environment
if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (isDev) {
      console.log(`Development server: http://localhost:${PORT}`);
    }
  });
}

// Export app for Vercel serverless functions
export default app;

