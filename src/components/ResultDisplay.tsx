import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ShoppingCart, RefreshCw, Share2 } from 'lucide-react';

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
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `nusense-tryon-${Date.now()}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await fetch(generatedImage).then(r => r.blob());
        const file = new File([blob], 'tryon-result.jpg', { type: 'image/jpeg' });
        await navigator.share({
          files: [file],
          title: 'Mon Essayage Virtuel NUSENSE',
          text: 'Regardez comment ce vêtement me va!',
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/20 text-success rounded-full mb-4">
          <span className="text-2xl">🎉</span>
          <span className="font-semibold">Essayage Réussi!</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">Votre Résultat Virtuel</h3>
        <p className="text-muted-foreground">
          Voici comment le vêtement vous va
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
          Ajouter au Panier
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Télécharger
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {navigator.share && (
          <Button
            onClick={handleShare}
            variant="outline"
            size="lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Partager
          </Button>
        )}
        <Button
          onClick={onTryAnother}
          variant="secondary"
          size="lg"
          className={navigator.share ? '' : 'col-span-2'}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Essayer Autre Chose
        </Button>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-info/10 border-info">
        <p className="text-sm text-center text-muted-foreground">
          💡 <span className="font-medium">Astuce:</span> Téléchargez votre résultat et partagez-le sur les réseaux sociaux!
        </p>
      </Card>
    </div>
  );
}
