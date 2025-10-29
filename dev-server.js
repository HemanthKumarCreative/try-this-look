const express = require("express");
const path = require("path");
const app = express();
const PORT = 8081;

// Serve static files from public directory
app.use(express.static("public"));

// Serve the test integration page
app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "test-integration.html"));
});

// Serve the widget page
app.get("/widget", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Serve the demo page
app.get("/demo", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Development server running at http://localhost:${PORT}`);
  console.log(`📱 Test integration page: http://localhost:${PORT}/test`);
  console.log(`🎯 Widget page: http://localhost:${PORT}/widget`);
  console.log(`🛍️  Demo page: http://localhost:${PORT}/demo`);
});
