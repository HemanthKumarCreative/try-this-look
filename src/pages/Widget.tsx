import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TryOnWidget from "@/components/TryOnWidget";
import {
  extractProductImages,
  initializeImageExtractionListener,
} from "@/utils/shopifyIntegration";
import { Sparkles } from "lucide-react";

export default function Widget() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(true);
  const [productImages, setProductImages] = useState<string[]>([]);

  useEffect(() => {
    // Initialize image extraction listener for iframe communication
    initializeImageExtractionListener();

    // Extract real product images from the page
    const images = extractProductImages();
    setProductImages(images);

    // Auto-open the widget on mount
    setIsWidgetOpen(true);
  }, []);

  // Respond to parent commands (e.g., re-open modal on subsequent clicks)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // We expect messages from parent (widget loader). No strict origin here due to potential custom domains.
      const type = (event?.data && (event.data as any).type) as string | undefined;
      if (!type) return;
      if (type === "NUSENSE_OPEN_MODAL") {
        setIsWidgetOpen(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);


  return (
    <div className="min-h-screen bg-background">
      {/* Optional: Add a button to open the widget if needed, or it auto-opens */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 flex items-center justify-center">
        <Button
          onClick={() => setIsWidgetOpen(true)}
          variant="tryon"
          size="lg"
          className="text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-8 h-11 sm:h-12 md:h-14 min-h-[44px]"
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Essayer Maintenant
        </Button>
      </div>

      {/* Try-On Widget Modal */}
      <TryOnWidget
        isOpen={isWidgetOpen}
        onClose={() => setIsWidgetOpen(false)}
      />
    </div>
  );
}
