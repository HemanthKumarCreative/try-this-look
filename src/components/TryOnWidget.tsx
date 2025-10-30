import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PhotoUpload from "./PhotoUpload";
import ClothingSelection from "./ClothingSelection";
import GenerationProgress from "./GenerationProgress";
import ResultDisplay from "./ResultDisplay";
import {
  extractShopifyProductInfo,
  extractProductImages,
} from "@/utils/shopifyIntegration";
import { storage } from "@/utils/storage";
import { generateTryOn, dataURLToBlob } from "@/services/tryonApi";
import { TryOnResponse } from "@/types/tryon";
import { Sparkles, ShoppingBag, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StatusBar from "./StatusBar";
import CartModal from "./CartModal";

interface TryOnWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TryOnWidget({ isOpen, onClose }: TryOnWidgetProps) {
  // currentStep is kept for generate/progress/result, but UI no longer shows stepper
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const [logoRenderedWidth, setLogoRenderedWidth] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(
    "Téléchargez votre photo puis choisissez un article à essayer"
  );
  const [statusVariant, setStatusVariant] = useState<"info" | "error">(
    "info"
  );
  const [cartCount, setCartCount] = useState<number>(
    storage.getCartItems().length
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const INFLIGHT_KEY = 'nusense_tryon_inflight';

  useEffect(() => {
    if (isOpen) {
      // Load saved session
      const savedImage = storage.getUploadedImage();
      const savedClothing = storage.getClothingUrl();
      const savedResult = storage.getGeneratedImage();
      if (savedImage) {
        setUploadedImage(savedImage);
        setCurrentStep(2);
        setStatusMessage("Photo chargée. Sélectionnez un vêtement.");
      }
      if (savedClothing) {
        setSelectedClothing(savedClothing);
        setStatusMessage("Prêt à générer. Cliquez sur Générer.");
      }
      if (savedResult) {
        setGeneratedImage(savedResult);
        setCurrentStep(4);
        setStatusMessage("Résultat prêt. Utilisez les actions ci-dessous.");
      }

      // Extract product images from the current page
      const images = extractProductImages();
      setAvailableImages(images);

      // If we're in an iframe, try to get images from parent window
      if (window.parent !== window) {
        try {
          // Request product images from parent window
          window.parent.postMessage({ type: "NUSENSE_REQUEST_IMAGES" }, "*");
        } catch (error) {
          console.log("Could not communicate with parent window:", error);
        }
      }
    }
  }, [isOpen]);

  // Sync tagline width to exactly match logo width
  useEffect(() => {
    const updateWidth = () => {
      const w = logoImgRef.current?.getBoundingClientRect().width;
      if (w && Math.round(w) !== logoRenderedWidth) {
        setLogoRenderedWidth(Math.round(w));
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [logoRenderedWidth]);

  // Listen for messages from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "NUSENSE_PRODUCT_IMAGES") {
        const parentImages = event.data.images || [];
        if (parentImages.length > 0) {
          setAvailableImages(parentImages);
          toast({
            title: "Images loaded",
            description: `Found ${parentImages.length} product images from the website`,
          });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [toast]);

  const handlePhotoUpload = (dataURL: string) => {
    setUploadedImage(dataURL);
    storage.saveUploadedImage(dataURL);
    setStatusVariant("info");
    setStatusMessage("Photo chargée. Sélectionnez un vêtement.");
    toast({
      title: "Photo chargée",
      description: "Sélectionnez maintenant un vêtement",
    });
  };

  const handleClothingSelect = (imageUrl: string) => {
    setSelectedClothing(imageUrl);
    storage.saveClothingUrl(imageUrl);
    setStatusVariant("info");
    setStatusMessage("Prêt à générer. Cliquez sur Générer.");
    toast({
      title: "Clothing selected",
      description: "Ready to generate your virtual try-on!",
    });
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedClothing) {
      toast({
        title: "Missing images",
        description: "Please select your photo and clothing",
        variant: "destructive",
      });
      setStatusVariant("error");
      setStatusMessage(
        "La génération nécessite une photo et un article sélectionné."
      );
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setCurrentStep(3);
    setStatusVariant("info");
    setStatusMessage("Génération en cours. Cela peut prendre 30 à 60 secondes…");
    try { localStorage.setItem(INFLIGHT_KEY, '1'); } catch {}

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 5, 90));
    }, 1500);

    try {
      const personBlob = await dataURLToBlob(uploadedImage);
      const clothingResponse = await fetch(selectedClothing);
      const clothingBlob = await clothingResponse.blob();

      const result: TryOnResponse = await generateTryOn(
        personBlob,
        clothingBlob
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (result.status === "success" && result.image) {
        setGeneratedImage(result.image);
        storage.saveGeneratedImage(result.image);
        setCurrentStep(4);
        setStatusVariant("info");
        setStatusMessage("Résultat prêt. Vous pouvez acheter ou télécharger.");
        toast({
          title: "Success!",
          description: "Your virtual try-on is ready!",
        });
      } else {
        throw new Error(result.error_message?.message || "Generation error");
      }
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setStatusVariant("error");
      setStatusMessage(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      try { localStorage.removeItem(INFLIGHT_KEY); } catch {}
    }
  };

  const handleAddToCart = () => {
    const productInfo = extractShopifyProductInfo();
    if (productInfo) {
      storage.addToCart(productInfo);
      setCartCount(storage.getCartItems().length);
      setStatusVariant("info");
      setStatusMessage("Article ajouté au panier.");
      toast({
        title: "Added to cart",
        description: `${productInfo.name} has been added to your cart`,
      });
    }
  };

  const handleRefreshImages = () => {
    const images = extractProductImages();
    setAvailableImages(images);
    toast({
      title: "Images refreshed",
      description:
        images.length > 0
          ? `Found ${images.length} product images`
          : "No product images found on this page",
      variant: images.length > 0 ? "default" : "destructive",
    });
  };

  const handleClearUploadedImage = () => {
    setUploadedImage(null);
    try { storage.clearUploadedImage(); } catch {}
    setCurrentStep(1);
    setStatusVariant("info");
    setStatusMessage("Photo effacée. Téléchargez votre photo.");
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUploadedImage(null);
    setSelectedClothing(null);
    setGeneratedImage(null);
    setError(null);
    setProgress(0);
    storage.clearSession();
    setStatusVariant("info");
    setStatusMessage(
      "Téléchargez votre photo puis choisissez un article à essayer"
    );
  };

  useEffect(() => {
    if (!isOpen) return;
    const inflight = localStorage.getItem(INFLIGHT_KEY) === '1';
    const savedImage = storage.getUploadedImage();
    const savedClothing = storage.getClothingUrl();
    const savedResult = storage.getGeneratedImage();
    if (inflight && savedImage && savedClothing && !savedResult) {
      // Restart generation to resume
      setTimeout(() => {
        handleGenerate();
      }, 300);
    }
  }, [isOpen]);

  const handleCheckout = () => {
    setStatusVariant("info");
    setStatusMessage("Redirection vers le paiement…");
    toast({ title: "Checkout", description: "Redirection en cours…" });
    setTimeout(() => {
      setStatusMessage("Paiement simulé terminé.");
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-5xl max-h-[90dvh] overflow-y-auto p-0">
        <div className="bg-[#fff3f4]">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur p-4 sm:p-5 border-b">
            <div className="flex items-center justify-between">
              <div className="inline-flex flex-col items-center">
                <img
                  ref={logoImgRef}
                  src="/assets/NUSENSE_LOGO.svg"
                  alt="NUSENSE"
                  className="h-7 sm:h-8 w-auto"
                  onLoad={() => {
                    const w = logoImgRef.current?.getBoundingClientRect().width;
                    if (w) setLogoRenderedWidth(Math.round(w));
                  }}
                />
                <div
                  className="mt-1 text-center text-[12px] sm:text-[13px] md:text-sm text-gray-700 leading-tight tracking-[0.01em] font-medium whitespace-nowrap"
                  style={{ width: logoRenderedWidth ? `${logoRenderedWidth}px` : undefined }}
                >
                  Essayage Virtuel Alimenté par IA
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="relative cursor-pointer bg-[#ffe6ea] hover:bg-[#ffd6dd] text-[#d6455b] rounded-md p-2 shadow"
                  aria-label="Panier"
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsCartOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setIsCartOpen(true);
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#ff465e] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                      {cartCount}
                    </span>
                  )}
                </div>
                {!isGenerating && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="border-[#ffd6dd] text-[#d6455b] hover:bg-[#ffe6ea]"
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="px-4 sm:px-6 pt-3">
            <StatusBar message={statusMessage} variant={statusVariant} />
          </div>

          {/* Cart Modal */}
          {isCartOpen && (
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} />
          )}

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Two-state layout for selection phase */}
            {currentStep <= 2 && !isGenerating && !generatedImage && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel: Upload / Preview */}
                <Card className="p-5 border-rose-200 bg-rose-50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white grid place-items-center font-semibold">1</div>
                    <div>
                      <h2 className="text-lg font-semibold">Téléchargez Votre Photo</h2>
                      <p className="text-xs text-muted-foreground">Choisissez une photo claire de vous-même</p>
                    </div>
                  </div>

                  {!uploadedImage && (
                    <PhotoUpload onPhotoUpload={handlePhotoUpload} />
                  )}

                  {uploadedImage && (
                    <div className="space-y-4">
                      <div className="relative rounded-lg bg-white p-3 border border-rose-300">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Votre Photo</h3>
                          <Button variant="outline" size="sm" onClick={handleClearUploadedImage} className="h-8 px-2">
                            Effacer
                          </Button>
                        </div>
                        <div className="aspect-[3/4] rounded overflow-hidden border bg-white">
                          <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Right Panel: Clothing Selection */}
                <Card className="p-5 border-rose-200 bg-rose-50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white grid place-items-center font-semibold">2</div>
                    <div>
                      <h2 className="text-lg font-semibold">Sélectionner un Article de Vêtement</h2>
                      <p className="text-xs text-muted-foreground">Choisissez n'importe quel article de vêtement de cette page web</p>
                    </div>
                  </div>

                  <ClothingSelection
                    images={availableImages}
                    selectedImage={selectedClothing}
                    onSelect={handleClothingSelect}
                    onRefreshImages={handleRefreshImages}
                  />
                </Card>
              </div>
            )}

            {currentStep <= 2 && !isGenerating && !generatedImage && (
              <div className="pt-1">
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedClothing || !uploadedImage || isGenerating}
                  className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
                  aria-label="Générer l'essayage virtuel"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Générer
                </Button>
              </div>
            )}

            {currentStep === 3 && (
              <GenerationProgress
                progress={progress}
                isGenerating={isGenerating}
              />
            )}

            {currentStep === 4 && generatedImage && (
              <ResultDisplay
                generatedImage={generatedImage}
                personImage={uploadedImage}
                clothingImage={selectedClothing}
              />
            )}

            {error && (
              <Card className="p-6 bg-error/10 border-error">
                <p className="text-error font-medium">{error}</p>
                <Button onClick={handleReset} className="mt-4">
                  Try Again
                </Button>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
