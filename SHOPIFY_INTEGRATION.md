# NUSENSE TryON - Shopify Integration Guide

Complete guide to integrate NUSENSE TryON virtual try-on widget into your Shopify store using flexible snippet-based integration.

## 🚀 Quick Setup (5 Steps)

### Step 1: Upload Snippet Files

1. Go to `Online Store > Themes` in your Shopify admin
2. Click `Actions > Edit code` on your active theme
3. Navigate to `snippets/` folder
4. Click `Add a new snippet`
5. Name it `nusense-tryon-button.liquid`
6. Copy the entire contents from `shopify-templates/snippets/nusense-tryon-button.liquid`
7. Click `Save`
8. Repeat steps 4-7 for `nusense-tryon-script.liquid` using the script file

### Step 2: Add Script to Your Theme

Add the script snippet to your theme's main template file:

**For Shopify 2.0 themes:**
- Open `layout/theme.liquid` or `sections/main-product.liquid`

**For older themes:**
- Open `layout/theme.liquid`

Add this code in the `<head>` section (near the bottom, before `</head>`):

```liquid
{% render 'nusense-tryon-script', 
   widget_url: 'https://try-this-look.vercel.app',
   debug_mode: false %}
```

### Step 3: Add Button Where You Want It

Place the button snippet in any template file where you want the button to appear:

```liquid
{% render 'nusense-tryon-button' %}
```

### Step 4: Customize Button (Optional)

You can customize the button appearance using parameters:

```liquid
{% render 'nusense-tryon-button', 
   button_text: 'Try It On',
   button_style: 'outline',
   show_icon: true,
   button_icon: '👕',
   button_width: 'full' %}
```

### Step 5: Save and Test

1. Save all files
2. Visit a product page on your store
3. Verify the button appears and works correctly

---

## 📋 Complete Usage Guide

### Basic Button Placement

The simplest way to add the button:

```liquid
{% render 'nusense-tryon-button' %}
```

This will create a button with default settings:
- Text: "Try Now"
- Style: Primary (matches your theme)
- Icon: ✨
- Width: Auto

### Custom Button Parameters

All available parameters:

| Parameter | Type | Default | Options | Description |
|-----------|------|---------|---------|-------------|
| `button_text` | string | `'Try Now'` | Any text | Button label text |
| `button_style` | string | `'primary'` | `'primary'`, `'secondary'`, `'outline'`, `'minimal'` | Button style |
| `show_icon` | boolean | `true` | `true`, `false` | Show/hide icon |
| `button_icon` | string | `'✨'` | Any emoji or text | Icon to display |
| `button_width` | string | `'auto'` | `'auto'`, `'full'` | Button width |

### Button Style Examples

**Primary Style (Default):**
```liquid
{% render 'nusense-tryon-button', button_style: 'primary' %}
```

**Secondary Style:**
```liquid
{% render 'nusense-tryon-button', button_style: 'secondary' %}
```

**Outline Style:**
```liquid
{% render 'nusense-tryon-button', button_style: 'outline' %}
```

**Minimal Style:**
```liquid
{% render 'nusense-tryon-button', button_style: 'minimal' %}
```

**Full Width Button:**
```liquid
{% render 'nusense-tryon-button', button_width: 'full' %}
```

**Custom Text and Icon:**
```liquid
{% render 'nusense-tryon-button', 
   button_text: 'Virtual Try-On',
   button_icon: '👕' %}
```

**No Icon:**
```liquid
{% render 'nusense-tryon-button', show_icon: false %}
```

### Script Configuration

**Basic script (default widget URL):**
```liquid
{% render 'nusense-tryon-script' %}
```

**Custom widget URL:**
```liquid
{% render 'nusense-tryon-script', 
   widget_url: 'https://your-custom-url.com' %}
```

**With debug mode enabled:**
```liquid
{% render 'nusense-tryon-script', 
   widget_url: 'https://try-this-look.vercel.app',
   debug_mode: true %}
```

---

## 🎯 Common Placement Scenarios

### Scenario 1: After Add to Cart Button

**Location:** `sections/main-product.liquid` or `templates/product.liquid`

```liquid
<!-- Find your Add to Cart button section -->
<button type="submit" name="add">Add to Cart</button>

<!-- Add NUSENSE button right after -->
{% render 'nusense-tryon-button' %}
```

### Scenario 2: Inside Product Form

**Location:** `sections/main-product.liquid` (inside the form)

```liquid
<form action="/cart/add" method="post">
  <!-- Product variant selectors -->
  
  <button type="submit" name="add">Add to Cart</button>
  
  <!-- Add NUSENSE button -->
  {% render 'nusense-tryon-button', button_width: 'full' %}
</form>
```

### Scenario 3: In Product Information Section

**Location:** `sections/main-product.liquid` (product info area)

```liquid
<div class="product-info">
  <h1>{{ product.title }}</h1>
  <div class="product-price">{{ product.price | money }}</div>
  
  <!-- Add NUSENSE button -->
  {% render 'nusense-tryon-button', 
     button_style: 'outline',
     button_text: 'Try This On' %}
  
  <!-- Product description -->
  <div class="product-description">{{ product.description }}</div>
</div>
```

### Scenario 4: Multiple Buttons

You can place multiple buttons in different locations:

```liquid
<!-- Button 1: After product title -->
<h1>{{ product.title }}</h1>
{% render 'nusense-tryon-button', 
   button_style: 'minimal',
   button_text: 'Try On' %}

<!-- Button 2: After add to cart -->
<button type="submit">Add to Cart</button>
{% render 'nusense-tryon-button', button_width: 'full' %}
```

### Scenario 5: Custom Template Files

**For custom product templates or sections:**

Simply add the render tag wherever you want:

```liquid
<div class="my-custom-section">
  {% render 'nusense-tryon-button' %}
</div>
```

---

## 📁 File Structure

After setup, your theme should have these files:

```
your-theme/
├── snippets/
│   ├── nusense-tryon-button.liquid ✅
│   └── nusense-tryon-script.liquid ✅
├── layout/
│   └── theme.liquid (contains script render)
└── sections/
    └── main-product.liquid (contains button render)
```

---

## 🔧 Advanced Configuration

### Widget URL Configuration

The default widget URL is `https://try-this-look.vercel.app`. To use a custom URL:

```liquid
{% render 'nusense-tryon-script', 
   widget_url: 'https://your-deployment.com' %}
```

### Debug Mode

Enable debug mode to see console logs for troubleshooting:

```liquid
{% render 'nusense-tryon-script', 
   widget_url: 'https://try-this-look.vercel.app',
   debug_mode: true %}
```

### Product Data

The script automatically extracts product data from Shopify's `product` object:
- Product title
- Product price
- Product images (up to 10 images)
- Product description
- Product variants with options
- Product URL
- Shop information

This data is automatically available to the widget when used on product pages.

---

## 🎨 Button Styling

The button automatically matches your theme's color scheme using CSS variables:

- **Primary**: Uses `--color-primary` or theme's primary button color
- **Secondary**: Uses `--color-secondary` or theme's secondary colors
- **Outline**: Uses `--color-accent` or theme's accent color
- **Minimal**: Uses theme's text color

If your theme doesn't use CSS variables, the button falls back to sensible defaults.

### Custom Styling

You can override button styles by adding custom CSS:

```css
.nusense-tryon-button {
  /* Your custom styles */
  background: #your-color !important;
  border-radius: 10px !important;
}
```

---

## 🐛 Troubleshooting

### Button Not Showing

**Check:**
1. ✅ Snippet files are uploaded to `snippets/` folder
2. ✅ Render tag is placed in the correct template file
3. ✅ File is saved (no syntax errors)
4. ✅ You're viewing a product page (button only works on product pages)

### Button Not Working

**Check:**
1. ✅ Script snippet is included in `theme.liquid` or main template
2. ✅ Widget URL is correct and accessible
3. ✅ Browser console for JavaScript errors
4. ✅ Debug mode is enabled to see detailed logs

### Script Not Loading

**Check:**
1. ✅ Widget URL is correct
2. ✅ CORS settings on your widget deployment
3. ✅ Network tab in browser dev tools
4. ✅ Widget file exists at: `{widget_url}/nusense-tryon-widget.js`

### Product Data Not Detected

**Check:**
1. ✅ You're on a product page (not collection or home page)
2. ✅ Script snippet is included (it extracts product data)
3. ✅ Browser console for any data errors

### Styling Issues

**Check:**
1. ✅ Button style parameter is correct (`primary`, `secondary`, `outline`, `minimal`)
2. ✅ Theme CSS variables are available
3. ✅ No conflicting CSS rules
4. ✅ Button width parameter if needed

---

## ✅ Checklist

Before going live, verify:

- [ ] Both snippet files are uploaded (`nusense-tryon-button.liquid` and `nusense-tryon-script.liquid`)
- [ ] Script snippet is included in `theme.liquid` or main template
- [ ] Button snippet is placed in product template
- [ ] Widget URL is set correctly
- [ ] Tested on product pages
- [ ] Tested on mobile devices
- [ ] Button styling matches your theme
- [ ] Debug mode disabled for production

---

## 📞 Support

Need help? Contact us:
- 📧 Email: support@nusense.com

---

**That's it! Your virtual try-on is now live on your Shopify store!** 🎉
