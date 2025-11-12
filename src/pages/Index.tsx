import { useState, useEffect } from "react";
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
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAppBridge } from "@/providers/AppBridgeProvider";
import { showToast, getShopify } from "@/utils/appBridge";

const Index = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const { isReady, shopify } = useAppBridge();
  const [appBridgeStatus, setAppBridgeStatus] = useState<{
    initialized: boolean;
    user: any;
    config: any;
    error: string | null;
  }>({
    initialized: false,
    user: null,
    config: null,
    error: null,
  });

  // Test App Bridge initialization and APIs
  useEffect(() => {
    console.log("🔍 Index (/): Component mounted - Testing App Bridge...");
    console.log("🔍 Index (/): App Bridge state:", { isReady, shopifyExists: !!shopify });

    const testAppBridge = async () => {
      if (!isReady || !shopify) {
        console.log("⏳ Index (/): App Bridge not ready yet", { isReady, shopify });
        setAppBridgeStatus({
          initialized: false,
          user: null,
          config: null,
          error: isReady ? "Shopify object not available" : "App Bridge not ready",
        });
        return;
      }

      console.log("✅ Index (/): App Bridge is ready! Testing APIs...");
      console.log("📦 Index (/): Shopify object:", shopify);
      setAppBridgeStatus(prev => ({ ...prev, initialized: true, error: null }));

      try {
        // Test user API
        try {
          console.log("🔍 Index (/): Testing user API...");
          const user = await shopify.user();
          console.log("✅ Index (/): App Bridge user API works!", user);
          setAppBridgeStatus(prev => ({ ...prev, user, error: null }));
        } catch (error: any) {
          console.warn("⚠️ Index (/): Failed to get user:", error);
          setAppBridgeStatus(prev => ({
            ...prev,
            error: prev.error ? `${prev.error}; User API: ${error.message}` : `User API error: ${error.message}`,
          }));
        }

        // Test config API
        try {
          console.log("🔍 Index (/): Testing config API...");
          const config = await shopify.config();
          console.log("✅ Index (/): App Bridge config API works!", config);
          setAppBridgeStatus(prev => ({ ...prev, config }));
        } catch (error: any) {
          console.warn("⚠️ Index (/): Failed to get config:", error);
          setAppBridgeStatus(prev => ({
            ...prev,
            error: prev.error ? `${prev.error}; Config API: ${error.message}` : `Config API error: ${error.message}`,
          }));
        }

        // Test toast API (but don't show automatically to avoid spam)
        try {
          console.log("🔍 Index (/): Toast API available:", typeof shopify.toast?.show === "function");
          // Don't show toast automatically - user can click button to test
        } catch (error: any) {
          console.warn("⚠️ Index (/): Toast API not available:", error);
        }

        // Log completion after a brief delay to allow state updates
        setTimeout(() => {
          console.log("✅ Index (/): App Bridge test completed!");
        }, 100);
      } catch (error: any) {
        console.error("❌ Index (/): App Bridge test failed:", error);
        setAppBridgeStatus(prev => ({
          ...prev,
          error: error.message || "Unknown error",
        }));
      }
    };

    // Small delay to ensure App Bridge is fully initialized
    const timeoutId = setTimeout(() => {
      testAppBridge();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isReady, shopify]);

  // Log status changes
  useEffect(() => {
    if (appBridgeStatus.initialized) {
      console.log("📊 Index (/): App Bridge status updated:", {
        initialized: appBridgeStatus.initialized,
        hasUser: !!appBridgeStatus.user,
        hasConfig: !!appBridgeStatus.config,
        error: appBridgeStatus.error,
      });
    }
  }, [appBridgeStatus]);

  const handleTestAppBridge = async () => {
    console.log("🔘 Index (/): Test App Bridge button clicked");
    
    if (!shopify) {
      console.error("❌ Index (/): App Bridge not available");
      console.error("❌ Index (/): Current state:", { isReady, shopify });
      alert("App Bridge is not available. Check console for details.");
      return;
    }

    try {
      console.log("🔍 Index (/): Testing toast API...");
      // Test toast
      await shopify.toast.show("App Bridge is working correctly! ✅", {
        duration: 3000,
      });
      console.log("✅ Index (/): Test toast shown successfully");
    } catch (error: any) {
      console.error("❌ Index (/): Failed to show test toast:", error);
      alert(`Failed to show toast: ${error.message}. Check console for details.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* App Bridge Status Indicator */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {appBridgeStatus.initialized && shopify ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  App Bridge Status:
                </span>
                <span className="text-xs text-muted-foreground">
                  {appBridgeStatus.initialized && shopify
                    ? "✅ Initialized and Working"
                    : isReady
                    ? "⚠️ Ready but not initialized"
                    : "❌ Not Ready"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {appBridgeStatus.initialized && shopify && (
                <>
                  {appBridgeStatus.user && (
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      User: {appBridgeStatus.user.email || appBridgeStatus.user.name || "Unknown"}
                    </div>
                  )}
                  {appBridgeStatus.config && (
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      Shop: {appBridgeStatus.config.shop || "Unknown"}
                    </div>
                  )}
                  <Button
                    onClick={handleTestAppBridge}
                    variant="outline"
                    size="sm"
                    disabled={!shopify}
                    className="text-xs"
                  >
                    Test Toast
                  </Button>
                </>
              )}
            </div>
          </div>
          {(appBridgeStatus.error || (appBridgeStatus.initialized && !shopify)) && (
            <div className="mt-2 flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span>
                {appBridgeStatus.error || 
                 (appBridgeStatus.initialized && !shopify ? "App Bridge initialized but shopify object is null" : "")}
              </span>
            </div>
          )}
          {appBridgeStatus.initialized && shopify && !appBridgeStatus.error && (
            <div className="mt-2 flex items-center gap-2 text-xs text-success">
              <CheckCircle className="w-4 h-4" />
              <span>
                App Bridge is working correctly! APIs tested: User {appBridgeStatus.user ? "✅" : "❌"}, 
                Config {appBridgeStatus.config ? "✅" : "❌"}, Toast ✅
              </span>
            </div>
          )}
        </div>
      </div>

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
                Essayage Virtuel Alimenté par IA
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight px-2">
              TryON
              <span className="block text-primary mt-1 sm:mt-2">Application Shopify</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-6">
              Révolutionnez l'expérience d'achat avec notre technologie d'essayage virtuel
              IA. Permettez à vos clients de voir comment les vêtements leur vont
              avant d'acheter.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4 sm:px-0">
              <Button
                onClick={() => setIsWidgetOpen(true)}
                variant="tryon"
                size="lg"
                className="text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-8 h-11 sm:h-12 md:h-14 w-full sm:w-auto min-h-[44px]"
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Essayer Maintenant
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-sm sm:text-base md:text-lg h-11 sm:h-12 md:h-14 w-full sm:w-auto min-h-[44px]"
                onClick={() => (window.location.href = "/demo")}
              >
                Page Produit Démo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-foreground">Comment ça fonctionne</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">Un processus en 3 étapes simples</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7 md:gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-all duration-200 border-border">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded flex items-center justify-center shadow-sm">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-foreground">1. Téléchargez votre photo</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Choisissez une photo de vous ou utilisez une photo de démonstration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-200 border-border">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded flex items-center justify-center shadow-sm">
                  <Shirt className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-foreground">2. Sélectionnez un vêtement</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Choisissez le produit que vous souhaitez essayer sur la page
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-200 border-border">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded flex items-center justify-center shadow-sm">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-foreground">3. Générez votre essayage</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Notre IA crée une image réaliste de vous portant le vêtement
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-foreground">Avantages pour votre boutique</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Augmentez les ventes et réduisez les retours
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 md:gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: CheckCircle2,
                title: "Augmenter les conversions",
                description:
                  "Les clients qui voient comment les vêtements leur vont sont plus susceptibles d'acheter",
              },
              {
                icon: CheckCircle2,
                title: "Réduire les retours",
                description:
                  "Les clients savent exactement à quoi s'attendre, réduisant les retours",
              },
              {
                icon: CheckCircle2,
                title: "Expérience innovante",
                description:
                  "Offrez une expérience d'achat moderne qui distingue votre boutique",
              },
              {
                icon: CheckCircle2,
                title: "Installation facile",
                description:
                  "Intégration simple dans votre boutique Shopify existante",
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
            Prêt à transformer votre boutique ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-7 md:mb-8 opacity-90 px-4">
            Essayez NUSENSE TryON maintenant et voyez la différence
          </p>
          <Button
            onClick={() => setIsWidgetOpen(true)}
            size="lg"
            className="bg-card text-primary hover:bg-accent hover:text-accent-foreground text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 h-11 sm:h-12 md:h-14 min-h-[44px] w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Lancer la démo
          </Button>
        </div>
      </section>

      {/* Installation Instructions */}
      <section className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">
              Installation pour les boutiques Shopify
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Intégration facile dans votre boutique
            </p>
          </div>

          <Card className="p-4 sm:p-6 md:p-8">
            <CardHeader className="p-0 mb-4 sm:mb-5 md:mb-6">
              <CardTitle className="text-xl sm:text-2xl">Guide d'installation</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1 sm:mt-2">
                Suivez ces étapes simples pour intégrer l'application dans votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5 md:space-y-6 p-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                    1
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Ajoutez le bouton "Essayer"</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                      Ajoutez ce code à votre thème Shopify où vous souhaitez que le
                      bouton apparaisse (généralement dans le fichier product.liquid) :
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
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base text-foreground">Intégrez le widget</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Cette application peut être hébergée et intégrée via iframe
                      ou comme widget intégré dans votre boutique.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
                    3
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base text-foreground">Mode développement</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Pour tester en mode dev, utilisez les outils de développement Shopify et
                      pointez vers votre URL locale ou de staging.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-info/10 border border-info rounded p-3 sm:p-4">
                <p className="text-xs sm:text-sm">
                  <strong>💡 Note :</strong> Pour une intégration complète, contactez
                  notre équipe de support qui vous aidera à configurer l'application dans votre
                  boutique Shopify.
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
            Essayage Virtuel Alimenté par IA pour Shopify
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground/70">
            © {new Date().getFullYear()} NUSENSE TryON. Tous droits réservés.
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
