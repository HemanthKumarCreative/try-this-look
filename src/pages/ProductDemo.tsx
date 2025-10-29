import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TryOnWidget from "@/components/TryOnWidget";
import { extractProductImages } from "@/utils/shopifyIntegration";
import { Sparkles, ShoppingCart, Heart, Share2 } from "lucide-react";

/**
 * Demo Product Page Component
 * This simulates a typical Shopify product page for testing the Try-On widget
 */
const ProductDemo = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [productImages, setProductImages] = useState<string[]>([]);

  useEffect(() => {
    // Extract real product images from the page
    const images = extractProductImages();
    if (images.length > 0) {
      setProductImages(images);
    } else {
      // Fallback to demo images if no real images found
      setProductImages([
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200",
        "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=200",
      ]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">DEMO STORE</h1>
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
          Home / Clothing / Tops /{" "}
          <span className="text-foreground">Premium T-Shirt</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {productImages.length > 0 && (
              <Card className="overflow-hidden">
                <img
                  src={productImages[0]}
                  alt="Premium T-Shirt"
                  className="w-full h-[600px] object-cover"
                />
              </Card>
            )}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.slice(1, 5).map((img, i) => (
                  <Card
                    key={i}
                    className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary"
                  >
                    <img
                      src={img}
                      alt={`View ${i + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Premium Cotton T-Shirt
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (128 reviews)
                </span>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">$49.99</div>
              <p className="text-sm text-muted-foreground line-through">
                $69.99
              </p>
            </div>

            <div className="border-t border-b py-4">
              <p className="text-gray-700">
                Premium organic cotton t-shirt with regular fit. Made
                sustainably with high-quality materials. Perfect for a casual
                and comfortable style.
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <Button key={size} variant="outline" className="w-12 h-12">
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Color</h3>
              <div className="flex gap-2">
                {["#000000", "#FFFFFF", "#CE0003", "#4B5563"].map((color) => (
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
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="text-lg font-medium w-12 text-center">
                  {quantity}
                </span>
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
                Try Virtually
              </Button>

              <Button size="lg" className="w-full text-lg">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                  Favorites
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Product Details</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 100% Organic Cotton</li>
                  <li>• Regular Fit</li>
                  <li>• Round Neck</li>
                  <li>• Short Sleeves</li>
                  <li>• Machine washable at 30°</li>
                  <li>• Ethically Made</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Shipping & Returns</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Free shipping on orders over $50</li>
                  <li>• Free returns within 30 days</li>
                  <li>• Ships within 24 hours</li>
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
              <button className="pb-4 text-gray-500">Reviews (128)</button>
              <button className="pb-4 text-gray-500">Size Guide</button>
            </div>
          </div>
          <div className="prose max-w-none">
            <p>
              Our premium organic cotton t-shirt is designed to offer maximum
              comfort while being environmentally friendly. Made with
              high-quality materials and GOTS certified, this t-shirt is perfect
              for daily use.
            </p>
            <p>
              The regular fit ensures comfortable wear for all body types. The
              breathable and soft fabric will keep you comfortable all day.
            </p>
          </div>
        </div>
      </div>

      {/* Try-On Widget Modal */}
      <TryOnWidget
        isOpen={isWidgetOpen}
        onClose={() => setIsWidgetOpen(false)}
      />
    </div>
  );
};

export default ProductDemo;
