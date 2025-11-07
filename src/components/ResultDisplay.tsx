import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CreditCard,
  ShoppingCart,
  Building,
  Download,
} from "lucide-react";

interface ResultDisplayProps {
  generatedImage: string;
  personImage?: string | null;
  clothingImage?: string | null;
}

export default function ResultDisplay({
  generatedImage,
  personImage,
  clothingImage,
}: ResultDisplayProps) {
  const handleBuyNow = () => {
    // Send message to parent window to trigger buy now action
    if (window.parent !== window) {
      window.parent.postMessage({ type: "NUSENSE_BUY_NOW" }, "*");
    }
  };

  const handleAddToCart = () => {
    // Send message to parent window to trigger add to cart action
    if (window.parent !== window) {
      window.parent.postMessage({ type: "NUSENSE_ADD_TO_CART" }, "*");
    }
  };

  const handleTryInStore = () => {
    // Send message to parent window to trigger try in store action
    if (window.parent !== window) {
      window.parent.postMessage({ type: "NUSENSE_TRY_IN_STORE" }, "*");
    }
  };

  const handleDownload = () => {
    // Download the generated image
    try {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `essayage-virtuel-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
      // Fallback: open in new tab
      window.open(generatedImage, "_blank");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      <Card className="p-3 sm:p-4 md:p-5 border-border bg-card ring-2 ring-primary/20 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold text-sm sm:text-base flex-shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold">
              Résultat Généré
            </h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Essayage virtuel avec IA
            </p>
          </div>
        </div>

        {/* Split layout: 50% image, 50% action buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* Left side: Generated image */}
          <div className="relative aspect-[3/4] rounded-lg border border-border bg-card overflow-hidden flex items-center justify-center shadow-md">
            <img
              src={generatedImage}
              alt="Résultat de l'essayage virtuel"
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Right side: Action buttons */}
          <div className="flex flex-col justify-center gap-3 sm:gap-4">
            {/* Buy Now - Red border */}
            <Button
              onClick={handleBuyNow}
              className="w-full h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg font-semibold border-2 border-red-500 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Acheter Maintenant
            </Button>

            {/* Add to Cart - Green border */}
            <Button
              onClick={handleAddToCart}
              className="w-full h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg font-semibold border-2 border-green-500 bg-white hover:bg-green-50 text-green-600 hover:text-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Ajouter au Panier
            </Button>

            {/* Try in Store - Orange border */}
            <Button
              onClick={handleTryInStore}
              className="w-full h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg font-semibold border-2 border-orange-500 bg-white hover:bg-orange-50 text-orange-600 hover:text-orange-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              essayer en magasin
            </Button>

            {/* Download - Blue border */}
            <Button
              onClick={handleDownload}
              className="w-full h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg font-semibold border-2 border-blue-500 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
