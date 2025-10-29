import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";

interface PhotoUploadProps {
  onPhotoUpload: (dataURL: string) => void;
}

const DEMO_PHOTOS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
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
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Upload Your Photo</h3>
        <p className="text-muted-foreground">
          Choose a photo of yourself or use a demo photo
        </p>
      </div>

      {/* Upload Area */}
      <Card className="p-8 border-2 border-dashed border-gray-300 hover:border-primary transition-all cursor-pointer">
        <div
          className="text-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-10 h-10 text-primary" />
          </div>
          <p className="text-lg font-semibold mb-2">Click to upload a photo</p>
          <p className="text-sm text-muted-foreground mb-4">
            or drag and drop your file here
          </p>
          <p className="text-xs text-muted-foreground">
            Accepted formats: JPG, PNG (max 10MB)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </Card>

      {/* Demo Photos */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Or try with a demo photo
        </h4>
        <div className="grid grid-cols-3 gap-4">
          {DEMO_PHOTOS.map((photo, index) => (
            <Card
              key={index}
              className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all transform hover:scale-105"
              onClick={() => handleDemoPhotoSelect(photo)}
            >
              <img
                src={photo}
                alt={`Demo ${index + 1}`}
                className="w-full h-40 object-cover"
              />
            </Card>
          ))}
        </div>
      </div>

      {preview && (
        <Card className="p-4 bg-success/10 border-success">
          <div className="flex items-center gap-4">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg"
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
