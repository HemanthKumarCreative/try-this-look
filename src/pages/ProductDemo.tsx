import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TryOnWidget from '@/components/TryOnWidget';
import { Sparkles, ShoppingCart, Heart, Share2 } from 'lucide-react';

/**
 * Demo Product Page Component
 * This simulates a typical Shopify product page for testing the Try-On widget
 */
const ProductDemo = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">DEMO BOUTIQUE</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-muted-foreground">
          Accueil / Vêtements / Hauts / <span className="text-foreground">T-Shirt Premium</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
                alt="T-Shirt Premium"
                className="w-full h-[600px] object-cover"
              />
            </Card>
            <div className="grid grid-cols-4 gap-4">
              {[
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200',
                'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200',
                'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=200',
              ].map((img, i) => (
                <Card key={i} className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary">
                  <img
                    src={img}
                    alt={`View ${i + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </Card>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">T-Shirt Premium Coton</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">★</span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(128 avis)</span>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">49,99 €</div>
              <p className="text-sm text-muted-foreground line-through">69,99 €</p>
            </div>

            <div className="border-t border-b py-4">
              <p className="text-gray-700">
                T-shirt premium en coton biologique, coupe régulière. Fabriqué de manière durable
                avec des matériaux de haute qualité. Parfait pour un style décontracté et confortable.
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Taille</h3>
              <div className="flex gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <Button
                    key={size}
                    variant="outline"
                    className="w-12 h-12"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Couleur</h3>
              <div className="flex gap-2">
                {['#000000', '#FFFFFF', '#CE0003', '#4B5563'].map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded-full border-2 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantité</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => setIsWidgetOpen(true)}
                variant="tryon"
                size="lg"
                className="w-full text-lg"
              >
                <Sparkles className="w-6 h-6" />
                Essayer Virtuellement
              </Button>
              
              <Button
                size="lg"
                className="w-full text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Ajouter au Panier
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                  Favoris
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                  Partager
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Détails du Produit</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 100% Coton biologique</li>
                  <li>• Coupe régulière</li>
                  <li>• Col rond</li>
                  <li>• Manches courtes</li>
                  <li>• Lavable en machine à 30°</li>
                  <li>• Fabriqué de manière éthique</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Livraison & Retours</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Livraison gratuite dès 50€</li>
                  <li>• Retours gratuits sous 30 jours</li>
                  <li>• Expédition sous 24h</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16">
          <div className="border-b mb-8">
            <div className="flex gap-8">
              <button className="pb-4 border-b-2 border-primary font-semibold">
                Description
              </button>
              <button className="pb-4 text-gray-500">
                Avis (128)
              </button>
              <button className="pb-4 text-gray-500">
                Guide des Tailles
              </button>
            </div>
          </div>
          <div className="prose max-w-none">
            <p>
              Notre t-shirt premium en coton biologique est conçu pour offrir un confort maximal
              tout en étant respectueux de l'environnement. Fabriqué avec des matériaux de haute
              qualité et certifié GOTS, ce t-shirt est parfait pour un usage quotidien.
            </p>
            <p>
              La coupe régulière assure un ajustement confortable pour tous les types de morphologie.
              Le tissu respirant et doux au toucher vous gardera à l'aise toute la journée.
            </p>
          </div>
        </div>
      </div>

      {/* Try-On Widget Modal */}
      <TryOnWidget isOpen={isWidgetOpen} onClose={() => setIsWidgetOpen(false)} />
    </div>
  );
};

export default ProductDemo;
