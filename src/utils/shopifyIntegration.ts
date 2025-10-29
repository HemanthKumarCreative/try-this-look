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
 * This comprehensive function detects images from multiple sources:
 * - Regular img tags (src, data-src, data-lazy-src, srcset)
 * - Background images in CSS
 * - Shopify product JSON data
 * - Shopify-specific gallery/carousel elements
 * - JSON-LD structured data
 */
export function extractProductImages(): string[] {
  const images: string[] = [];
  const seenUrls = new Set<string>();

  // Helper to add image if valid and not duplicate
  const addImage = (url: string, metadata?: { width?: number; height?: number; alt?: string }) => {
    if (!url || seenUrls.has(url)) return;
    
    const cleanUrl = cleanImageUrl(url);
    if (!cleanUrl || seenUrls.has(cleanUrl)) return;
    
    if (isValidProductImageUrl(cleanUrl, metadata)) {
      images.push(cleanUrl);
      seenUrls.add(cleanUrl);
    }
  };

  // 1. Extract from Shopify Product JSON (most reliable)
  const shopifyProductData = extractShopifyProductJSON();
  if (shopifyProductData?.images) {
    if (Array.isArray(shopifyProductData.images)) {
      shopifyProductData.images.forEach((img: any) => {
        if (typeof img === 'string') {
          addImage(img);
        } else if (img.src || img.url || img.original) {
          addImage(img.src || img.url || img.original);
        }
      });
    }
  }

  // 2. Extract from JSON-LD structured data
  const jsonLdImages = extractJSONLDImages();
  jsonLdImages.forEach(img => addImage(img));

  // 3. Extract from all img elements (including lazy-loaded)
  const imgElements = document.querySelectorAll('img');
  imgElements.forEach(img => {
    // Check multiple source attributes
    const sources = [
      img.src,
      img.dataset.src,
      img.dataset.lazySrc,
      img.dataset.originalSrc,
      img.dataset.productImage,
      img.currentSrc, // For srcset
      img.getAttribute('data-original'),
      img.getAttribute('data-lazy'),
    ].filter(Boolean) as string[];

    // Extract from srcset
    if (img.srcset) {
      const srcsetUrls = parseSrcset(img.srcset);
      sources.push(...srcsetUrls);
    }

    sources.forEach(src => {
      addImage(src, {
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        alt: img.alt,
      });
    });
  });

  // 4. Extract from Shopify-specific selectors
  const shopifySelectors = [
    '.product__media img',
    '.product-image img',
    '.product-gallery img',
    '.product-photos img',
    '.product__media-wrapper img',
    '.product-single__media img',
    '[data-product-image] img',
    '[data-product-single-media-group] img',
    '.product-images img',
    '.product-media img',
    '.flickity-slider img',
    '.swiper-slide img',
    '.carousel img',
    '.product-thumbnails img',
    '.thumbnail img',
  ];

  shopifySelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((img: Element) => {
      if (img instanceof HTMLImageElement) {
        const sources = [
          img.src,
          img.dataset.src,
          img.dataset.lazySrc,
          img.currentSrc,
        ].filter(Boolean) as string[];
        
        sources.forEach(src => {
          addImage(src, {
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            alt: img.alt,
          });
        });
      }
    });
  });

  // 5. Extract background images from CSS
  const bgImageElements = document.querySelectorAll('[style*="background-image"], [class*="product"], [class*="gallery"]');
  bgImageElements.forEach(el => {
    const style = window.getComputedStyle(el);
    const bgImage = style.backgroundImage;
    if (bgImage && bgImage !== 'none') {
      const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (urlMatch && urlMatch[1]) {
        addImage(urlMatch[1], {
          width: el instanceof HTMLElement ? el.offsetWidth : 0,
          height: el instanceof HTMLElement ? el.offsetHeight : 0,
        });
      }
    }

    // Also check data attributes for background images
    ['data-bg', 'data-background', 'data-src', 'data-image'].forEach(attr => {
      const bgUrl = el.getAttribute(attr);
      if (bgUrl) {
        addImage(bgUrl);
      }
    });
  });

  // 6. Extract from picture elements and source tags
  document.querySelectorAll('picture source').forEach(source => {
    if (source instanceof HTMLSourceElement) {
      if (source.srcset) {
        const srcsetUrls = parseSrcset(source.srcset);
        srcsetUrls.forEach(url => addImage(url));
      }
      if (source.src) {
        addImage(source.src);
      }
    }
  });

  // 7. Extract from link tags with rel="image_src" or product image relationships
  document.querySelectorAll('link[rel*="image"], link[rel*="product"]').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      addImage(href);
    }
  });

  // 8. Extract from meta tags
  document.querySelectorAll('meta[property*="image"], meta[name*="image"]').forEach(meta => {
    const content = meta.getAttribute('content');
    if (content) {
      addImage(content);
    }
  });

  // 9. Look for images in data attributes of containers
  document.querySelectorAll('[data-images], [data-product-images], [data-gallery]').forEach(el => {
    const imagesAttr = el.getAttribute('data-images') || 
                      el.getAttribute('data-product-images') || 
                      el.getAttribute('data-gallery');
    if (imagesAttr) {
      try {
        const parsed = JSON.parse(imagesAttr);
        if (Array.isArray(parsed)) {
          parsed.forEach((img: any) => {
            if (typeof img === 'string') {
              addImage(img);
            } else if (img.src || img.url) {
              addImage(img.src || img.url);
            }
          });
        }
      } catch (e) {
        // Not JSON, treat as comma-separated
        imagesAttr.split(',').forEach(url => addImage(url.trim()));
      }
    }
  });

  // Debug: Log detected images
  console.log('NUSENSE: Detected product images:', images);
  
  return images;
}

/**
 * Clean and normalize image URL
 */
function cleanImageUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  
  try {
    // Remove query parameters that resize images (keep quality if present)
    const urlObj = new URL(url, window.location.href);
    
    // Keep only important query params
    const keepParams = ['quality', 'format'];
    const params = new URLSearchParams();
    
    for (const [key, value] of urlObj.searchParams.entries()) {
      if (keepParams.includes(key.toLowerCase())) {
        params.set(key, value);
      }
    }
    
    urlObj.search = params.toString();
    
    // Convert to absolute URL
    return urlObj.href;
  } catch {
    return url;
  }
}

/**
 * Parse srcset attribute to extract URLs
 */
function parseSrcset(srcset: string): string[] {
  const urls: string[] = [];
  const entries = srcset.split(',');
  
  entries.forEach(entry => {
    const parts = entry.trim().split(/\s+/);
    if (parts[0]) {
      urls.push(parts[0]);
    }
  });

  return urls;
}

/**
 * Extract images from Shopify product JSON in script tags
 */
function extractShopifyProductJSON(): any {
  try {
    // Shopify often includes product data in script tags
    const scripts = document.querySelectorAll('script[type="application/json"]');
    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent || '{}');
        if (data.product && data.product.images) {
          return data.product;
        }
        if (data.product?.media) {
          return data.product;
        }
      } catch (e) {
        // Continue to next script
      }
    }

    // Check for Shopify.product or window.product
    if (typeof (window as any).Shopify !== 'undefined' && (window as any).Shopify.product) {
      return (window as any).Shopify.product;
    }
    if ((window as any).product) {
      return (window as any).product;
    }
  } catch (e) {
    console.error('Error extracting Shopify product JSON:', e);
  }
  
  return null;
}

/**
 * Extract images from JSON-LD structured data
 */
function extractJSONLDImages(): string[] {
  const images: string[] = [];
  
  try {
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    jsonLdScripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent || '{}');
        
        // Handle different JSON-LD structures
        if (data['@type'] === 'Product') {
          if (data.image) {
            if (Array.isArray(data.image)) {
              images.push(...data.image.filter((img: any) => typeof img === 'string'));
            } else if (typeof data.image === 'string') {
              images.push(data.image);
            } else if (data.image.url) {
              images.push(data.image.url);
            }
          }
          
          // Check for offers with images
          if (data.offers && Array.isArray(data.offers)) {
            data.offers.forEach((offer: any) => {
              if (offer.image) images.push(offer.image);
            });
          }
        }
        
        // Handle GraphQL responses
        if (data.product && data.product.images) {
          const productImages = data.product.images;
          if (Array.isArray(productImages)) {
            productImages.forEach((img: any) => {
              if (typeof img === 'string') {
                images.push(img);
              } else if (img.url || img.src || img.originalSrc) {
                images.push(img.url || img.src || img.originalSrc);
              }
            });
          }
        }
      } catch (e) {
        // Continue to next script
      }
    });
  } catch (e) {
    console.error('Error extracting JSON-LD images:', e);
  }
  
  return images;
}

/**
 * Validate if an image URL is likely a product image
 */
function isValidProductImageUrl(url: string, metadata?: { width?: number; height?: number; alt?: string }): boolean {
  if (!url) return false;
  
  const lowerUrl = url.toLowerCase();
  const lowerAlt = (metadata?.alt || '').toLowerCase();
  
  // Filter out common non-product image patterns
  const excludePatterns = [
    'logo',
    'icon',
    'badge',
    'payment',
    'trust',
    'review',
    'star',
    'avatar',
    'user',
    'profile',
    'social',
    'facebook',
    'twitter',
    'instagram',
    'pinterest',
    'google',
    'analytics',
    'tracking',
    'pixel',
    'spacer',
    'blank',
    'placeholder',
    '1x1',
    'pixel.gif',
    'transparent',
    '.svg', // Exclude SVG for product images (usually icons/logos)
  ];

  for (const pattern of excludePatterns) {
    if (lowerUrl.includes(pattern) || lowerAlt.includes(pattern)) {
      return false;
    }
  }

  // Accept common image formats
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
  const hasValidExtension = validExtensions.some(ext => lowerUrl.includes(ext));
  
  // Check size if metadata available
  if (metadata) {
    const { width, height } = metadata;
    // Skip very small images (likely icons)
    if (width && height && width < 150 && height < 150) {
      return false;
    }
  }

  // Must be a valid URL
  try {
    new URL(url, window.location.href);
  } catch {
    return false;
  }

  return true;
}
