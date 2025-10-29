import { ProductInfo } from '@/types/tryon';

/**
 * Extract product information from Shopify product page
 * This works by looking for common Shopify selectors and data attributes
 */
export function extractShopifyProductInfo(): ProductInfo | null {
  try {
    // Try to get product data from Shopify's product JSON (most reliable)
    const productJsonScript = document.querySelector('script[type="application/ld+json"]');
    if (productJsonScript) {
      const productData = JSON.parse(productJsonScript.textContent || '{}');
      if (productData['@type'] === 'Product') {
        return {
          id: productData.sku || productData.productID || generateProductId(),
          name: productData.name || 'Produit',
          price: parseFloat(productData.offers?.price || '0'),
          image: productData.image || extractFirstProductImage() || '',
          url: window.location.href,
          description: productData.description || '',
          brand: productData.brand?.name || '',
          availability: productData.offers?.availability || 'InStock',
          rating: productData.aggregateRating?.ratingValue || 0,
        };
      }
    }

    // Fallback: Manual extraction from DOM
    const name = extractProductName();
    const price = extractProductPrice();
    const image = extractFirstProductImage();

    return {
      id: generateProductId(),
      name: name || 'Produit',
      price: price || 0,
      image: image || '',
      url: window.location.href,
      description: extractProductDescription() || '',
      sizes: extractProductSizes(),
      colors: extractProductColors(),
      brand: extractBrand(),
      category: extractCategory(),
      availability: 'InStock',
    };
  } catch (error) {
    console.error('Error extracting product info:', error);
    return null;
  }
}

function extractProductName(): string {
  const selectors = [
    'h1[data-testid*="product"]',
    '.product-title',
    '.product-name',
    '.product__title',
    'h1.title',
    'h1',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element?.textContent) {
      return element.textContent.trim();
    }
  }

  return '';
}

function extractProductPrice(): number {
  const selectors = [
    '.price',
    '.product-price',
    '.current-price',
    '.price__current',
    '[class*="price"]',
    '[itemprop="price"]',
    '.money',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element?.textContent) {
      const priceText = element.textContent.trim();
      const price = parsePrice(priceText);
      if (price > 0) return price;
    }
  }

  return 0;
}

function parsePrice(priceText: string): number {
  const patterns = [
    /€\s*([\d,]+\.?\d*)/,
    /\$\s*([\d,]+\.?\d*)/,
    /£\s*([\d,]+\.?\d*)/,
    /([\d,]+\.?\d*)\s*€/,
    /([\d,]+\.?\d*)\s*\$/,
    /([\d,]+\.?\d*)/,
  ];

  for (const pattern of patterns) {
    const match = priceText.match(pattern);
    if (match) {
      const priceStr = match[1].replace(',', '.');
      const price = parseFloat(priceStr);
      if (!isNaN(price)) return price;
    }
  }

  return 0;
}

function extractFirstProductImage(): string {
  const selectors = [
    '.product-image img',
    '.product__media img',
    '.product-gallery img',
    '[data-testid*="product-image"] img',
    '.main-image img',
    'img[alt*="product"]',
  ];

  for (const selector of selectors) {
    const img = document.querySelector(selector) as HTMLImageElement;
    if (img?.src) {
      return img.src;
    }
  }

  return '';
}

function extractProductDescription(): string {
  const selectors = [
    '.product-description',
    '.product__description',
    '[itemprop="description"]',
    '.description',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element?.textContent) {
      return element.textContent.trim().substring(0, 500);
    }
  }

  return '';
}

function extractProductSizes(): string {
  const sizeSelectors = [
    '.product-form__input--size',
    '[name*="Size"]',
    '[data-option-name*="size"]',
  ];

  for (const selector of sizeSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      const sizes = Array.from(elements)
        .map(el => el.textContent?.trim())
        .filter(Boolean)
        .join(', ');
      if (sizes) return sizes;
    }
  }

  return '';
}

function extractProductColors(): string {
  const colorSelectors = [
    '.product-form__input--color',
    '[name*="Color"]',
    '[name*="Colour"]',
    '[data-option-name*="color"]',
  ];

  for (const selector of colorSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      const colors = Array.from(elements)
        .map(el => el.textContent?.trim())
        .filter(Boolean)
        .join(', ');
      if (colors) return colors;
    }
  }

  return '';
}

function extractBrand(): string {
  const selectors = [
    '[itemprop="brand"]',
    '.product-brand',
    '.vendor',
    '.product__vendor',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element?.textContent) {
      return element.textContent.trim();
    }
  }

  return '';
}

function extractCategory(): string {
  const selectors = [
    '.breadcrumb li:last-child',
    '[itemprop="category"]',
    '.product-type',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element?.textContent) {
      return element.textContent.trim();
    }
  }

  return '';
}

function generateProductId(): string {
  return `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract all product images from the page
 */
export function extractProductImages(): string[] {
  const images: string[] = [];
  const seenUrls = new Set<string>();

  // Find all images that might be product images
  const imgElements = document.querySelectorAll('img');
  
  imgElements.forEach(img => {
    const src = img.src || img.dataset.src;
    if (src && !seenUrls.has(src) && isValidProductImage(img, src)) {
      images.push(src);
      seenUrls.add(src);
    }
  });

  return images;
}

function isValidProductImage(img: HTMLImageElement, src: string): boolean {
  // Filter out logos, icons, and small images
  if (img.width < 200 || img.height < 200) return false;
  
  // Filter out common non-product image patterns
  const excludePatterns = [
    'logo',
    'icon',
    'badge',
    'payment',
    'trust',
    'review',
    'star',
  ];

  const lowerSrc = src.toLowerCase();
  const lowerAlt = (img.alt || '').toLowerCase();
  
  for (const pattern of excludePatterns) {
    if (lowerSrc.includes(pattern) || lowerAlt.includes(pattern)) {
      return false;
    }
  }

  return true;
}
