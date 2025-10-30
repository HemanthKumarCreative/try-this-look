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
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-50 to-muted">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex items-center justify-center">
              <img src="/assets/NUSENSE_LOGO.svg" alt="NUSENSE" className="h-10 w-auto" />
            </div>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">
                AI-Powered Virtual Try-On
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              TryON
              <span className="block text-primary mt-2">Shopify App</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Revolutionize the shopping experience with our AI virtual try-on
              technology. Let your customers see how clothing looks on them
              before buying.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => setIsWidgetOpen(true)}
                variant="tryon"
                size="lg"
                className="text-lg px-8"
              >
                <Sparkles className="w-6 h-6" />
                Try Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg"
                onClick={() => (window.location.href = "/demo")}
              >
                Demo Product Page
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">A simple 3-step process</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>1. Upload Your Photo</CardTitle>
                <CardDescription>
                  Choose a photo of yourself or use a demo photo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shirt className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>2. Select Clothing</CardTitle>
                <CardDescription>
                  Choose the product you want to try from the page
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>3. Generate Your Try-On</CardTitle>
                <CardDescription>
                  Our AI creates a realistic image of you wearing the clothing
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Benefits for Your Store</h2>
            <p className="text-xl text-gray-600">
              Increase sales and reduce returns
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-success" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Store?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Try NUSENSE TryON now and see the difference
          </p>
          <Button
            onClick={() => setIsWidgetOpen(true)}
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 text-lg px-10"
          >
            <Sparkles className="w-6 h-6" />
            Launch Demo
          </Button>
        </div>
      </section>

      {/* Installation Instructions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Installation for Shopify Stores
            </h2>
            <p className="text-xl text-gray-600">
              Easily integrate into your store
            </p>
          </div>

          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl">Installation Guide</CardTitle>
              <CardDescription>
                Follow these simple steps to integrate the app into your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Add "Try Now" Button</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Add this code to your Shopify theme where you want the
                      button to appear (usually in the product.liquid file):
                    </p>
                    <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                      {`<button id="nusense-tryon-btn" class="btn">
  <span>✨</span> Try Now
</button>`}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Integrate the Widget</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      This application can be hosted and integrated via iframe
                      or as an embedded widget in your store.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Development Mode</h4>
                    <p className="text-sm text-gray-600">
                      To test in dev mode, use Shopify development tools and
                      point to your local or staging URL.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-info/10 border border-info rounded-lg p-4">
                <p className="text-sm">
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h3 className="text-2xl font-bold">NUSENSE TryON</h3>
          </div>
          <p className="text-gray-400 mb-6">
            AI-Powered Virtual Try-On for Shopify
          </p>
          <p className="text-sm text-gray-500">
            © 2024 NUSENSE TryON. All rights reserved.
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
