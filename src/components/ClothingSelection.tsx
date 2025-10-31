import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ClothingSelectionProps {
  images: string[];
  selectedImage: string | null;
  onSelect: (imageUrl: string) => void;
  onRefreshImages?: () => void;
}

export default function ClothingSelection({
  images,
  selectedImage,
  onSelect,
  onRefreshImages,
}: ClothingSelectionProps) {
  const [validImages, setValidImages] = useState<string[]>([]);

  // Initialize with provided images; only remove on actual load error
  useEffect(() => {
    const unique = Array.from(new Set(images.filter(Boolean)));
    setValidImages(unique);
  }, [images]);
  if (validImages.length === 0 && !selectedImage) {
    return (
      <Card className="p-4 sm:p-6 md:p-8 text-center bg-warning/10 border-warning">
        <p className="font-semibold text-warning text-sm sm:text-base md:text-lg">
          No clothing images detected on this page
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
          Make sure you're on a Shopify product page
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Heading intentionally removed per design */}

      {!selectedImage && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {validImages.slice(0, 9).map((image, index) => (
            <Card
              key={index}
              className={`overflow-hidden cursor-pointer transition-all transform hover:scale-105 relative ${
                selectedImage === image
                  ? "ring-4 ring-primary shadow-lg scale-105"
                  : "hover:ring-2 hover:ring-primary/50"
              }`}
              onClick={() => onSelect(image)}
              role="button"
              tabIndex={0}
              aria-label={`Select clothing item ${index + 1}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(image);
              }}
            >
              <div className="relative bg-muted/30 flex items-center justify-center overflow-hidden">
                <img
                  src={image}
                  alt={`Clothing ${index + 1}`}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  onError={() => {
                    setValidImages((prev) => prev.filter((u) => u !== image));
                  }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedImage && (
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
            <p className="font-semibold text-sm sm:text-base md:text-lg">Article Sélectionné</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect("")}
              className="group h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm flex-shrink-0 gap-1.5 border-border text-foreground hover:bg-muted hover:border-muted-foreground/20 hover:text-muted-foreground transition-all duration-200"
              aria-label="Effacer la sélection"
            >
              <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:scale-110 duration-200" />
              <span>Effacer</span>
            </Button>
          </div>
          <div className="aspect-[3/4] rounded overflow-hidden border border-border bg-card flex items-center justify-center shadow-sm">
            <img
              src={selectedImage}
              alt="Selected clothing"
              className="h-full w-auto object-contain"
            />
          </div>
        </Card>
      )}
    </div>
  );
}
