import { Card } from "@/components/ui/card";
import { User, Shirt, Sparkles } from "lucide-react";

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
  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Triple preview: Personne | Vêtement | Généré */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Card className="p-2 sm:p-3 border-border">
          <div className="text-xs sm:text-sm font-medium mb-2 flex items-center gap-2">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
            <span className="text-foreground">Personne</span>
          </div>
          <div className="aspect-[3/4] rounded border border-border bg-muted/30 overflow-hidden flex items-center justify-center shadow-sm">
            {personImage ? (
              <img src={personImage} alt="Personne" className="h-full w-auto object-contain" />
            ) : (
              <div className="w-full h-full grid place-items-center text-[10px] sm:text-xs text-muted-foreground p-2">Aucune image</div>
            )}
          </div>
        </Card>

        <Card className="p-2 sm:p-3 border-border">
          <div className="text-xs sm:text-sm font-medium mb-2 flex items-center gap-2">
            <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-foreground" />
            <span className="text-foreground">Vêtement</span>
          </div>
          <div className="aspect-[3/4] rounded border border-border bg-muted/30 overflow-hidden flex items-center justify-center shadow-sm">
            {clothingImage ? (
              <img src={clothingImage} alt="Vêtement" className="h-full w-auto object-contain" />
            ) : (
              <div className="w-full h-full grid place-items-center text-[10px] sm:text-xs text-muted-foreground p-2">Aucune image</div>
            )}
          </div>
        </Card>

        <Card className="p-2 sm:p-3 sm:col-span-2 md:col-span-1 border-border ring-2 ring-primary/20">
          <div className="text-xs sm:text-sm font-medium mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-foreground font-semibold">Généré</span>
          </div>
          <div className="relative aspect-[3/4] rounded border border-border bg-card overflow-hidden flex items-center justify-center shadow-md">
            <img
              src={generatedImage}
              alt="Généré"
              className="h-full w-auto object-contain"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
