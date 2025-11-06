import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TryOnWidget from "@/components/TryOnWidget";
import {
  extractProductImages,
  initializeImageExtractionListener,
} from "@/utils/shopifyIntegration";

export default function Widget() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Initialize image extraction listener for iframe communication
    initializeImageExtractionListener();
  }, []);

  return (
    <div className="w-full h-full" style={{ backgroundColor: "#fef3f3" }}>
      {/* Try-On Widget Content - No Modal Wrapper */}
      {/* Product images are now handled inside TryOnWidget from URL parameters */}
      <TryOnWidget />
    </div>
  );
}
