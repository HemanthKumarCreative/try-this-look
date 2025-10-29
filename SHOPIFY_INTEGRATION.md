# NUSENSE TryON - Complete Shopify Integration Guide

This guide provides step-by-step instructions for integrating the NUSENSE TryON virtual try-on widget into your Shopify store.

## 🚀 Quick Start (5 Minutes)

### Option 1: Simple Button Integration

1. **Add the widget script** to your theme's `theme.liquid` file (in the `</head>` section):

```liquid
<!-- NUSENSE TryON Widget -->
<script>
  window.NUSENSE_CONFIG = {
    widgetUrl: 'https://your-domain.com', // Replace with your deployed app URL
    debug: false,
    autoDetect: true
  };
</script>
<script src="https://your-domain.com/nusense-tryon-widget.js" async defer></script>
```

2. **Add the button** to your product template (`sections/main-product.liquid` or `product-template.liquid`):

```liquid
<!-- Add this where you want the button to appear -->
<button id="nusense-tryon-btn" class="btn btn-primary">
  <span>✨</span> Try Now
</button>
```

3. **Deploy your app** and update the `widgetUrl` in the script above.

### Option 2: Advanced Integration with Liquid Templates

1. **Copy the Liquid templates** from the `shopify-templates/` folder to your theme
2. **Include the templates** in your product template:

```liquid
<!-- Include the button -->
{% render 'nusense-tryon-button' %}

<!-- Include the script -->
{% render 'nusense-tryon-script' %}
```

## 📋 Detailed Integration Steps

### Step 1: Deploy Your Application

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to your hosting platform** (Vercel, Netlify, etc.):
   - Upload the `dist/` folder contents
   - Note your deployment URL (e.g., `https://nusense-tryon.vercel.app`)

3. **Update the widget URL** in all integration files

### Step 2: Theme Integration

#### Method A: Manual Integration

1. **Access your theme editor**:
   - Go to `Online Store > Themes`
   - Click `Actions > Edit code`

2. **Add the widget script** to `theme.liquid`:
   ```liquid
   <!-- Add before </head> -->
   <script>
     window.NUSENSE_CONFIG = {
       widgetUrl: 'YOUR_DEPLOYED_URL',
       debug: false,
       autoDetect: true
     };
   </script>
   <script src="YOUR_DEPLOYED_URL/nusense-tryon-widget.js" async defer></script>
   ```

3. **Add the button** to your product template:
   - Open `sections/main-product.liquid` or `product-template.liquid`
   - Add the button where you want it to appear (usually after the "Add to cart" button)

#### Method B: Using Liquid Templates

1. **Upload the templates**:
   - Copy `nusense-tryon-button.liquid` to `snippets/`
   - Copy `nusense-tryon-script.liquid` to `snippets/`

2. **Include in your product template**:
   ```liquid
   <!-- Add the button -->
   {% render 'nusense-tryon-button' %}
   
   <!-- Add the script -->
   {% render 'nusense-tryon-script' %}
   ```

### Step 3: Customization

#### Button Styling

The button automatically adapts to your theme, but you can customize it:

```css
.nusense-tryon-button {
  /* Your custom styles */
  background: your-brand-color !important;
  border-radius: 8px !important;
}
```

#### Button Text

Update the button text in the Liquid template or via theme settings:

```liquid
<!-- In nusense-tryon-button.liquid -->
{% if settings.nusense_button_text %}
  {{ settings.nusense_button_text }}
{% else %}
  Try Now
{% endif %}
```

#### Theme Settings

Add these settings to your theme's `settings_schema.json`:

```json
{
  "name": "NUSENSE TryON",
  "settings": [
    {
      "type": "text",
      "id": "nusense_widget_url",
      "label": "Widget URL",
      "default": "https://your-domain.com"
    },
    {
      "type": "text",
      "id": "nusense_button_text",
      "label": "Button Text",
      "default": "Try Now"
    },
    {
      "type": "checkbox",
      "id": "nusense_debug",
      "label": "Enable Debug Mode",
      "default": false
    },
    {
      "type": "select",
      "id": "nusense_theme",
      "label": "Button Theme",
      "options": [
        { "value": "default", "label": "Default" },
        { "value": "minimal", "label": "Minimal" },
        { "value": "colorful", "label": "Colorful" }
      ],
      "default": "default"
    }
  ]
}
```

## 🔧 Advanced Configuration

### Product Data Extraction

The widget automatically extracts product data from your Shopify page. It looks for:

- **Product Title**: `h1.product-title`, `h1[data-product-title]`, etc.
- **Product Price**: `.price`, `.product-price`, `[data-price]`, etc.
- **Product Images**: `.product-photos img`, `.product-images img`, etc.
- **Product Description**: `.product-description`, `.product-details`, etc.

### Custom Product Data

You can provide custom product data by setting `window.NUSENSE_PRODUCT_DATA`:

```javascript
window.NUSENSE_PRODUCT_DATA = {
  title: "Your Product Title",
  price: "$99.99",
  images: ["image1.jpg", "image2.jpg"],
  description: "Product description",
  variants: [
    { name: "Size", value: "M" },
    { name: "Color", value: "Red" }
  ],
  url: "https://yourstore.com/products/your-product"
};
```

### API Configuration

Update the API endpoint in `src/services/tryonApi.ts`:

```typescript
const API_ENDPOINT = 'https://your-api-endpoint.com/api/fashion-photo';
```

## 🧪 Testing

### Local Testing

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Use ngrok** to expose your local server:
   ```bash
   ngrok http 8080
   ```

3. **Update the widget URL** to your ngrok URL for testing

### Production Testing

1. **Deploy your application**
2. **Test on a development store**:
   - Create a Shopify development store
   - Install your theme with the integration
   - Test the complete flow

## 📱 Mobile Optimization

The widget is fully responsive and includes:

- **Touch-friendly interface**
- **Mobile-optimized button sizing**
- **Responsive modal design**
- **Gesture support**

## 🔒 Security Considerations

- **CORS handling** for external images
- **Image validation** (type and size)
- **Secure API communication**
- **No sensitive data storage**

## 🐛 Troubleshooting

### Common Issues

**Button doesn't appear**:
- Check that the script is loaded
- Verify the button ID matches
- Check browser console for errors

**Product images not detected**:
- Ensure you're on a product page
- Check that images have proper selectors
- Verify image URLs are accessible

**Widget doesn't open**:
- Check the widget URL is correct
- Verify CORS settings
- Check browser console for errors

**Generation fails**:
- Verify API endpoint is accessible
- Check image file sizes and formats
- Ensure both images are valid

### Debug Mode

Enable debug mode to see detailed logs:

```javascript
window.NUSENSE_DEBUG = true;
```

## 📊 Analytics Integration

Track widget usage with Google Analytics:

```javascript
// Track button clicks
gtag('event', 'tryon_button_click', {
  'event_category': 'engagement',
  'event_label': 'virtual_tryon'
});

// Track successful generations
gtag('event', 'tryon_generation_success', {
  'event_category': 'conversion',
  'event_label': 'virtual_tryon'
});
```

## 🚀 Performance Optimization

- **Lazy load** the widget script
- **Compress images** before upload
- **Cache** generated results
- **Optimize** API calls

## 📞 Support

For technical support:
- 📧 Email: support@nusense.com
- 📝 Documentation: [Your Documentation URL]
- 💬 Discord: [Your Discord Server]

## 📄 License

© 2024 NUSENSE TryON. All rights reserved.

---

**Ready to revolutionize your customers' shopping experience? Follow this guide and start offering virtual try-on today!** 🎉
