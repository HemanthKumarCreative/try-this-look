import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

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
      {/* Generated image only */}
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
        <div className="relative aspect-[3/4] rounded-lg border border-border bg-card overflow-hidden flex items-center justify-center shadow-md">
          <img
            src={generatedImage}
            alt="Résultat de l'essayage virtuel"
            className="h-full w-auto object-contain"
          />
        </div>
      </Card>
    </div>
  );
}
