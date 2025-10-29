# NUSENSE TryON - Shopify Installation Guide

## Overview

NUSENSE TryON is an AI-powered virtual try-on application designed to integrate into Shopify stores. This application allows customers to see how clothing items look on them before purchasing, increasing conversions and reducing returns.

## Key Features

- ✨ **AI Virtual Try-On**: Generate realistic images in 30-60 seconds
- 📸 **Photo Upload**: Customers can upload their photos or use demo images
- 👕 **Auto-Detection**: Automatically detects product images from the page
- 🛒 **Cart Integration**: Direct integration with Shopify cart
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- 🎨 **Customizable**: Adapts to your store's design

## Prerequisites

- A Shopify store (Basic plan or higher)
- Access to Shopify theme code
- Backend API already configured (https://try-on-server-v1.onrender.com/api/fashion-photo)

## Development Mode Installation

### Option 1: Direct Theme Integration

1. **Access Shopify theme editor**
   - Go to `Online Store > Themes`
   - Click `Actions > Edit code` on your active theme

2. **Add "Try Now" button**
   - Open the file `sections/main-product.liquid` or `product-template.liquid`
   - Add this code where you want the button to appear (usually after the "Add to cart" button):

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
     <span>✨</span> Try Now
   </button>
   ```

3. **Integrate the widget**
   - Create a new snippet: `snippets/nusense-tryon-widget.liquid`
   - Add this code:

   ```liquid
   <div id="nusense-tryon-root"></div>
   
   <script>
     document.getElementById('nusense-tryon-btn').addEventListener('click', function() {
       // Logic to open the widget
       window.postMessage({ type: 'OPEN_TRYON_WIDGET' }, '*');
     });
   </script>
   ```

4. **Include the snippet in your product template**
   ```liquid
   {% render 'nusense-tryon-widget' %}
   ```

### Option 2: App Embed Integration

For a more professional integration, this application can be converted to a Shopify App with App Embed:

1. **Configure Shopify App**
   - Create a new app in the Shopify Partners Dashboard
   - Configure App Extensions with Theme App Extension
   - Deploy this React application as an embedded widget

2. **Installation from App Store**
   - Merchants can install the app directly
   - Activation via Theme Editor (App Embeds)

## Development Mode Configuration

### Local Startup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Application will be accessible at http://localhost:8080
```

### Testing in a Dev Store

1. **Create a development store**
   - Go to partners.shopify.com
   - Create a Development Store

2. **Use ngrok to expose your local server**
   ```bash
   ngrok http 8080
   ```

3. **Integrate ngrok URL in your store**
   - Use the URL provided by ngrok in your Shopify theme
   - Test the widget in development mode

## Project Structure

```
src/
├── components/
│   ├── TryOnWidget.tsx          # Main widget
│   ├── PhotoUpload.tsx          # Photo upload
│   ├── ClothingSelection.tsx    # Clothing selection
│   ├── GenerationProgress.tsx   # Progress bar
│   └── ResultDisplay.tsx        # Results display
├── services/
│   └── tryonApi.ts             # Backend API calls
├── utils/
│   ├── storage.ts              # LocalStorage management
│   └── shopifyIntegration.ts   # Shopify product extraction
└── types/
    └── tryon.ts                # TypeScript definitions
```

## How It Works

### User Flow

1. **Step 1**: User clicks "Try Now" on a product page
2. **Step 2**: Widget opens and asks to upload a photo
3. **Step 3**: Application automatically detects clothing images
4. **Step 4**: User selects a clothing item
5. **Step 5**: Click "Generate" launches the generation API
6. **Step 6**: Display result with options (download, add to cart, share)

### Backend API

The application uses the existing API:

```javascript
POST https://try-on-server-v1.onrender.com/api/fashion-photo

Headers:
- Content-Type: multipart/form-data
- Accept-Language: en-US,en;q=0.9
- Content-Language: en

Body (FormData):
- personImage: File (person's photo)
- clothingImage: Blob (clothing image)

Response:
{
  "status": "success",
  "image": "data:image/jpeg;base64,..." // Generated image in base64
}
```

## Customization

### Brand Colors

Colors are defined in `src/index.css`:

```css
:root {
  --primary: 0 99% 40%;      /* #ce0003 - NUSENSE Red */
  --secondary: 0 13% 32%;     /* #564646 - Brown/Gray */
}
```

Modify these values to match your brand.

### Texts and Translations

All texts are in English. To add other languages, create a translation system in `src/i18n/`.

## Security and Performance

### Security Considerations

- ✅ Images are processed server-side
- ✅ File type validation
- ✅ File size limit (10MB)
- ✅ CORS handling for external images

### Performance Optimization

- ✅ Lazy-loaded images
- ✅ Image compression before upload
- ✅ Cache for generated results
- ✅ Real-time progress tracking

## Troubleshooting

### Common Issues

**Button doesn't appear**
- Check that the code is properly added in the correct template file
- Check console for JavaScript errors

**Product images are not detected**
- Make sure you're on a standard Shopify product page
- Check that images have sufficient dimensions (>200x200px)

**Generation error**
- Check that the backend API is accessible
- Check console for CORS errors
- Make sure both images are valid

## Support

For any questions or issues:
- 📧 Email: support@nusense.com
- 📝 Documentation: https://docs.nusense.com
- 💬 Discord: https://discord.gg/nusense

## License

© 2024 NUSENSE TryON. All rights reserved.