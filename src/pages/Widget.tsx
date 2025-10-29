import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PhotoUpload from "@/components/PhotoUpload";
import ClothingSelection from "@/components/ClothingSelection";
import GenerationProgress from "@/components/GenerationProgress";
import ResultDisplay from "@/components/ResultDisplay";
import {
  extractShopifyProductInfo,
  extractProductImages,
} from "@/utils/shopifyIntegration";
import { storage } from "@/utils/storage";
import { generateTryOn, dataURLToBlob } from "@/services/tryonApi";
import { TryOnResponse } from "@/types/tryon";
import { Sparkles, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductData {
  title: string;
  price: string;
  images: string[];
  description: string;
  variants: Array<{ name: string; value: string }>;
  url: string;
}

export default function Widget() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Listen for messages from parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "NUSENSE_PRODUCT_DATA") {
        setProductData(event.data.data);
        setAvailableImages(event.data.data.images || []);
      }
    };

    window.addEventListener("message", handleMessage);

    // Load saved session
    const savedImage = storage.getUploadedImage();
    if (savedImage) {
      setUploadedImage(savedImage);
      setCurrentStep(2);
    }

    // Extract product images from current page
    const images = extractProductImages();
    setAvailableImages(images);

    // Notify parent that widget is ready
    window.parent.postMessage({ type: "NUSENSE_WIDGET_READY" }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handlePhotoUpload = (dataURL: string) => {
    setUploadedImage(dataURL);
    storage.saveUploadedImage(dataURL);
    setCurrentStep(2);
    toast({
      title: "Photo uploaded",
      description: "Now select clothing",
    });
  };

  const handleClothingSelect = (imageUrl: string) => {
    setSelectedClothing(imageUrl);
    storage.saveClothingUrl(imageUrl);
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
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setCurrentStep(3);

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
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = () => {
    if (productData) {
      // Send product data to parent window
      window.parent.postMessage(
        {
          type: "NUSENSE_ADD_TO_CART",
          product: {
            ...productData,
            variants: productData.variants,
          },
        },
        "*"
      );

      toast({
        title: "Added to cart",
        description: `${productData.title} has been added to your cart`,
      });
    }
  };

  const handleClose = () => {
    window.parent.postMessage({ type: "NUSENSE_CLOSE_WIDGET" }, "*");
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

  const handleReset = () => {
    setCurrentStep(1);
    setUploadedImage(null);
    setSelectedClothing(null);
    setGeneratedImage(null);
    setError(null);
    setProgress(0);
    storage.clearSession();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">NUSENSE TryON</h2>
              <p className="text-sm opacity-90">AI-Powered Virtual Try-On</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <X className="w-4 h-4" />
            </Button>
            {currentStep > 1 && !isGenerating && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                Start Over
              </Button>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all text-sm ${
                  currentStep >= step
                    ? "bg-white text-primary scale-110"
                    : "bg-white/20 text-white/60"
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-8 h-1 mx-1 rounded transition-all ${
                    currentStep > step ? "bg-white" : "bg-white/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {currentStep === 1 && <PhotoUpload onPhotoUpload={handlePhotoUpload} />}

        {currentStep === 2 && (
          <div className="space-y-6">
            {uploadedImage && (
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Your Photo</h3>
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-24 h-24 object-cover rounded-lg mx-auto"
                />
              </Card>
            )}
            <ClothingSelection
              images={availableImages}
              selectedImage={selectedClothing}
              onSelect={handleClothingSelect}
              onRefreshImages={handleRefreshImages}
            />
            <Button
              onClick={handleGenerate}
              disabled={!selectedClothing || isGenerating}
              className="w-full bg-primary hover:bg-primary-dark text-primary-foreground text-lg py-6"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate My Virtual Try-On
            </Button>
          </div>
        )}

        {currentStep === 3 && (
          <GenerationProgress progress={progress} isGenerating={isGenerating} />
        )}

        {currentStep === 4 && generatedImage && (
          <ResultDisplay
            generatedImage={generatedImage}
            onAddToCart={handleAddToCart}
            onTryAnother={handleReset}
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
  );
}
