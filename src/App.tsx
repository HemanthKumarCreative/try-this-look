import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductDemo from "./pages/ProductDemo";
import Widget from "./pages/Widget";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * Main App Component
 *
 * App Bridge 4.x Setup:
 * - App Bridge is initialized via the script tag in index.html
 * - No Provider component needed - App Bridge works globally
 * - Use `useAppBridge()` hook to access the `shopify` global variable
 * - Route synchronization is automatic - no manual setup needed
 * - Authenticated API calls use: fetch('shopify:admin/api/...')
 */
const App = () => {
  console.log("App component rendered");
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/demo" element={<ProductDemo />} />
            <Route path="/widget" element={<Widget />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
