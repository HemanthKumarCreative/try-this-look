import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
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
      <Card className="p-8 text-center bg-warning/10 border-warning">
        <p className="font-semibold text-warning">
          No clothing images detected on this page
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Make sure you're on a Shopify product page
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Heading intentionally removed per design */}

      {!selectedImage && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {validImages.slice(0, 9).map((image, index) => (
            <Card
              key={index}
              className={`overflow-hidden cursor-pointer transition-all transform hover:scale-105 relative ${
                selectedImage === image
                  ? "ring-4 ring-primary shadow-lg scale-105"
                  : "hover:ring-2 hover:ring-primary/50"
              }`}
              onClick={() => onSelect(image)}
            >
              <div className="aspect-square relative">
                <img
                  src={image}
                  alt={`Clothing ${index + 1}`}
                  className="w-full h-full object-cover"
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
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">Article Sélectionné</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect("")}
              className="h-8 px-2"
            >
              Effacer
            </Button>
          </div>
          <div className="aspect-[3/4] rounded overflow-hidden border bg-white">
            <img
              src={selectedImage}
              alt="Selected clothing"
              className="w-full h-full object-contain"
            />
          </div>
        </Card>
      )}
    </div>
  );
}
