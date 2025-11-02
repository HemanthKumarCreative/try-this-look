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
import { Sparkles, X, RotateCcw, XCircle } from "lucide-react";
import StatusBar from "./StatusBar";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(
    "Téléchargez votre photo puis choisissez un article à essayer"
  );
  const [statusVariant, setStatusVariant] = useState<"info" | "error">(
    "info"
  );
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
          console.log("Impossible de communiquer avec la fenêtre parente :", error);
        }
      }
    }
  }, [isOpen]);

  // No longer needed - using fixed 185px width

  // Listen for messages from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "NUSENSE_PRODUCT_IMAGES") {
        const parentImages = event.data.images || [];
        if (parentImages.length > 0) {
          setAvailableImages(parentImages);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handlePhotoUpload = (dataURL: string) => {
    setUploadedImage(dataURL);
    storage.saveUploadedImage(dataURL);
    setStatusVariant("info");
    setStatusMessage("Photo chargée. Sélectionnez un vêtement.");
  };

  const handleClothingSelect = (imageUrl: string) => {
    setSelectedClothing(imageUrl);
    storage.saveClothingUrl(imageUrl);
    setStatusVariant("info");
    setStatusMessage("Prêt à générer. Cliquez sur Générer.");
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedClothing) {
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
      } else {
        throw new Error(result.error_message?.message || "Erreur de génération");
      }
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur inattendue s'est produite";
      setError(errorMessage);
      setStatusVariant("error");
      setStatusMessage(errorMessage);
    } finally {
      setIsGenerating(false);
      try { localStorage.removeItem(INFLIGHT_KEY); } catch {}
    }
  };

  const handleRefreshImages = () => {
    const images = extractProductImages();
    setAvailableImages(images);
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

  // Check if we're inside an iframe
  const isInIframe = typeof window !== 'undefined' && window.parent !== window;

  // Handle close - if in iframe, notify parent window
  const handleClose = () => {
    if (isInIframe) {
      // Send message to parent window to close the modal
      try {
        window.parent.postMessage(
          { type: "NUSENSE_CLOSE_WIDGET" },
          "*"
        );
      } catch (error) {
        console.error("Échec de l'envoi du message de fermeture au parent :", error);
      }
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="w-[100vw] sm:w-[95vw] sm:max-w-5xl max-h-[100dvh] sm:max-h-[90dvh] overflow-y-auto p-0 rounded-none sm:rounded-lg"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div style={{ backgroundColor: '#fef3f3' }}>
          {/* Header */}
          <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 border-b border-border shadow-sm">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="inline-flex flex-col flex-shrink-0" style={{ width: '185px' }}>
                <span
                  aria-label="NULOOK"
                  className="inline-flex items-center tracking-wide leading-none whitespace-nowrap"
                  style={{ width: '185px', fontSize: '32px', fontWeight: 700 }}
                >
                  <span style={{ color: "#ce0003" }}>NU</span>
                  <span style={{ color: "#564646" }}>LOOK</span>
                </span>
                <div
                  className="mt-0.5 sm:mt-1 text-left leading-tight tracking-tight whitespace-nowrap"
                  style={{ width: '185px', fontSize: '12px', color: '#3D3232', fontWeight: 500 }}
                >
                  Essayage Virtuel Alimenté par IA
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 flex-shrink-0">
                {!isGenerating && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleReset}
                    className="group text-secondary-foreground hover:bg-secondary/80 transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 h-[44px] sm:h-9 md:h-10 whitespace-nowrap shadow-sm hover:shadow-md gap-2 flex items-center"
                    aria-label="Réinitialiser"
                  >
                    <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:rotate-[-120deg] duration-500" />
                    <span>Réinitialiser</span>
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleClose}
                  className="h-[44px] w-[44px] sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-md bg-error text-error-foreground hover:bg-error/90 border-error transition-all duration-200 group shadow-sm hover:shadow-md"
                  aria-label="Fermer"
                  title="Fermer"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-90 duration-300" />
                </Button>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="px-3 sm:px-4 md:px-5 lg:px-6 pt-2 sm:pt-3">
            <StatusBar message={statusMessage} variant={statusVariant} />
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Two-state layout for selection phase */}
            {currentStep <= 2 && !isGenerating && !generatedImage && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {/* Left Panel: Upload / Preview */}
                <Card className="p-3 sm:p-4 md:p-5 border-border bg-card">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold text-sm sm:text-base flex-shrink-0 shadow-sm">1</div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base sm:text-lg font-semibold">Téléchargez Votre Photo</h2>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Choisissez une photo claire de vous-même</p>
                    </div>
                  </div>

                  {!uploadedImage && (
                    <PhotoUpload onPhotoUpload={handlePhotoUpload} />
                  )}

                  {uploadedImage && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="relative rounded-lg bg-card p-2 sm:p-3 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <h3 className="font-semibold text-sm sm:text-base">Votre Photo</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearUploadedImage}
                            className="group h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm flex-shrink-0 gap-1.5 border-border text-foreground hover:bg-muted hover:border-muted-foreground/20 hover:text-muted-foreground transition-all duration-200"
                            aria-label="Effacer la photo"
                          >
                            <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:scale-110 duration-200" />
                            <span>Effacer</span>
                          </Button>
                        </div>
                        <div className="aspect-[3/4] rounded overflow-hidden border border-border bg-card flex items-center justify-center shadow-sm">
                          <img src={uploadedImage} alt="Uploaded" className="h-full w-auto object-contain" />
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Right Panel: Clothing Selection */}
                <Card className="p-3 sm:p-4 md:p-5 border-border bg-card">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold text-sm sm:text-base flex-shrink-0 shadow-sm">2</div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base sm:text-lg font-semibold">Sélectionner un Article de Vêtement</h2>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Sélectionnez un article de vêtement sur cette page</p>
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
              <div className="pt-1 sm:pt-2">
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedClothing || !uploadedImage || isGenerating}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg min-h-[44px] shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Générer l'essayage virtuel"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
                  <Button
                    variant="secondary"
                    onClick={handleReset}
                    className="group mt-4 gap-2 text-secondary-foreground hover:bg-secondary/80 transition-all duration-200"
                    aria-label="Réessayer"
                  >
                    <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-[-120deg] duration-500" />
                    <span>Réessayer</span>
                  </Button>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
