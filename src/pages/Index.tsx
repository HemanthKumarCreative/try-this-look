import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TryOnWidget from "@/components/TryOnWidget";
import {
  Sparkles,
  ShoppingBag,
  Zap,
  Image as ImageIcon,
  Shirt,
  CheckCircle2,
} from "lucide-react";

const Index = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-7 md:space-y-8">
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center font-extrabold tracking-wide text-3xl sm:text-4xl md:text-5xl leading-none" aria-label="NULOOK">
                <span style={{ color: "#ce0003" }}>NU</span>
                <span style={{ color: "#564646" }}>LOOK</span>
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-card border border-border rounded shadow-lg">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="font-semibold text-primary text-xs sm:text-sm md:text-base">
                AI-Powered Virtual Try-On
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight px-2">
              TryON
              <span className="block text-primary mt-1 sm:mt-2">Shopify App</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-6">
              Revolutionize the shopping experience with our AI virtual try-on
              technology. Let your customers see how clothing looks on them
              before buying.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4 sm:px-0">
              <Button
                onClick={() => setIsWidgetOpen(true)}
                variant="tryon"
                size="lg"
                className="text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-8 h-11 sm:h-12 md:h-14 w-full sm:w-auto min-h-[44px]"
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Try Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-sm sm:text-base md:text-lg h-11 sm:h-12 md:h-14 w-full sm:w-auto min-h-[44px]"
                onClick={() => (window.location.href = "/demo")}
              >
                Demo Product Page
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-foreground">How It Works</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">A simple 3-step process</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7 md:gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-all duration-200 border-border">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded flex items-center justify-center shadow-sm">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-foreground">1. Upload Your Photo</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Choose a photo of yourself or use a demo photo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-200 border-border">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded flex items-center justify-center shadow-sm">
                  <Shirt className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-foreground">2. Select Clothing</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Choose the product you want to try from the page
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-200 border-border">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded flex items-center justify-center shadow-sm">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-foreground">3. Generate Your Try-On</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Our AI creates a realistic image of you wearing the clothing
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-muted/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-foreground">Benefits for Your Store</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Increase sales and reduce returns
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 md:gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: CheckCircle2,
                title: "Increase Conversions",
                description:
                  "Customers who see how clothing looks on them are more likely to buy",
              },
              {
                icon: CheckCircle2,
                title: "Reduce Returns",
                description:
                  "Customers know exactly what to expect, reducing returns",
              },
              {
                icon: CheckCircle2,
                title: "Innovative Experience",
                description:
                  "Offer a modern shopping experience that sets your store apart",
              },
              {
                icon: CheckCircle2,
                title: "Easy Installation",
                description:
                  "Simple integration into your existing Shopify store",
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success/10 rounded flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-foreground">{benefit.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-primary to-primary-light text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Ready to Transform Your Store?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-7 md:mb-8 opacity-90 px-4">
            Try NUSENSE TryON now and see the difference
          </p>
          <Button
            onClick={() => setIsWidgetOpen(true)}
            size="lg"
            className="bg-card text-primary hover:bg-accent hover:text-accent-foreground text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 h-11 sm:h-12 md:h-14 min-h-[44px] w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Launch Demo
          </Button>
        </div>
      </section>

      {/* Installation Instructions */}
      <section className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">
              Installation for Shopify Stores
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Easily integrate into your store
            </p>
          </div>

          <Card className="p-4 sm:p-6 md:p-8">
            <CardHeader className="p-0 mb-4 sm:mb-5 md:mb-6">
              <CardTitle className="text-xl sm:text-2xl">Installation Guide</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1 sm:mt-2">
                Follow these simple steps to integrate the app into your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5 md:space-y-6 p-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                    1
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Add "Try Now" Button</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                      Add this code to your Shopify theme where you want the
                      button to appear (usually in the product.liquid file):
                    </p>
                    <pre className="bg-muted p-3 sm:p-4 rounded border border-border text-[10px] sm:text-xs overflow-x-auto">
                      {`<button id="nusense-tryon-btn" class="btn">
  <span>✨</span> Try Now
</button>`}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                    2
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base text-foreground">Integrate the Widget</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      This application can be hosted and integrated via iframe
                      or as an embedded widget in your store.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                    3
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base text-foreground">Development Mode</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      To test in dev mode, use Shopify development tools and
                      point to your local or staging URL.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-info/10 border border-info rounded p-3 sm:p-4">
                <p className="text-xs sm:text-sm">
                  <strong>💡 Note:</strong> For complete integration, contact
                  our support team who will help you configure the app in your
                  Shopify store.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0 text-primary" />
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">NUSENSE TryON</h3>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-5 md:mb-6">
            AI-Powered Virtual Try-On for Shopify
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground/70">
            © {new Date().getFullYear()} NUSENSE TryON. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Try-On Widget Modal */}
      <TryOnWidget
        isOpen={isWidgetOpen}
        onClose={() => setIsWidgetOpen(false)}
      />
    </div>
  );
};

export default Index;
