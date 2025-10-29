# NUSENSE TryON - Complete Shopify Integration Guide

This guide provides step-by-step instructions for integrating the NUSENSE TryON virtual try-on widget into your Shopify store.

## 🚀 Quick Start (5 Minutes)

### Option 1: Simple Button Integration

1. **Add the widget script** to your theme's `theme.liquid` file (in the `</head>` section):

```liquid
<!-- NUSENSE TryON Widget -->
<script>
  window.NUSENSE_CONFIG = {
    widgetUrl: 'https://try-this-look.vercel.app',
    debug: false,
    autoDetect: true
  };
</script>
<script src="https://try-this-look.vercel.app/nusense-tryon-widget.js" async defer></script>
```

2. **Add the button** to your product template (`sections/main-product.liquid` or `product-template.liquid`):

```liquid
<!-- Add this where you want the button to appear -->
<button id="nusense-tryon-btn" class="btn btn-primary">
  <span>✨</span> Try Now
</button>
```

3. The widget is already configured and ready to use!

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
       widgetUrl: 'https://try-this-look.vercel.app',
       debug: false,
       autoDetect: true
     };
   </script>
   <script src="https://try-this-look.vercel.app/nusense-tryon-widget.js" async defer></script>
   ```

3. **Add the button** to your product template:
   - Open `sections/main-product.liquid` or `product-template.liquid`
   - Add the button where you want it to appear (usually after the "Add to cart" button)

#### Method B: Using Shopify Theme Editor (No Code Required!) ⭐ Recommended

This method allows you to add the button directly from the Shopify Theme Editor UI without editing any code.

**📋 Step-by-Step Guide:**

1. **Upload the section file**:
   - Go to `Online Store > Themes`
   - Click `Actions > Edit code` on your active theme
   - Navigate to `sections/` folder
   - Click `Add a new section`
   - Name it `nusense-tryon-button.liquid`
   - Copy and paste the contents from `shopify-templates/sections/nusense-tryon-button.liquid`
   - Click `Save`

2. **Add via Theme Editor UI**:
   - Go back to `Online Store > Themes`
   - Click `Customize` on your active theme
   - Navigate to a **Product Page** (click on any product page template)
   - In the left sidebar, find the section where you want the button (usually the product form section)
   - Click `Add section` or look for `Add block` in that section
   - Scroll down and find **"NUSENSE TryON Button"** in the list
   - Click on it to add it to your page
   - **Drag and drop** to position it where you want (typically right after the Add to Cart button)

3. **Customize the button** (all from the sidebar UI):
   - **Button Text**: Change "Try Now" to any text you want
   - **Show Icon**: Toggle to show/hide the ✨ icon
   - **Button Icon**: Change the emoji/icon (✨, 🎯, 👕, etc.)
   - **Button Style**: Choose from Primary, Secondary, Outline, or Minimal
     - **Primary**: Uses your theme's primary color (matches Add to Cart button)
     - **Secondary**: Uses your theme's secondary color
     - **Outline**: Uses your theme's accent color with transparent background
     - **Minimal**: Transparent with your theme's text color
   - **Button Width**: Auto or Full Width
   - **Match Theme Button Style**: Automatically inherits your theme's button styling
   - **Widget URL**: Already set to `https://try-this-look.vercel.app`
   - **Debug Mode**: Enable for troubleshooting

4. **Save and Preview**:
   - Click `Save` in the top right
   - Preview your product page to see the button
   - The button will automatically work once you save!

**🎨 Visual Customization Options:**
- ✅ Change button text and icon without code
- ✅ **Automatic theme color matching** - no manual color selection needed
- ✅ Choose button style (Primary, Secondary, Outline, Minimal)
- ✅ Set button width (Auto or Full Width)
- ✅ **Inherit theme button styling** - matches your Add to Cart button
- ✅ Position anywhere on the product page via drag-and-drop

**💡 Benefits:**
- ✅ **Seamless theme integration** - automatically matches your store's color palette
- ✅ No code editing required
- ✅ Easy to customize via UI
- ✅ Can be added/removed anytime
- ✅ Works with any Shopify theme
- ✅ Mobile responsive by default
- ✅ **Consistent with your brand** - looks like it belongs in your store

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
      "default": "https://try-this-look.vercel.app"
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
