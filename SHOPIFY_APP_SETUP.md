# NUSENSE TryON - Shopify App Setup Guide

Complete guide to convert and set up NUSENSE TryON as a full Shopify app that stores can install and use.

## 🚀 Prerequisites

- Node.js 18+ and npm
- Shopify CLI installed: `npm install -g @shopify/cli @shopify/theme`
- A Shopify Partner account (create at [partners.shopify.com](https://partners.shopify.com))
- A development store or access to a Shopify store

## 📦 Installation Steps

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Create Shopify App

1. **Create a new app in Partner Dashboard:**
   - Go to [partners.shopify.com](https://partners.shopify.com)
   - Navigate to Apps > Create app
   - Choose "Create app manually"
   - Name it "NUSENSE TryON"

2. **Get your API credentials:**
   - Copy your API Key and API Secret
   - You'll need these for the `.env` file

### Step 3: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your credentials:**
   ```env
   SHOPIFY_API_KEY=your_api_key_here
   SHOPIFY_API_SECRET=your_api_secret_here
   SHOPIFY_APP_URL=https://your-app-url.ngrok.io
   SCOPES=write_products,read_products,write_themes,read_themes
   PORT=3000
   NODE_ENV=development
   ```

### Step 4: Update Shopify App Configuration

Edit `shopify.app.toml` and update:
- `client_id`: Your Shopify API Key
- `application_url`: Your app URL (use ngrok for local development)
- `dev_store_url`: Your development store URL

### Step 5: Set Up ngrok (for Local Development)

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   # or download from https://ngrok.com
   ```

2. **Start ngrok:**
   ```bash
   ngrok http 3000
   ```

3. **Update `.env` with ngrok URL:**
   ```env
   SHOPIFY_APP_URL=https://your-ngrok-url.ngrok.io
   ```

4. **Update `shopify.app.toml` with ngrok URL**

### Step 6: Build the Frontend

```bash
npm run build
```

This creates the `dist/` folder with your compiled frontend.

### Step 7: Start the Backend Server

```bash
npm run server:dev
```

Or in production:
```bash
npm run server:start
```

### Step 8: Deploy with Shopify CLI

```bash
# Login to Shopify CLI
shopify auth login

# Start development server
shopify app dev

# Or deploy to production
shopify app deploy
```

## 🎯 App Installation

### For Merchants (Store Owners)

1. **Install from Partner Dashboard:**
   - Share your app listing URL with merchants
   - They can install from the Shopify App Store (once published)

2. **Install from Development Store:**
   - Go to your development store admin
   - Navigate to Apps > Develop apps
   - Find your app and click "Install"

3. **Activate Theme Extension:**
   - After installation, go to Online Store > Themes
   - Click "Customize" on your active theme
   - In the theme editor, click "App embeds"
   - Enable "NUSENSE TryON Button"
   - Save your changes

### Manual Theme Integration (Alternative)

If merchants prefer manual integration:

1. **Go to Online Store > Themes**
2. **Click Actions > Edit code**
3. **Add the button block:**
   - Navigate to `sections/`
   - Create or edit `main-product.liquid`
   - Add: `{% render 'nusense-tryon-button' %}`

4. **Add the script:**
   - Navigate to `layout/`
   - Edit `theme.liquid`
   - In `<head>`, add: `{% render 'nusense-tryon-script' %}`

## 📁 Project Structure

```
nusense-tryon-shopify-app/
├── server/                 # Backend server (Express + Shopify API)
│   ├── index.js           # Main server file
│   └── package.json       # Server dependencies
├── extensions/            # Shopify App Extensions
│   └── theme-app-extension/
│       ├── blocks/        # Theme blocks (button)
│       └── snippets/      # Liquid snippets (script)
├── src/                   # Frontend React app
│   ├── components/        # React components
│   ├── pages/            # Page components
│   └── services/         # API services
├── public/               # Static assets
│   └── nusense-tryon-widget.js  # Widget loader
├── dist/                 # Built frontend (generated)
├── shopify.app.toml      # Shopify app configuration
├── package.json          # Frontend dependencies
└── .env                  # Environment variables
```

## 🔧 Configuration

### App Settings

The app can be configured through:

1. **Shop Metafields:**
   - `nusense.widget_url`: Widget URL (default: your app URL)
   - `nusense.debug_mode`: Enable debug logging (true/false)

2. **Theme Block Settings:**
   - Button text
   - Button style (primary, secondary, outline, minimal)
   - Show/hide icon
   - Custom icon emoji
   - Full width toggle

### API Endpoints

- `GET /auth` - OAuth initiation
- `GET /auth/callback` - OAuth callback
- `POST /api/tryon/generate` - Generate try-on image
- `GET /api/products/:id` - Get product data

## 🚢 Deployment

### Development Deployment

1. Use ngrok for local testing
2. Run `shopify app dev` for development mode

### Production Deployment

1. **Deploy frontend:**
   - Build: `npm run build`
   - Deploy `dist/` folder to your hosting (Vercel, Netlify, etc.)

2. **Deploy backend:**
   - Deploy `server/` to a Node.js hosting service (Heroku, Railway, etc.)
   - Set environment variables on your hosting platform

3. **Deploy app:**
   ```bash
   shopify app deploy
   ```

4. **Update URLs:**
   - Update `shopify.app.toml` with production URLs
   - Update OAuth redirect URLs in Partner Dashboard
   - Update app proxy URL in Partner Dashboard

## ✅ Testing

### Test Installation

1. Install app on a development store
2. Activate theme extension
3. Visit a product page
4. Click "Try Now" button
5. Verify widget opens and functions correctly

### Test OAuth

1. Visit your app URL
2. Should redirect to Shopify OAuth
3. Complete OAuth flow
4. Verify you're redirected back to app

### Test Widget

1. Open product page
2. Click try-on button
3. Upload photo
4. Select clothing item
5. Generate try-on
6. Verify result displays correctly

## 🐛 Troubleshooting

### App Not Installing

- Check API credentials in `.env`
- Verify OAuth redirect URLs match in Partner Dashboard
- Ensure app URL is accessible (ngrok is running)

### Widget Not Loading

- Check browser console for errors
- Verify widget script URL is correct
- Check CORS settings on your server
- Ensure product data is available on page

### OAuth Errors

- Verify `SHOPIFY_API_KEY` and `SHOPIFY_API_SECRET` are correct
- Check redirect URLs match exactly
- Ensure scopes are correct in `shopify.app.toml`

### Build Errors

- Ensure all dependencies are installed
- Check Node.js version (18+)
- Clear `node_modules` and reinstall if needed

## 📚 Additional Resources

- [Shopify App Development](https://shopify.dev/docs/apps)
- [Shopify CLI Documentation](https://shopify.dev/docs/apps/tools/cli)
- [Theme App Extensions](https://shopify.dev/docs/apps/online-store/theme-app-extensions)
- [Shopify API Documentation](https://shopify.dev/docs/api)

## 🎉 Success!

Once installed, merchants can:
- Add the try-on button to product pages via theme editor
- Customize button appearance
- Customers can use virtual try-on on product pages
- Results can be shared and added to cart

---

**Need Help?** Contact support@nusense.com or check the documentation.

