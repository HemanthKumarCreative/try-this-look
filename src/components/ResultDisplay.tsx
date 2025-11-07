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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
          {/* Left side: Generated image */}
          <div className="relative aspect-[3/4] rounded-lg border border-border/50 bg-gradient-to-br from-muted/20 to-muted/5 overflow-hidden flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300">
            <img
              src={generatedImage}
              alt="Résultat de l'essayage virtuel"
              className="h-full w-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* Right side: Action buttons */}
          <div className="flex flex-col justify-center gap-3 sm:gap-3.5 md:gap-4">
            {/* Buy Now - Red border */}
            <Button
              onClick={handleBuyNow}
              variant="outline"
              className="group relative w-full min-h-[48px] sm:min-h-[52px] md:min-h-[56px] h-auto py-3 sm:py-3.5 md:py-4 px-4 sm:px-5 md:px-6 text-sm sm:text-base font-semibold border-2 border-red-500/80 bg-white hover:bg-red-50 hover:border-red-600 text-red-600 hover:text-red-700 active:bg-red-100 active:scale-[0.98] transition-all duration-200 ease-out shadow-sm hover:shadow-md hover:shadow-red-500/10 focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2"
              aria-label="Acheter Maintenant"
            >
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="leading-tight">Acheter Maintenant</span>
            </Button>

            {/* Add to Cart - Green border */}
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="group relative w-full min-h-[48px] sm:min-h-[52px] md:min-h-[56px] h-auto py-3 sm:py-3.5 md:py-4 px-4 sm:px-5 md:px-6 text-sm sm:text-base font-semibold border-2 border-green-500/80 bg-white hover:bg-green-50 hover:border-green-600 text-green-600 hover:text-green-700 active:bg-green-100 active:scale-[0.98] transition-all duration-200 ease-out shadow-sm hover:shadow-md hover:shadow-green-500/10 focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2"
              aria-label="Ajouter au Panier"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="leading-tight">Ajouter au Panier</span>
            </Button>

            {/* Try in Store - Orange border */}
            <Button
              onClick={handleTryInStore}
              variant="outline"
              className="group relative w-full min-h-[48px] sm:min-h-[52px] md:min-h-[56px] h-auto py-3 sm:py-3.5 md:py-4 px-4 sm:px-5 md:px-6 text-sm sm:text-base font-semibold border-2 border-orange-500/80 bg-white hover:bg-orange-50 hover:border-orange-600 text-orange-600 hover:text-orange-700 active:bg-orange-100 active:scale-[0.98] transition-all duration-200 ease-out shadow-sm hover:shadow-md hover:shadow-orange-500/10 focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2"
              aria-label="essayer en magasin"
            >
              <Building className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="leading-tight">essayer en magasin</span>
            </Button>

            {/* Download - Blue border */}
            <Button
              onClick={handleDownload}
              variant="outline"
              className="group relative w-full min-h-[48px] sm:min-h-[52px] md:min-h-[56px] h-auto py-3 sm:py-3.5 md:py-4 px-4 sm:px-5 md:px-6 text-sm sm:text-base font-semibold border-2 border-blue-500/80 bg-white hover:bg-blue-50 hover:border-blue-600 text-blue-600 hover:text-blue-700 active:bg-blue-100 active:scale-[0.98] transition-all duration-200 ease-out shadow-sm hover:shadow-md hover:shadow-blue-500/10 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2"
              aria-label="Télécharger"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="leading-tight">Télécharger</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
