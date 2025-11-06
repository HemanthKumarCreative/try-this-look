# NUSENSE TryON - Shopify App

A complete Shopify app that enables AI-powered virtual try-on functionality for clothing stores. Customers can see how products look on them before purchasing.

## 🌟 Features

- ✨ **Full Shopify App** - Installable from Shopify App Store
- 🎨 **Theme App Extension** - Easy integration via theme editor
- 🔐 **OAuth Authentication** - Secure Shopify integration
- 📱 **Responsive Widget** - Works on all devices
- 🛒 **Cart Integration** - Direct add to cart from results
- ⚙️ **Customizable** - Merchants can customize button appearance
- 🚀 **Production Ready** - Fully functional and tested

## 🚀 Quick Start

### For Developers

```bash
# 1. Install dependencies
npm install
cd server && npm install && cd ..

# 2. Configure environment
cp .env.example .env
# Edit .env with your Shopify API credentials

# 3. Start development server
npm run shopify:dev
```

### For Merchants

1. **Install the app** from Shopify App Store
2. **Activate theme extension** in theme editor
3. **Customize button** appearance and settings
4. **Done!** Customers can now use virtual try-on

## 📦 What's Included

- ✅ Backend server with Shopify OAuth
- ✅ Theme App Extension (blocks & snippets)
- ✅ React frontend widget
- ✅ Widget loader script
- ✅ Complete documentation
- ✅ Production-ready configuration

## 📖 Documentation

- [Setup Guide](./SHOPIFY_APP_SETUP.md) - Complete installation instructions
- [Shopify Integration Guide](./SHOPIFY_INTEGRATION.md) - Integration details
- [API Documentation](./README.md) - API reference

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   Shopify Storefront (Theme)        │
│   - Button Block                    │
│   - Widget Script                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Shopify App (Backend)            │
│   - OAuth Authentication            │
│   - API Routes                      │
│   - Product Data                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   React Widget (Frontend)          │
│   - Try-On Interface                │
│   - Image Upload                    │
│   - Result Display                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Try-On API (External)            │
│   - AI Generation                   │
└─────────────────────────────────────┘
```

## 🔧 Configuration

The app supports various configuration options:

- **Button Customization**: Text, style, icon, width
- **Widget URL**: Custom widget deployment
- **Debug Mode**: Enable/disable logging
- **API Endpoints**: Configure try-on API

## 📝 License

© 2024 NUSENSE TryON. All rights reserved.

## 🤝 Support

For questions or issues:
- 📧 Email: support@nusense.com
- 📚 Documentation: See setup guides
- 🐛 Issues: Report via GitHub

---

**Made with ❤️ for Shopify merchants**

