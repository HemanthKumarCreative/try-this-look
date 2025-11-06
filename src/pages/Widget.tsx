import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TryOnWidget from "@/components/TryOnWidget";
import {
  extractProductImages,
  initializeImageExtractionListener,
} from "@/utils/shopifyIntegration";

export default function Widget() {
  const [searchParams] = useSearchParams();
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productData, setProductData] = useState<any>(null);

  useEffect(() => {
    // Get product data from URL query parameters
    const productParam = searchParams.get("product");
    if (productParam) {
      try {
        const data = JSON.parse(decodeURIComponent(productParam));
        setProductData(data);
        
        // Use product images from URL if available
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          setProductImages(data.images);
        }
      } catch (error) {
        console.error("Failed to parse product data:", error);
      }
    }

    // Initialize image extraction listener for iframe communication
    initializeImageExtractionListener();

    // Extract real product images from the page (if not from URL)
    const images = extractProductImages();
    if (images.length > 0 && productImages.length === 0) {
      setProductImages(images);
    }
  }, [searchParams, productImages.length]);

  return (
    <div className="w-full h-full" style={{ backgroundColor: "#fef3f3" }}>
      {/* Try-On Widget Content - No Modal Wrapper */}
      <TryOnWidget />
    </div>
  );
}
