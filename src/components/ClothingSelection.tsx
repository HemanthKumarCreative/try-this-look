import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ClothingSelectionProps {
  images: string[];
  selectedImage: string | null;
  onSelect: (imageUrl: string) => void;
}

export default function ClothingSelection({
  images,
  selectedImage,
  onSelect,
}: ClothingSelectionProps) {
  if (images.length === 0) {
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
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Select Clothing</h3>
        <p className="text-muted-foreground">
          Choose the clothing you want to try on
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.slice(0, 9).map((image, index) => (
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
              />
              {selectedImage === image && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="w-8 h-8" />
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {selectedImage && (
        <Card className="p-4 bg-success/10 border-success">
          <p className="font-semibold text-success text-center">
            Clothing selected! Click "Generate" to continue
          </p>
        </Card>
      )}
    </div>
  );
}
