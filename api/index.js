// Vercel serverless function wrapper for Express app
import expressApp from "../server/index.js";

// Vercel serverless function handler
// Vercel passes (req, res) to serverless functions
export default function handler(req, res) {
  try {
    // Set Vercel environment flag
    process.env.VERCEL = "1";
    
    // Pass request to Express app
    // Express app handles the request and response
    expressApp(req, res);
  } catch (error) {
    // Catch any initialization errors
    console.error("Serverless function error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: error.message
      });
    }
  }
}

