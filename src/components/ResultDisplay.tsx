import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ShoppingCart, RefreshCw, Share2 } from "lucide-react";

interface ResultDisplayProps {
  generatedImage: string;
  onAddToCart: () => void;
  onTryAnother: () => void;
}

export default function ResultDisplay({
  generatedImage,
  onAddToCart,
  onTryAnother,
}: ResultDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `nusense-tryon-${Date.now()}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await fetch(generatedImage).then((r) => r.blob());
        const file = new File([blob], "tryon-result.jpg", {
          type: "image/jpeg",
        });
        await navigator.share({
          files: [file],
          title: "My NUSENSE Virtual Try-On",
          text: "Look how this clothing fits me!",
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/20 text-success rounded mb-4">
          <span className="text-2xl">🎉</span>
          <span className="font-semibold">Try-On Successful!</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">Your Virtual Result</h3>
        <p className="text-muted-foreground">
          Here's how the clothing looks on you
        </p>
      </div>

      {/* Result Image */}
      <Card className="overflow-hidden">
        <div className="relative aspect-[3/4] max-w-md mx-auto">
          <img
            src={generatedImage}
            alt="Generated Try-On Result"
            className="w-full h-full object-contain"
          />
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={onAddToCart}
          className="bg-primary hover:bg-primary-dark text-primary-foreground"
          size="lg"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
        <Button onClick={handleDownload} variant="outline" size="lg">
          <Download className="w-5 h-5 mr-2" />
          Download
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {navigator.share && (
          <Button onClick={handleShare} variant="outline" size="lg">
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        )}
        <Button
          onClick={onTryAnother}
          variant="secondary"
          size="lg"
          className={navigator.share ? "" : "col-span-2"}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Try Something Else
        </Button>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-info/10 border-info">
        <p className="text-sm text-center text-muted-foreground">
          💡 <span className="font-medium">Tip:</span> Download your result and
          share it on social media!
        </p>
      </Card>
    </div>
  );
}
