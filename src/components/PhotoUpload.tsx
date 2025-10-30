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
    <div className="space-y-6">
      <div className="sr-only">Téléchargez votre photo ou utilisez une photo de démonstration</div>

      {/* Upload Area */}
      <Card className="p-6 sm:p-8 border-2 border-dashed border-rose-300 bg-white hover:border-rose-400 transition-all cursor-pointer">
        <div
          className="text-center"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload your photo"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded bg-rose-100 flex items-center justify-center">
            <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500" />
          </div>
          <p className="text-base sm:text-lg font-semibold mb-2">Cliquez pour télécharger votre photo</p>
          <p className="text-xs text-muted-foreground">Formats acceptés : JPG, PNG (max 10 Mo)</p>
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
      <div className="flex items-center gap-4 my-2">
        <div className="h-px flex-1 bg-rose-200" />
        <span className="px-4 py-2 rounded-md bg-white border border-rose-200 text-rose-500 font-semibold">ou</span>
        <div className="h-px flex-1 bg-rose-200" />
      </div>

      {/* Demo Photos */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Sélectionner une photo de démonstration
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {DEMO_PHOTOS.map((photo, index) => (
            <Card
              key={index}
              className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all transform hover:scale-105"
              onClick={() => handleDemoPhotoSelect(photo)}
              role="button"
              tabIndex={0}
              aria-label={`Select demo photo ${index + 1}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleDemoPhotoSelect(photo);
              }}
            >
              <img
                src={photo}
                alt={`Demo ${index + 1}`}
                className="w-full aspect-square object-cover"
              />
            </Card>
          ))}
        </div>
      </div>

      {preview && (
        <Card className="p-4 bg-success/10 border-success">
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-semibold text-success">
                Photo uploaded successfully!
              </p>
              <p className="text-sm text-muted-foreground">
                Proceed to the next step to select clothing
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
