import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppBridgeProvider } from "@/providers/AppBridgeProvider";
import Index from "./pages/Index";
import ProductDemo from "./pages/ProductDemo";
import Widget from "./pages/Widget";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * Main App Component
 * Wrapped with AppBridgeProvider to ensure App Bridge is initialized
 */
const App = () => {
  console.log("App component rendered");
  return (
    <AppBridgeProvider>
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
    </AppBridgeProvider>
  );
};

export default App;
