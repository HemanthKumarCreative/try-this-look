import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TryOnWidget from '@/components/TryOnWidget';
import { Sparkles, ShoppingBag, Zap, Image as ImageIcon, Shirt, CheckCircle2 } from 'lucide-react';

const Index = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-50 to-muted">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Essayage Virtuel Alimenté par IA</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              NUSENSE TryON
              <span className="block text-primary mt-2">Shopify App</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Révolutionnez l'expérience d'achat avec notre technologie d'essayage virtuel IA. 
              Laissez vos clients voir comment les vêtements leur vont avant d'acheter.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => setIsWidgetOpen(true)}
                variant="tryon"
                size="lg"
                className="text-lg px-8"
              >
                <Sparkles className="w-6 h-6" />
                Essayer Maintenant
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg"
                onClick={() => window.location.href = '/demo'}
              >
                Page Produit Démo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comment Ça Marche</h2>
            <p className="text-xl text-gray-600">Un processus simple en 3 étapes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>1. Téléchargez Votre Photo</CardTitle>
                <CardDescription>
                  Choisissez une photo de vous ou utilisez une photo de démonstration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shirt className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>2. Sélectionnez un Vêtement</CardTitle>
                <CardDescription>
                  Choisissez le produit que vous voulez essayer depuis la page
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>3. Générez Votre Essayage</CardTitle>
                <CardDescription>
                  Notre IA crée une image réaliste de vous portant le vêtement
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
            <h2 className="text-4xl font-bold mb-4">Avantages Pour Votre Boutique</h2>
            <p className="text-xl text-gray-600">Augmentez vos ventes et réduisez les retours</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: CheckCircle2,
                title: 'Augmentez les Conversions',
                description: 'Les clients qui voient comment les vêtements leur vont sont plus susceptibles d\'acheter',
              },
              {
                icon: CheckCircle2,
                title: 'Réduisez les Retours',
                description: 'Les clients savent exactement à quoi s\'attendre, réduisant ainsi les retours',
              },
              {
                icon: CheckCircle2,
                title: 'Expérience Innovante',
                description: 'Offrez une expérience d\'achat moderne qui démarque votre boutique',
              },
              {
                icon: CheckCircle2,
                title: 'Installation Facile',
                description: 'Intégration simple dans votre boutique Shopify existante',
              },
            ].map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
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
          <h2 className="text-4xl font-bold mb-4">Prêt à Transformer Votre Boutique?</h2>
          <p className="text-xl mb-8 opacity-90">
            Essayez NUSENSE TryON dès maintenant et voyez la différence
          </p>
          <Button
            onClick={() => setIsWidgetOpen(true)}
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 text-lg px-10"
          >
            <Sparkles className="w-6 h-6" />
            Lancer la Démo
          </Button>
        </div>
      </section>

      {/* Installation Instructions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Installation pour Boutiques Shopify</h2>
            <p className="text-xl text-gray-600">Intégrez facilement dans votre boutique</p>
          </div>

          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl">Guide d'Installation</CardTitle>
              <CardDescription>Suivez ces étapes simples pour intégrer l'app dans votre boutique</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Ajoutez le Bouton "Essayer Maintenant"</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Ajoutez ce code dans votre thème Shopify là où vous voulez que le bouton apparaisse (généralement dans le fichier product.liquid):
                    </p>
                    <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
{`<button id="nusense-tryon-btn" class="btn">
  <span>✨</span> Essayer Maintenant
</button>`}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Intégrez le Widget</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Cette application peut être hébergée et intégrée via un iframe ou en tant que widget embarqué dans votre boutique.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Mode Développement</h4>
                    <p className="text-sm text-gray-600">
                      Pour tester en mode dev, utilisez les outils de développement Shopify et pointez vers votre URL locale ou de staging.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-info/10 border border-info rounded-lg p-4">
                <p className="text-sm">
                  <strong>💡 Note:</strong> Pour une intégration complète, contactez notre équipe de support qui vous aidera à configurer l'app dans votre boutique Shopify.
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
          <p className="text-gray-400 mb-6">Essayage Virtuel Alimenté par IA pour Shopify</p>
          <p className="text-sm text-gray-500">
            © 2024 NUSENSE TryON. Tous droits réservés.
          </p>
        </div>
      </footer>

      {/* Try-On Widget Modal */}
      <TryOnWidget isOpen={isWidgetOpen} onClose={() => setIsWidgetOpen(false)} />
    </div>
  );
};

export default Index;
