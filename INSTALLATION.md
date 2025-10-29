# NUSENSE TryON - Guide d'Installation Shopify

## Vue d'Ensemble

NUSENSE TryON est une application d'essayage virtuel alimentée par IA conçue pour s'intégrer dans les boutiques Shopify. Cette application permet aux clients de voir comment les vêtements leur vont avant d'acheter, augmentant ainsi les conversions et réduisant les retours.

## Fonctionnalités Principales

- ✨ **Essayage Virtuel IA**: Génération d'images réalistes en 30-60 secondes
- 📸 **Upload de Photo**: Les clients peuvent télécharger leur photo ou utiliser des démos
- 👕 **Détection Automatique**: Détecte automatiquement les images de produits sur la page
- 🛒 **Intégration Panier**: Ajout direct au panier Shopify
- 📱 **Responsive**: Fonctionne sur desktop, tablette et mobile
- 🎨 **Personnalisable**: S'adapte au design de votre boutique

## Prérequis

- Une boutique Shopify (plan Basic ou supérieur)
- Accès au code du thème Shopify
- Backend API déjà configuré (https://try-on-server-v1.onrender.com/api/fashion-photo)

## Installation en Mode Développement

### Option 1: Intégration Directe dans le Thème

1. **Accédez à l'éditeur de thème Shopify**
   - Allez dans `Online Store > Themes`
   - Cliquez sur `Actions > Edit code` sur votre thème actif

2. **Ajoutez le bouton "Essayer Maintenant"**
   - Ouvrez le fichier `sections/main-product.liquid` ou `product-template.liquid`
   - Ajoutez ce code où vous voulez que le bouton apparaisse (généralement après le bouton "Ajouter au panier"):

   ```liquid
   <button 
     id="nusense-tryon-btn" 
     class="btn btn-primary"
     style="
       background: linear-gradient(135deg, #ce0003, #ff1a1d);
       color: white;
       border: none;
       padding: 12px 24px;
       border-radius: 8px;
       cursor: pointer;
       font-weight: 600;
       display: inline-flex;
       align-items: center;
       gap: 8px;
       transition: all 0.2s;
     "
     onmouseover="this.style.transform='scale(1.05)'"
     onmouseout="this.style.transform='scale(1)'"
   >
     <span>✨</span> Essayer Maintenant
   </button>
   ```

3. **Intégrez le widget**
   - Créez un nouveau snippet: `snippets/nusense-tryon-widget.liquid`
   - Ajoutez ce code:

   ```liquid
   <div id="nusense-tryon-root"></div>
   
   <script>
     document.getElementById('nusense-tryon-btn').addEventListener('click', function() {
       // Logique pour ouvrir le widget
       window.postMessage({ type: 'OPEN_TRYON_WIDGET' }, '*');
     });
   </script>
   ```

4. **Incluez le snippet dans votre template produit**
   ```liquid
   {% render 'nusense-tryon-widget' %}
   ```

### Option 2: Intégration via App Embed

Pour une intégration plus professionnelle, cette application peut être convertie en Shopify App avec App Embed:

1. **Configurez l'App Shopify**
   - Créez une nouvelle app dans le Shopify Partners Dashboard
   - Configurez les App Extensions avec Theme App Extension
   - Déployez cette application React comme widget embarqué

2. **Installation depuis l'App Store**
   - Les marchands pourront installer l'app directement
   - Activation via le Theme Editor (App Embeds)

## Configuration en Mode Dev

### Démarrage Local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# L'application sera accessible sur http://localhost:8080
```

### Test dans une Boutique Dev

1. **Créez une boutique de développement**
   - Allez sur partners.shopify.com
   - Créez une Development Store

2. **Utilisez ngrok pour exposer votre serveur local**
   ```bash
   ngrok http 8080
   ```

3. **Intégrez l'URL ngrok dans votre boutique**
   - Utilisez l'URL fournie par ngrok dans votre thème Shopify
   - Testez le widget en mode développement

## Structure du Projet

```
src/
├── components/
│   ├── TryOnWidget.tsx          # Widget principal
│   ├── PhotoUpload.tsx          # Upload de photo
│   ├── ClothingSelection.tsx    # Sélection de vêtements
│   ├── GenerationProgress.tsx   # Barre de progression
│   └── ResultDisplay.tsx        # Affichage des résultats
├── services/
│   └── tryonApi.ts             # Appels API backend
├── utils/
│   ├── storage.ts              # LocalStorage management
│   └── shopifyIntegration.ts   # Extraction produits Shopify
└── types/
    └── tryon.ts                # Définitions TypeScript
```

## Fonctionnement

### Flux Utilisateur

1. **Étape 1**: L'utilisateur clique sur "Essayer Maintenant" sur une page produit
2. **Étape 2**: Le widget s'ouvre et demande d'uploader une photo
3. **Étape 3**: L'application détecte automatiquement les images de vêtements
4. **Étape 4**: L'utilisateur sélectionne un vêtement
5. **Étape 5**: Clic sur "Générer" lance l'API de génération
6. **Étape 6**: Affichage du résultat avec options (télécharger, ajouter au panier, partager)

### API Backend

L'application utilise l'API existante:

```javascript
POST https://try-on-server-v1.onrender.com/api/fashion-photo

Headers:
- Content-Type: multipart/form-data
- Accept-Language: fr-FR,fr;q=0.9,en;q=0.8
- Content-Language: fr

Body (FormData):
- personImage: File (photo de la personne)
- clothingImage: Blob (image du vêtement)

Response:
{
  "status": "success",
  "image": "data:image/jpeg;base64,..." // Image générée en base64
}
```

## Personnalisation

### Couleurs de la Marque

Les couleurs sont définies dans `src/index.css`:

```css
:root {
  --primary: 0 99% 40%;      /* #ce0003 - Rouge NUSENSE */
  --secondary: 0 13% 32%;     /* #564646 - Brun/Gris */
}
```

Modifiez ces valeurs pour correspondre à votre marque.

### Textes et Traductions

Tous les textes sont en français. Pour ajouter d'autres langues, créez un système de traduction dans `src/i18n/`.

## Sécurité et Performance

### Considérations de Sécurité

- ✅ Les images sont traitées côté serveur
- ✅ Validation des types de fichiers
- ✅ Limite de taille de fichier (10MB)
- ✅ Gestion CORS pour les images externes

### Optimisation Performance

- ✅ Images lazy-loaded
- ✅ Compression des images avant upload
- ✅ Cache des résultats générés
- ✅ Progress tracking en temps réel

## Dépannage

### Problèmes Courants

**Le bouton n'apparaît pas**
- Vérifiez que le code est bien ajouté dans le bon fichier template
- Vérifiez la console pour des erreurs JavaScript

**Les images de produits ne sont pas détectées**
- Assurez-vous d'être sur une page produit Shopify standard
- Vérifiez que les images ont des dimensions suffisantes (>200x200px)

**Erreur de génération**
- Vérifiez que l'API backend est accessible
- Vérifiez la console pour des erreurs CORS
- Assurez-vous que les deux images sont valides

## Support

Pour toute question ou problème:
- 📧 Email: support@nusense.com
- 📝 Documentation: https://docs.nusense.com
- 💬 Discord: https://discord.gg/nusense

## Licence

© 2024 NUSENSE TryON. Tous droits réservés.
