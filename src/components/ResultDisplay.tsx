import { Card } from "@/components/ui/card";

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
    <div className="space-y-6">
      {/* Triple preview: Personne | Vêtement | Généré */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-3">
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <span className="text-muted-foreground">👤</span>
            <span>Personne</span>
          </div>
          <div className="aspect-[3/4] rounded border bg-neutral-50 overflow-hidden">
            {personImage ? (
              <img src={personImage} alt="Personne" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full grid place-items-center text-xs text-muted-foreground">Aucune image</div>
            )}
          </div>
        </Card>

        <Card className="p-3">
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <span className="text-muted-foreground">👗</span>
            <span>Vêtement</span>
          </div>
          <div className="aspect-[3/4] rounded border bg-neutral-50 overflow-hidden">
            {clothingImage ? (
              <img src={clothingImage} alt="Vêtement" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full grid place-items-center text-xs text-muted-foreground">Aucune image</div>
            )}
          </div>
        </Card>

        <Card className="p-3">
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <span className="text-muted-foreground">✨</span>
            <span>Généré</span>
          </div>
          <div className="relative aspect-[3/4] rounded border bg-white overflow-hidden">
            <img
              src={generatedImage}
              alt="Généré"
              className="w-full h-full object-contain"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
