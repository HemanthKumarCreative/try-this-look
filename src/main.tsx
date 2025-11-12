import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("🚀 Main: React app starting...");
console.log("🔍 Main: Checking for App Bridge before React render...", {
  shopifyExists: typeof (window as any).shopify !== "undefined",
  shopifyValue: (window as any).shopify || null,
});

createRoot(document.getElementById("root")!).render(<App />);
