import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PhotoUpload from "./PhotoUpload";
import ClothingSelection from "./ClothingSelection";
import ResultDisplay from "./ResultDisplay";
import {
  extractShopifyProductInfo,
  extractProductImages,
  detectStoreOrigin,
  requestStoreInfoFromParent,
  getStoreOriginFromPostMessage,
  type StoreInfo,
} from "@/utils/shopifyIntegration";
import { storage } from "@/utils/storage";
import { generateTryOn, dataURLToBlob } from "@/services/tryonApi";
import { TryOnResponse } from "@/types/tryon";
import { Sparkles, X, RotateCcw, XCircle } from "lucide-react";
import StatusBar from "./StatusBar";

interface TryOnWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function TryOnWidget({ isOpen, onClose }: TryOnWidgetProps) {
  // currentStep is kept for generate/progress/result, but UI no longer shows stepper
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [recommendedImages, setRecommendedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(
    "Téléchargez votre photo puis choisissez un article à essayer"
  );
  const [statusVariant, setStatusVariant] = useState<"info" | "error">("info");
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const INFLIGHT_KEY = "nusense_tryon_inflight";
  // Track if we've already loaded images from URL/NUSENSE_PRODUCT_DATA to prevent parent images from overriding
  const imagesLoadedRef = useRef<boolean>(false);

  // Debug: Log when availableImages changes
  useEffect(() => {
    console.log(
      "NUSENSE: availableImages updated:",
      availableImages.length,
      availableImages
    );
  }, [availableImages]);

  // Debug: Log when storeInfo changes
  useEffect(() => {
    if (storeInfo) {
      const storeName = storeInfo.shopDomain || storeInfo.domain;
      const detectionMethod = storeInfo.method;
      
      // Clear, prominent console log for store detection
      console.log(
        "%c🛍️ NUSENSE: Store Detected",
        "color: #4CAF50; font-weight: bold; font-size: 14px;"
      );
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📦 Store Domain:", storeName || "Unknown");
      console.log("🌐 Full URL:", storeInfo.fullUrl || "N/A");
      console.log("📍 Origin:", storeInfo.origin || "N/A");
      console.log("🔍 Detection Method:", detectionMethod);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      // Also log as a single object for easy inspection
      console.log("Store Info Object:", storeInfo);
      
      // Expose store info globally for debugging/access
      if (typeof window !== 'undefined') {
        (window as any).NUSENSE_STORE_INFO = storeInfo;
        console.log("💡 Access store info anytime via: window.NUSENSE_STORE_INFO");
      }
    }
  }, [storeInfo]);

  useEffect(() => {
    // Load saved session on mount
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

    const isInIframe = window.parent !== window;
    let imagesFound = false;

    // Detect store origin when component mounts
    const detectedStore = detectStoreOrigin();
    if (detectedStore && detectedStore.method !== 'unknown') {
      setStoreInfo(detectedStore);
      // Store info will be logged by the useEffect above
    } else {
      console.log("%c⚠️ NUSENSE: Store not detected on mount. Will try other methods...", "color: #FF9800; font-weight: bold;");
    }

    // If we're in an iframe, ALWAYS prioritize images from the parent window (Shopify product page)
    // Do NOT extract images from the widget's own page (/widget page)
    if (isInIframe) {
      console.log(
        "NUSENSE: Widget is in iframe mode - requesting images from Shopify product page (parent window)"
      );

      // Request store info from parent if not already detected
      if (!detectedStore || detectedStore.method === 'unknown' || detectedStore.method === 'postmessage') {
        requestStoreInfoFromParent((storeInfo) => {
          setStoreInfo(storeInfo);
          // Store info will be logged by the useEffect above
        }).catch((error) => {
          console.warn('%c⚠️ NUSENSE: Failed to get store info from parent:', "color: #FF9800; font-weight: bold;", error);
        });
      }

      const requestImages = () => {
        try {
          console.log(
            "NUSENSE: Requesting images from parent window (Shopify product page)"
          );
          window.parent.postMessage({ type: "NUSENSE_REQUEST_IMAGES" }, "*");
        } catch (error) {
          console.error(
            "NUSENSE: Error communicating with parent window:",
            error
          );
        }
      };

      // Request immediately - parent window will extract images from Shopify page
      requestImages();

      // Retry multiple times to ensure we get the images
      // Parent window listener might not be ready immediately
      const retryDelays = [200, 500, 1000, 2000];
      retryDelays.forEach((delay) => {
        setTimeout(() => {
          // Only retry if we haven't received images yet
          if (!imagesLoadedRef.current) {
            console.log(
              `NUSENSE: Retrying image request from parent window (delay: ${delay}ms)`
            );
            requestImages();
          }
        }, delay);
      });

      // DO NOT extract from widget's own page when in iframe mode
      // Wait for parent window to send images via postMessage
      return;
    }

    // If NOT in iframe (standalone mode), extract images from current page
    // Priority 1: Get product images from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get("product");
    if (productParam) {
      try {
        const productData = JSON.parse(decodeURIComponent(productParam));
        if (
          productData.images &&
          Array.isArray(productData.images) &&
          productData.images.length > 0
        ) {
          console.log(
            "NUSENSE: Images loaded from URL parameters:",
            productData.images.length
          );
          setAvailableImages(productData.images);
          imagesLoadedRef.current = true;
          imagesFound = true;
        }
      } catch (error) {
        console.error("Failed to parse product data from URL:", error);
      }
    }

    // Priority 2: Get product images from window.NUSENSE_PRODUCT_DATA
    if (
      !imagesFound &&
      typeof window !== "undefined" &&
      (window as any).NUSENSE_PRODUCT_DATA
    ) {
      const productData = (window as any).NUSENSE_PRODUCT_DATA;
      if (
        productData.images &&
        Array.isArray(productData.images) &&
        productData.images.length > 0
      ) {
        console.log(
          "NUSENSE: Images loaded from NUSENSE_PRODUCT_DATA:",
          productData.images.length
        );
        setAvailableImages(productData.images);
        imagesLoadedRef.current = true;
        imagesFound = true;
      }
    }

    // Priority 3: Extract product images from the current page (standalone mode only)
    if (!imagesFound) {
      const images = extractProductImages();
      if (images.length > 0) {
        console.log("NUSENSE: Images extracted from page:", images.length);
        setAvailableImages(images);
        imagesLoadedRef.current = true;
        imagesFound = true;
      } else {
        console.log("NUSENSE: No images found from page extraction");
      }
    }
  }, []);

  // No longer needed - using fixed 185px width

  // Listen for messages from parent window (Shopify product page)
  // This is CRITICAL for iframe mode - parent window extracts images from the Shopify product page
  // and sends them to this widget iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Extract store origin from postMessage events
      const storeOrigin = getStoreOriginFromPostMessage(event);
      if (storeOrigin && storeOrigin.method === 'postmessage') {
        setStoreInfo((prev) => {
          // Only update if we don't have store info or if new info is more specific
          if (!prev || prev.method === 'unknown' || prev.method === 'postmessage') {
            return storeOrigin;
          }
          return prev;
        });
      }

      // Only process messages from parent window
      if (event.data && event.data.type === "NUSENSE_PRODUCT_IMAGES") {
        const parentImages = event.data.images || [];
        const parentRecommendedImages = event.data.recommendedImages || [];
        console.log(
          "NUSENSE: Received images from Shopify product page (parent window):",
          parentImages.length,
          "main images and",
          parentRecommendedImages.length,
          "recommended images"
        );

        if (parentImages.length > 0) {
          // Always prioritize and use parent images - they come from the actual Shopify product page
          // These are extracted using Shopify Liquid objects (product.media/product.images)
          console.log(
            "NUSENSE: Successfully received images from Shopify product page. Main:",
            parentImages.length,
            "Recommended:",
            parentRecommendedImages.length
          );
          setAvailableImages(parentImages);
          imagesLoadedRef.current = true;
        } else {
          console.warn(
            "NUSENSE: Parent window (Shopify page) sent empty images array. Product may have no images."
          );
        }

        // Set recommended images if available
        if (parentRecommendedImages.length > 0) {
          console.log(
            "NUSENSE: Setting recommended products images:",
            parentRecommendedImages.length
          );
          setRecommendedImages(parentRecommendedImages);
        }
      }

      // Handle store info response from parent
      if (event.data && event.data.type === "NUSENSE_STORE_INFO") {
        const storeInfo: StoreInfo = {
          domain: event.data.domain || null,
          fullUrl: event.data.fullUrl || null,
          shopDomain: event.data.shopDomain || null,
          origin: event.data.origin || event.origin || null,
          method: 'parent-request'
        };
        setStoreInfo(storeInfo);
        // Store info will be logged by the useEffect above
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []); // Empty dependency array - listener should persist

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
    setStatusMessage(
      "Génération en cours. Cela peut prendre 15 à 20 secondes…"
    );
    try {
      localStorage.setItem(INFLIGHT_KEY, "1");
    } catch {}

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
        throw new Error(
          result.error_message?.message || "Erreur de génération"
        );
      }
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur inattendue s'est produite";
      setError(errorMessage);
      setStatusVariant("error");
      setStatusMessage(errorMessage);
    } finally {
      setIsGenerating(false);
      try {
        localStorage.removeItem(INFLIGHT_KEY);
      } catch {}
    }
  };

  const handleRefreshImages = () => {
    const isInIframe = window.parent !== window;

    // If in iframe, always request images from parent window (Shopify product page)
    if (isInIframe) {
      console.log(
        "NUSENSE: Refreshing images - requesting from Shopify product page (parent window)"
      );
      try {
        window.parent.postMessage({ type: "NUSENSE_REQUEST_IMAGES" }, "*");
      } catch (error) {
        console.error(
          "NUSENSE: Failed to request images from parent window:",
          error
        );
      }
      return;
    }

    // If NOT in iframe (standalone mode), extract from current page
    let imagesFound = false;

    // Priority 1: Get product images from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get("product");
    if (productParam) {
      try {
        const productData = JSON.parse(decodeURIComponent(productParam));
        if (
          productData.images &&
          Array.isArray(productData.images) &&
          productData.images.length > 0
        ) {
          setAvailableImages(productData.images);
          imagesFound = true;
        }
      } catch (error) {
        console.error("Failed to parse product data from URL:", error);
      }
    }

    // Priority 2: Get product images from window.NUSENSE_PRODUCT_DATA
    if (
      !imagesFound &&
      typeof window !== "undefined" &&
      (window as any).NUSENSE_PRODUCT_DATA
    ) {
      const productData = (window as any).NUSENSE_PRODUCT_DATA;
      if (
        productData.images &&
        Array.isArray(productData.images) &&
        productData.images.length > 0
      ) {
        setAvailableImages(productData.images);
        imagesFound = true;
      }
    }

    // Priority 3: Extract product images from the current page
    if (!imagesFound) {
      const images = extractProductImages();
      if (images.length > 0) {
        setAvailableImages(images);
        imagesFound = true;
      }
    }
  };

  const handleClearUploadedImage = () => {
    setUploadedImage(null);
    try {
      storage.clearUploadedImage();
    } catch {}
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
    // Check for inflight generation after state updates are applied
    // This ensures uploadedImage and selectedClothing are set before calling handleGenerate
    const inflight = localStorage.getItem(INFLIGHT_KEY) === "1";
    const savedResult = storage.getGeneratedImage();

    // Only resume generation if:
    // 1. There's an inflight generation
    // 2. We have both uploadedImage and selectedClothing (state is set)
    // 3. We don't already have a result
    if (
      inflight &&
      uploadedImage &&
      selectedClothing &&
      !savedResult &&
      !generatedImage
    ) {
      // Restart generation to resume after a short delay to ensure state is fully applied
      const timeoutId = setTimeout(() => {
        handleGenerate();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [uploadedImage, selectedClothing, generatedImage]); // Depend on state to ensure it's set before resuming

  // Check if we're inside an iframe
  const isInIframe = typeof window !== "undefined" && window.parent !== window;

  // Handle close - if in iframe, notify parent window
  const handleClose = () => {
    if (isInIframe) {
      // Send message to parent window to close the modal
      try {
        window.parent.postMessage({ type: "NUSENSE_CLOSE_WIDGET" }, "*");
      } catch (error) {
        console.error(
          "Échec de l'envoi du message de fermeture au parent :",
          error
        );
      }
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{ backgroundColor: "#fef3f3", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 border-b border-border shadow-sm">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="inline-flex flex-col flex-shrink-0 min-w-0">
            <span
              aria-label="NULOOK"
              className="inline-flex items-center tracking-wide leading-none whitespace-nowrap text-2xl sm:text-3xl md:text-4xl font-bold"
            >
              <span style={{ color: "#ce0003" }}>NU</span>
              <span style={{ color: "#564646" }}>LOOK</span>
            </span>
            <div className="mt-0.5 sm:mt-1 text-left leading-tight tracking-tight whitespace-nowrap text-[10px] sm:text-xs md:text-sm text-[#3D3232] font-medium">
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
        {/* Selection sections - always visible */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* Left Panel: Upload / Preview */}
          <Card className="p-3 sm:p-4 md:p-5 border-border bg-card">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold text-sm sm:text-base flex-shrink-0 shadow-sm">
                1
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-semibold">
                  Téléchargez Votre Photo
                </h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Choisissez une photo claire de vous-même
                </p>
              </div>
            </div>

            {!uploadedImage && (
              <PhotoUpload onPhotoUpload={handlePhotoUpload} />
            )}

            {uploadedImage && (
              <div className="space-y-3 sm:space-y-4">
                <div className="relative rounded-lg bg-card p-2 sm:p-3 border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <h3 className="font-semibold text-sm sm:text-base">
                      Votre Photo
                    </h3>
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
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Right Panel: Clothing Selection */}
          <Card className="p-3 sm:p-4 md:p-5 border-border bg-card">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold text-sm sm:text-base flex-shrink-0 shadow-sm">
                2
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-semibold">
                  Sélectionner un Article de Vêtement
                </h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Sélectionnez un article de vêtement sur cette page
                </p>
              </div>
            </div>

            <ClothingSelection
              images={availableImages}
              recommendedImages={recommendedImages}
              selectedImage={selectedClothing}
              onSelect={handleClothingSelect}
              onRefreshImages={handleRefreshImages}
            />
          </Card>
        </div>

        {/* Generate button - show when not generating */}
        {!isGenerating && (
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

        {/* Results section - always visible with skeleton when loading */}
        <div className="pt-2 sm:pt-4">
          <ResultDisplay
            generatedImage={generatedImage}
            personImage={uploadedImage}
            clothingImage={selectedClothing}
            isGenerating={isGenerating}
            progress={progress}
          />
        </div>

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
  );
}
