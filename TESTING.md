# NUSENSE TryON - Testing Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Start the development server:**
   ```bash
   npm run serve
   ```

4. **Open the test page:**
   - Go to https://try-this-look.vercel.app/test
   - This page simulates a Shopify product page with 4 product images
   - Click the "✨ Try Virtually with AI" button
   - The widget should open and show the 4 product images from the test page

## What to Test

### ✅ Image Detection
- The test page should show "4 product images detected" at the bottom
- When you open the widget, it should display the same 4 images
- Check the browser console for detailed logging of image detection

### ✅ Widget Functionality
- Widget should open in a modal/iframe
- Images should be loaded from the parent page (not the widget page)
- You should be able to select different clothing images
- The widget should maintain all existing functionality

### ✅ Console Logging
- Open browser dev tools (F12)
- Look for `[NUSENSE TryON]` log messages
- You should see:
  - "Initializing NUSENSE TryON Widget"
  - "Found product image: [URL]"
  - "Sent product images to widget: [array]"
  - "Images loaded" when widget receives images

## Troubleshooting

### Images Not Detected
- Check browser console for error messages
- Verify the test page has the correct image selectors
- Make sure images have proper `alt` attributes and `data-product-image="true"`

### Widget Not Opening
- Check if the widget script is loading: https://try-this-look.vercel.app/nusense-tryon-widget.js
- Verify the iframe URL: https://try-this-look.vercel.app/widget
- Check for CORS errors in console

### Images Not Showing in Widget
- Check if the postMessage communication is working
- Look for "NUSENSE_REQUEST_IMAGES" and "NUSENSE_PRODUCT_IMAGES" messages
- Verify the widget is receiving the images array

## File Structure

- `test-integration.html` - Test page with sample product images
- `public/nusense-tryon-widget.js` - Widget embed script
- `src/components/TryOnWidget.tsx` - Main widget component
- `src/utils/shopifyIntegration.ts` - Image extraction utilities
- `dev-server.js` - Development server

## Expected Behavior

1. **Page Load:** Test page shows 4 product images and detects them
2. **Button Click:** Widget opens in iframe
3. **Image Request:** Widget requests images from parent page
4. **Image Response:** Parent page sends detected images to widget
5. **Image Display:** Widget shows the 4 product images for selection
6. **Functionality:** All existing widget features work normally

The key improvement is that images are now extracted from the website where the popup was triggered, not from the widget page itself.
