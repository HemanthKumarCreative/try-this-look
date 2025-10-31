import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Camera } from "lucide-react";

interface PhotoUploadProps {
  onPhotoUpload: (dataURL: string) => void;
}

const DEMO_PHOTOS = [
  "/assets/demo_pics/Audrey-Fleurot.jpg",
  "/assets/demo_pics/french_man.webp",
  "/assets/demo_pics/frwm2.webp",
  "/assets/demo_pics/frwm3.jpg",
];

export default function PhotoUpload({ onPhotoUpload }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataURL = reader.result as string;
        setPreview(dataURL);
        onPhotoUpload(dataURL);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoPhotoSelect = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataURL = reader.result as string;
        setPreview(dataURL);
        onPhotoUpload(dataURL);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error loading demo photo:", error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      <div className="sr-only">Téléchargez votre photo ou utilisez une photo de démonstration</div>

      {/* Upload Area */}
      <Card className="p-4 sm:p-5 md:p-6 lg:p-8 border-2 border-dashed border-primary/30 bg-card hover:border-primary/50 hover:bg-accent/30 transition-all duration-200 cursor-pointer min-h-[140px] sm:min-h-[160px] flex items-center group">
        <div
          className="text-center w-full"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload your photo"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 rounded bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center transition-colors duration-200">
            <Camera className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary transition-transform duration-200 group-hover:scale-110" />
          </div>
          <p className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 px-2">Cliquez pour télécharger votre photo</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground px-2">Formats acceptés : JPG, PNG (max 10 Mo)</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </Card>

      {/* Separator OU */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 my-1 sm:my-2">
        <div className="h-px flex-1 bg-border" />
        <span className="px-3 sm:px-4 py-1 sm:py-2 rounded-md bg-card border border-border text-muted-foreground font-semibold text-xs sm:text-sm whitespace-nowrap">ou</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Demo Photos */}
      <div>
        <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base md:text-lg flex items-center gap-2">
          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span>Sélectionner une photo de démonstration</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {DEMO_PHOTOS.map((photo, index) => (
            <Card
              key={index}
              className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all transform hover:scale-105 min-h-[100px] sm:min-h-[120px] md:min-h-[140px]"
              onClick={() => handleDemoPhotoSelect(photo)}
              role="button"
              tabIndex={0}
              aria-label={`Select demo photo ${index + 1}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleDemoPhotoSelect(photo);
              }}
            >
              <div className="w-full aspect-square bg-muted/30 flex items-center justify-center overflow-hidden">
                <img
                  src={photo}
                  alt={`Demo ${index + 1}`}
                  className="h-full w-auto object-contain"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {preview && (
        <Card className="p-3 sm:p-4 bg-success/10 border-success">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-muted/30 rounded border border-border flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
              <img
                src={preview}
                alt="Preview"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-success text-sm sm:text-base">
                Photo uploaded successfully!
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Proceed to the next step to select clothing
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
