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
dotenv.config({ path: join(__dirname, "../.env") });

const PORT = parseInt(process.env.PORT || "3000", 10);
const isDev = process.env.NODE_ENV !== "production";

// Initialize Shopify API
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || "",
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  scopes: ["write_products", "read_products", "write_themes", "read_themes"],
  hostName: process.env.SHOPIFY_APP_URL || "localhost",
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  restResources,
});

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, "../dist")));

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
    res.status(500).json({ error: "Failed to initiate OAuth" });
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
    res.status(500).json({ error: "OAuth callback failed", message: error.message });
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
  res.sendFile(join(__dirname, "../dist/index.html"));
});

// App proxy route for Shopify app proxy
// Shopify app proxy format: /apps/{prefix}/{subpath}/{path}
// With prefix="apps" and subpath="a", the URL becomes: /apps/apps/a/{path}
app.get("/apps/apps/a/*", (req, res) => {
  // Handle app proxy requests
  // Extract path after /apps/apps/a/
  const proxyPath = req.path.replace("/apps/apps/a", "");
  
  if (proxyPath === "/widget" || proxyPath.startsWith("/widget")) {
    res.sendFile(join(__dirname, "../dist/index.html"));
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "../dist/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (isDev) {
    console.log(`Development server: http://localhost:${PORT}`);
  }
});

