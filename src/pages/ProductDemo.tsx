import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TryOnWidget from "@/components/TryOnWidget";
import {
  extractProductImages,
  initializeImageExtractionListener,
} from "@/utils/shopifyIntegration";
import { Sparkles, ShoppingCart, Heart, Share2, Star } from "lucide-react";

/**
 * Demo Product Page Component
 * This simulates a typical Shopify product page for testing the Try-On widget
 */
const ProductDemo = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [productImages, setProductImages] = useState<string[]>([]);

  useEffect(() => {
    // Initialize image extraction listener for iframe communication
    initializeImageExtractionListener();

    // Extract real product images from the page
    const images = extractProductImages();
    setProductImages(images);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary truncate min-w-0">DEMO STORE</h1>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
              <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 min-w-[44px] sm:min-w-[44px]">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 min-w-[44px] sm:min-w-[44px]">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
        <div className="text-xs sm:text-sm text-muted-foreground truncate">
          Home / Clothing / Tops /{" "}
          <span className="text-foreground">Premium T-Shirt</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-7 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-3 sm:space-y-4">
            {productImages.length > 0 ? (
              <>
                <Card className="overflow-hidden">
                  <div className="w-full aspect-[4/3] sm:aspect-[3/2] bg-muted/30 border border-border flex items-center justify-center shadow-sm">
                    <img
                      src={productImages[0]}
                      alt="Premium T-Shirt"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </Card>
                {productImages.length > 1 && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    {productImages.slice(1, 5).map((img, i) => (
                      <Card
                        key={i}
                        className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary"
                      >
                        <div className="w-full aspect-square bg-muted/30 border border-border flex items-center justify-center overflow-hidden">
                          <img
                            src={img}
                            alt={`View ${i + 1}`}
                            className="h-full w-auto object-contain"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Fallback demo images when no product images are detected */}
                <Card className="overflow-hidden">
                  <div className="w-full aspect-[4/3] sm:aspect-[3/2] bg-muted/30 border border-border flex items-center justify-center shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&crop=center"
                      alt="Premium T-Shirt"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </Card>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=200&h=200&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1576566588028-43ea1fd157cf?w=200&h=200&fit=crop&crop=center",
                  ].map((img, i) => (
                    <Card
                      key={i}
                      className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-200 border-border"
                    >
                      <div className="w-full aspect-square bg-muted/30 border border-border flex items-center justify-center overflow-hidden">
                        <img
                          src={img}
                          alt={`View ${i + 1}`}
                          className="h-full w-auto object-contain"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
                <Card className="p-3 sm:p-4 bg-info/10 border-info">
                  <p className="text-xs sm:text-sm text-info">
                    <strong>Demo Mode:</strong> Using sample images. In a real
                    Shopify store, product images would be automatically
                    detected from the page.
                  </p>
                </Card>
              </>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                Premium Cotton T-Shirt
              </h1>
              <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-yellow-400 text-yellow-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  (128 reviews)
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">$49.99</div>
              <p className="text-xs sm:text-sm text-muted-foreground line-through">
                $69.99
              </p>
            </div>

            <div className="border-t border-b border-border py-3 sm:py-4">
              <p className="text-sm sm:text-base text-muted-foreground">
                Premium organic cotton t-shirt with regular fit. Made
                sustainably with high-quality materials. Perfect for a casual
                and comfortable style.
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Size</h3>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <Button key={size} variant="outline" className="w-10 h-10 sm:w-12 sm:h-12 text-xs sm:text-sm min-w-[44px] min-h-[44px]">
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Color</h3>
              <div className="flex gap-2">
                {["#000000", "#FFFFFF", "#CE0003", "#4B5563"].map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 hover:scale-110 transition-transform min-w-[44px] min-h-[44px]"
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Quantity</h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 min-w-[44px] min-h-[44px]"
                  aria-label="Decrease quantity"
                >
                  <span className="text-base sm:text-lg md:text-xl">-</span>
                </Button>
                <span className="text-base sm:text-lg md:text-xl font-medium w-10 sm:w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 min-w-[44px] min-h-[44px]"
                  aria-label="Increase quantity"
                >
                  <span className="text-base sm:text-lg md:text-xl">+</span>
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3">
              <Button
                onClick={() => setIsWidgetOpen(true)}
                variant="tryon"
                size="lg"
                className="w-full text-sm sm:text-base md:text-lg h-11 sm:h-12 md:h-14 min-h-[44px]"
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Try Virtually
              </Button>

              <Button size="lg" className="w-full text-sm sm:text-base md:text-lg h-11 sm:h-12 md:h-14 min-h-[44px]">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Add to Cart
              </Button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <Button variant="outline" size="lg" className="h-11 sm:h-12 md:h-14 min-h-[44px] text-sm sm:text-base">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Favorites
                </Button>
                <Button variant="outline" size="lg" className="h-11 sm:h-12 md:h-14 min-h-[44px] text-sm sm:text-base">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <Card className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base md:text-lg text-foreground">Product Details</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>• 100% Organic Cotton</li>
                  <li>• Regular Fit</li>
                  <li>• Round Neck</li>
                  <li>• Short Sleeves</li>
                  <li>• Machine washable at 30°</li>
                  <li>• Ethically Made</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base md:text-lg text-foreground">Shipping & Returns</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>• Free shipping on orders over $50</li>
                  <li>• Free returns within 30 days</li>
                  <li>• Ships within 24 hours</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <div className="border-b border-border mb-4 sm:mb-6 md:mb-8">
            <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide">
              <button className="pb-3 sm:pb-4 border-b-2 border-primary font-semibold text-sm sm:text-base text-primary whitespace-nowrap flex-shrink-0 transition-colors">
                Description
              </button>
              <button className="pb-3 sm:pb-4 text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-primary/30 text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-colors">Reviews (128)</button>
              <button className="pb-3 sm:pb-4 text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-primary/30 text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-colors">Size Guide</button>
            </div>
          </div>
          <div className="prose max-w-none text-sm sm:text-base">
            <p className="mb-3 sm:mb-4">
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
