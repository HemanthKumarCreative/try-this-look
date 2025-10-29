# NUSENSE TryON - Shopify Virtual Try-On App

![NUSENSE TryON Banner](https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&h=300&fit=crop)

A powerful AI-powered virtual try-on application for Shopify stores that allows customers to see how clothing items look on them before making a purchase. Built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

- ✨ **AI-Powered Try-On**: Generate realistic virtual try-on images in 30-60 seconds
- 📸 **Photo Upload**: Customers can upload their photos or use demo images
- 👕 **Auto-Detection**: Automatically detects product images from Shopify pages
- 🛒 **Cart Integration**: Direct integration with Shopify cart
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Customizable**: Brand colors and styling match your store
- 🌐 **English UI**: Built with English interface (easily customizable)
- ⚡ **Fast & Efficient**: Optimized for performance with real-time progress tracking

## 🎯 Use Cases

Perfect for:
- Fashion e-commerce stores
- Clothing boutiques
- Online retail shops
- Apparel brands
- Fashion marketplaces

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- A Shopify store (for integration)
- Backend API endpoint (already configured)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

## 📦 Project Structure

```
src/
├── components/
│   ├── TryOnWidget.tsx          # Main widget component
│   ├── PhotoUpload.tsx          # Photo upload interface
│   ├── ClothingSelection.tsx    # Clothing selection gallery
│   ├── GenerationProgress.tsx   # Progress tracker
│   └── ResultDisplay.tsx        # Results and actions
├── services/
│   └── tryonApi.ts             # Backend API integration
├── utils/
│   ├── storage.ts              # LocalStorage management
│   └── shopifyIntegration.ts   # Shopify product extraction
├── types/
│   └── tryon.ts                # TypeScript type definitions
├── pages/
│   └── Index.tsx               # Main landing page
└── index.css                    # Design system & theme
```

## 🎨 Design System

The app uses a comprehensive design system with NUSENSE brand colors:

### Brand Colors
- **Primary Red**: `#ce0003` (0 99% 40% HSL)
- **Secondary Brown**: `#564646` (0 13% 32% HSL)

### Semantic Colors
- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Info: `#3b82f6`

All colors are defined in `src/index.css` and can be customized.

## 🔌 Shopify Integration

### Option 1: Embedded Widget (Recommended for Development)

1. **Add Try-On Button** in your product template (`sections/main-product.liquid`):

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
  "
>
  ✨ Try Now
</button>
```

2. **Host the Application** and embed it as an iframe or use Shopify's App Embed feature

### Option 2: Full Shopify App

Convert this to a full Shopify app using:
- Shopify CLI
- App Bridge
- Theme App Extensions

See `INSTALLATION.md` for detailed instructions.

## 🔄 API Integration

The app integrates with the existing backend API:

**Endpoint**: `https://try-on-server-v1.onrender.com/api/fashion-photo`

**Request Format**:
```javascript
POST /api/fashion-photo
Content-Type: multipart/form-data

Body:
- personImage: File (user's photo)
- clothingImage: Blob (product image)
```

**Response Format**:
```json
{
  "status": "success",
  "image": "data:image/jpeg;base64,..." // Generated image
}
```

## 📱 User Flow

1. Customer clicks "Try Now" button on product page
2. Upload their photo or select demo
3. App automatically detects product images
4. Select clothing item to try on
5. Click "Generate" to create virtual try-on
6. View result with options to:
   - Download image
   - Add to cart
   - Share on social media
   - Try another item

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React hooks
- **API**: Fetch API with CORS handling
- **Storage**: LocalStorage for session persistence
- **Build Tool**: Vite

## 🎯 Key Components

### TryOnWidget
Main orchestrator component managing the entire try-on flow.

### PhotoUpload
Handles photo upload with drag-and-drop support and demo photos.

### ClothingSelection
Displays detected product images in a responsive grid.

### GenerationProgress
Shows real-time progress with 5-step indicator and loading messages.

### ResultDisplay
Presents generated image with action buttons.

## 🧪 Testing

### Development Testing

1. **Local Testing**: Run `npm run dev` and test all flows
2. **Product Detection**: Test on various Shopify product pages
3. **Image Upload**: Test with different image formats and sizes
4. **API Integration**: Verify backend communication

### Shopify Store Testing

1. Create a Shopify development store
2. Use ngrok to expose local server: `ngrok http 8080`
3. Integrate ngrok URL in your dev store theme
4. Test complete flow in actual Shopify environment

## 📊 Performance

- **Lazy Loading**: Images load on demand
- **Code Splitting**: Optimized bundle size
- **Progress Tracking**: Real-time updates every 2 seconds
- **Caching**: Results cached in LocalStorage
- **Optimized Images**: Automatic compression before upload

## 🔒 Security

- ✅ Image validation (type and size)
- ✅ CORS handling for external images
- ✅ Secure API communication
- ✅ No sensitive data stored
- ✅ Client-side image processing

## 📈 Business Benefits

- **Increase Conversions**: Customers see how items look on them
- **Reduce Returns**: Better expectation management
- **Enhanced Experience**: Modern, engaging shopping experience
- **Competitive Edge**: Stand out with AI technology
- **Customer Insights**: Track popular try-on items

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

© 2024 NUSENSE TryON. All rights reserved.

## 🤝 Support

For questions, issues, or feature requests:

- 📧 Email: support@nusense.com
- 📝 Documentation: See `INSTALLATION.md`
- 💬 Issues: Open a GitHub issue

## 🎓 Documentation

- [Installation Guide](./INSTALLATION.md) - Detailed Shopify integration
- [API Documentation](https://try-on-server-v1.onrender.com/docs) - Backend API docs
- [Component Guide](./docs/components.md) - Component documentation
- [Customization Guide](./docs/customization.md) - Styling and branding

## 🚀 Deployment

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Hosting Options

- Vercel (recommended)
- Netlify
- Cloudflare Pages
- AWS Amplify
- Custom server

### Environment Configuration

No environment variables needed - the API endpoint is hardcoded. For production, consider adding:

```env
VITE_API_ENDPOINT=https://your-api-endpoint.com
```

## 🎨 Customization

### Changing Brand Colors

Edit `src/index.css`:

```css
:root {
  --primary: YOUR_HUE YOUR_SAT% YOUR_LIGHT%;
  --secondary: YOUR_HUE YOUR_SAT% YOUR_LIGHT%;
}
```

### Changing Text

All text strings are in the components. For multi-language support, implement an i18n solution.

### Adding Features

The modular architecture makes it easy to:
- Add new steps to the flow
- Integrate additional APIs
- Customize the UI
- Add analytics tracking

## 📸 Screenshots

*(Demo screenshots would go here)*

## 🎉 Credits

Built with:
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Vite

---

**Made with ❤️ for Shopify merchants**
