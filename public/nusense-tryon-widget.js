/**
 * NUSENSE TryON Widget Integration Script
 * This script should be included on the merchant's product page
 * It handles communication with the iframe widget
 */

(function () {
  "use strict";

  // Configuration
  const config = window.NUSENSE_CONFIG || {
    widgetUrl: "https://try-this-look.vercel.app",
    debug: false,
    buttonSelector: "#nusense-tryon-btn",
    autoDetect: true,
    theme: "default",
  };

  // Widget state
  let widgetIframe = null;
  let isWidgetOpen = false;

  // Extract product images from the current page
  function extractProductImages() {
    const images = [];
    const seenUrls = new Set();

    // Helper to add image if valid and not duplicate
    const addImage = (url, metadata) => {
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
        shopifyProductData.images.forEach((img) => {
          if (typeof img === "string") {
            addImage(img);
          } else if (img.src || img.url || img.original) {
            addImage(img.src || img.url || img.original);
          }
        });
      }
    }

    // 2. Extract from JSON-LD structured data
    const jsonLdImages = extractJSONLDImages();
    jsonLdImages.forEach((img) => addImage(img));

    // 3. Extract from all img elements (including lazy-loaded)
    const imgElements = document.querySelectorAll("img");
    imgElements.forEach((img) => {
      const sources = [
        img.src,
        img.dataset.src,
        img.dataset.lazySrc,
        img.dataset.originalSrc,
        img.dataset.productImage,
        img.currentSrc,
        img.getAttribute("data-original"),
        img.getAttribute("data-lazy"),
      ].filter(Boolean);

      // Extract from srcset
      if (img.srcset) {
        const srcsetUrls = parseSrcset(img.srcset);
        sources.push(...srcsetUrls);
      }

      sources.forEach((src) => {
        addImage(src, {
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          alt: img.alt,
        });
      });
    });

    // 4. Extract from Shopify-specific selectors
    const shopifySelectors = [
      ".product__media img",
      ".product-image img",
      ".product-gallery img",
      ".product-photos img",
      ".product__media-wrapper img",
      ".product-single__media img",
      "[data-product-image] img",
      "[data-product-single-media-group] img",
      ".product-images img",
      ".product-media img",
      ".flickity-slider img",
      ".swiper-slide img",
      ".carousel img",
      ".product-thumbnails img",
      ".thumbnail img",
    ];

    shopifySelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((img) => {
        if (img instanceof HTMLImageElement) {
          const sources = [
            img.src,
            img.dataset.src,
            img.dataset.lazySrc,
            img.currentSrc,
          ].filter(Boolean);

          sources.forEach((src) => {
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
    const bgImageElements = document.querySelectorAll(
      '[style*="background-image"], [class*="product"], [class*="gallery"]'
    );
    bgImageElements.forEach((el) => {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== "none") {
        const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (urlMatch && urlMatch[1]) {
          addImage(urlMatch[1], {
            width: el instanceof HTMLElement ? el.offsetWidth : 0,
            height: el instanceof HTMLElement ? el.offsetHeight : 0,
          });
        }
      }

      // Also check data attributes for background images
      ["data-bg", "data-background", "data-src", "data-image"].forEach(
        (attr) => {
          const bgUrl = el.getAttribute(attr);
          if (bgUrl) {
            addImage(bgUrl);
          }
        }
      );
    });

    // 6. Extract from picture elements and source tags
    document.querySelectorAll("picture source").forEach((source) => {
      if (source instanceof HTMLSourceElement) {
        if (source.srcset) {
          const srcsetUrls = parseSrcset(source.srcset);
          srcsetUrls.forEach((url) => addImage(url));
        }
        if (source.src) {
          addImage(source.src);
        }
      }
    });

    // 7. Extract from link tags with rel="image_src" or product image relationships
    document
      .querySelectorAll('link[rel*="image"], link[rel*="product"]')
      .forEach((link) => {
        const href = link.getAttribute("href");
        if (href) {
          addImage(href);
        }
      });

    // 8. Extract from meta tags
    document
      .querySelectorAll('meta[property*="image"], meta[name*="image"]')
      .forEach((meta) => {
        const content = meta.getAttribute("content");
        if (content) {
          addImage(content);
        }
      });

    // 9. Look for images in data attributes of containers
    document
      .querySelectorAll("[data-images], [data-product-images], [data-gallery]")
      .forEach((el) => {
        const imagesAttr =
          el.getAttribute("data-images") ||
          el.getAttribute("data-product-images") ||
          el.getAttribute("data-gallery");
        if (imagesAttr) {
          try {
            const parsed = JSON.parse(imagesAttr);
            if (Array.isArray(parsed)) {
              parsed.forEach((img) => {
                if (typeof img === "string") {
                  addImage(img);
                } else if (img.src || img.url) {
                  addImage(img.src || img.url);
                }
              });
            }
          } catch (e) {
            // Not JSON, treat as comma-separated
            imagesAttr.split(",").forEach((url) => addImage(url.trim()));
          }
        }
      });

    if (config.debug) {
      console.log("NUSENSE: Detected product images:", images);
    }

    return images;
  }

  // Helper functions
  function cleanImageUrl(url) {
    if (!url || typeof url !== "string") return null;

    try {
      const urlObj = new URL(url, window.location.href);
      const keepParams = ["quality", "format"];
      const params = new URLSearchParams();

      for (const [key, value] of urlObj.searchParams.entries()) {
        if (keepParams.includes(key.toLowerCase())) {
          params.set(key, value);
        }
      }

      urlObj.search = params.toString();
      return urlObj.href;
    } catch {
      return url;
    }
  }

  function parseSrcset(srcset) {
    const urls = [];
    const entries = srcset.split(",");

    entries.forEach((entry) => {
      const parts = entry.trim().split(/\s+/);
      if (parts[0]) {
        urls.push(parts[0]);
      }
    });

    return urls;
  }

  function extractShopifyProductJSON() {
    try {
      const scripts = document.querySelectorAll(
        'script[type="application/json"]'
      );
      for (const script of scripts) {
        try {
          const data = JSON.parse(script.textContent || "{}");
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

      if (typeof window.Shopify !== "undefined" && window.Shopify.product) {
        return window.Shopify.product;
      }
      if (window.product) {
        return window.product;
      }
    } catch (e) {
      console.error("Error extracting Shopify product JSON:", e);
    }

    return null;
  }

  function extractJSONLDImages() {
    const images = [];

    try {
      const jsonLdScripts = document.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      jsonLdScripts.forEach((script) => {
        try {
          const data = JSON.parse(script.textContent || "{}");

          if (data["@type"] === "Product") {
            if (data.image) {
              if (Array.isArray(data.image)) {
                images.push(
                  ...data.image.filter((img) => typeof img === "string")
                );
              } else if (typeof data.image === "string") {
                images.push(data.image);
              } else if (data.image.url) {
                images.push(data.image.url);
              }
            }

            if (data.offers && Array.isArray(data.offers)) {
              data.offers.forEach((offer) => {
                if (offer.image) images.push(offer.image);
              });
            }
          }

          if (data.product && data.product.images) {
            const productImages = data.product.images;
            if (Array.isArray(productImages)) {
              productImages.forEach((img) => {
                if (typeof img === "string") {
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
      console.error("Error extracting JSON-LD images:", e);
    }

    return images;
  }

  function isValidProductImageUrl(url, metadata) {
    if (!url) return false;

    const lowerUrl = url.toLowerCase();
    const lowerAlt = (metadata?.alt || "").toLowerCase();

    const excludePatterns = [
      "logo",
      "icon",
      "badge",
      "payment",
      "trust",
      "review",
      "star",
      "avatar",
      "user",
      "profile",
      "social",
      "facebook",
      "twitter",
      "instagram",
      "pinterest",
      "google",
      "analytics",
      "tracking",
      "pixel",
      "spacer",
      "blank",
      "placeholder",
      "1x1",
      "pixel.gif",
      "transparent",
      ".svg",
    ];

    for (const pattern of excludePatterns) {
      if (lowerUrl.includes(pattern) || lowerAlt.includes(pattern)) {
        return false;
      }
    }

    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
    const hasValidExtension = validExtensions.some((ext) =>
      lowerUrl.includes(ext)
    );

    if (metadata) {
      const { width, height } = metadata;
      if (width && height && width < 150 && height < 150) {
        return false;
      }
    }

    try {
      new URL(url, window.location.href);
    } catch {
      return false;
    }

    return true;
  }

  // Extract product information
  function extractProductInfo() {
    try {
      const productJsonScript = document.querySelector(
        'script[type="application/ld+json"]'
      );
      if (productJsonScript) {
        const productData = JSON.parse(productJsonScript.textContent || "{}");
        if (productData["@type"] === "Product") {
          return {
            id: productData.sku || productData.productID || generateProductId(),
            name: productData.name || "Product",
            price: parseFloat(productData.offers?.price || "0"),
            image: productData.image || "",
            url: window.location.href,
            description: productData.description || "",
            brand: productData.brand?.name || "",
            availability: productData.offers?.availability || "InStock",
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
        name: name || "Product",
        price: price || 0,
        image: image || "",
        url: window.location.href,
        description: extractProductDescription() || "",
        sizes: extractProductSizes(),
        colors: extractProductColors(),
        brand: extractBrand(),
        category: extractCategory(),
        availability: "InStock",
      };
    } catch (error) {
      console.error("Error extracting product info:", error);
      return null;
    }
  }

  function extractProductName() {
    const selectors = [
      'h1[data-testid*="product"]',
      ".product-title",
      ".product-name",
      ".product__title",
      "h1.title",
      "h1",
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        return element.textContent.trim();
      }
    }
    return "";
  }

  function extractProductPrice() {
    const selectors = [
      ".price",
      ".product-price",
      ".current-price",
      ".price__current",
      '[class*="price"]',
      '[itemprop="price"]',
      ".money",
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

  function parsePrice(priceText) {
    const patterns = [
      /€\s*([\d,]+\.?\d*)/,
      /\$\s*([\d,]+\.?\d*)/,
      /£\s*([\d,]+\.?\d*)/,
      /([\d,]+\.?\d*)\s*€/,
      /([\d,]+\.?\d*)\s*$/,
      /([\d,]+\.?\d*)/,
    ];

    for (const pattern of patterns) {
      const match = priceText.match(pattern);
      if (match) {
        const priceStr = match[1].replace(",", ".");
        const price = parseFloat(priceStr);
        if (!isNaN(price)) return price;
      }
    }
    return 0;
  }

  function extractFirstProductImage() {
    const selectors = [
      ".product-image img",
      ".product__media img",
      ".product-gallery img",
      '[data-testid*="product-image"] img',
      ".main-image img",
      'img[alt*="product"]',
    ];

    for (const selector of selectors) {
      const img = document.querySelector(selector);
      if (img?.src) {
        return img.src;
      }
    }
    return "";
  }

  function extractProductDescription() {
    const selectors = [
      ".product-description",
      ".product__description",
      '[itemprop="description"]',
      ".description",
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        return element.textContent.trim().substring(0, 500);
      }
    }
    return "";
  }

  function extractProductSizes() {
    const sizeSelectors = [
      ".product-form__input--size",
      '[name*="Size"]',
      '[data-option-name*="size"]',
    ];

    for (const selector of sizeSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        const sizes = Array.from(elements)
          .map((el) => el.textContent?.trim())
          .filter(Boolean)
          .join(", ");
        if (sizes) return sizes;
      }
    }
    return "";
  }

  function extractProductColors() {
    const colorSelectors = [
      ".product-form__input--color",
      '[name*="Color"]',
      '[name*="Colour"]',
      '[data-option-name*="color"]',
    ];

    for (const selector of colorSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        const colors = Array.from(elements)
          .map((el) => el.textContent?.trim())
          .filter(Boolean)
          .join(", ");
        if (colors) return colors;
      }
    }
    return "";
  }

  function extractBrand() {
    const selectors = [
      '[itemprop="brand"]',
      ".product-brand",
      ".vendor",
      ".product__vendor",
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        return element.textContent.trim();
      }
    }
    return "";
  }

  function extractCategory() {
    const selectors = [
      ".breadcrumb li:last-child",
      '[itemprop="category"]',
      ".product-type",
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        return element.textContent.trim();
      }
    }
    return "";
  }

  function generateProductId() {
    return `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create and manage widget iframe
  function createWidget() {
    if (widgetIframe) return;

    widgetIframe = document.createElement("iframe");
    widgetIframe.src = config.widgetUrl + "/widget";
    widgetIframe.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      z-index: 999999;
      background: rgba(0, 0, 0, 0.5);
    `;
    widgetIframe.style.display = "none";

    document.body.appendChild(widgetIframe);

    // Listen for messages from widget
    window.addEventListener("message", handleWidgetMessage);
  }

  function handleWidgetMessage(event) {
    if (event.origin !== new URL(config.widgetUrl).origin) return;

    switch (event.data.type) {
      case "NUSENSE_WIDGET_READY":
        if (config.debug)
          console.log("NUSENSE: Widget ready, sending product data");
        sendProductData();
        break;

      case "NUSENSE_REQUEST_PRODUCT_DATA":
        if (config.debug) console.log("NUSENSE: Widget requested product data");
        sendProductData();
        break;

      case "NUSENSE_CLOSE_WIDGET":
        closeWidget();
        break;

      case "NUSENSE_ADD_TO_CART":
        handleAddToCart(event.data.product);
        break;
    }
  }

  function sendProductData() {
    if (!widgetIframe) return;

    const productInfo = extractProductInfo();
    const images = extractProductImages();

    const productData = {
      ...productInfo,
      images: images,
      title: productInfo?.name || "Product",
      price: productInfo?.price?.toString() || "0",
      description: productInfo?.description || "",
      variants: [
        { name: "Size", value: productInfo?.sizes || "One Size" },
        { name: "Color", value: productInfo?.colors || "Default" },
      ],
      url: window.location.href,
    };

    widgetIframe.contentWindow.postMessage(
      {
        type: "NUSENSE_PRODUCT_DATA",
        data: productData,
      },
      config.widgetUrl
    );

    if (config.debug) {
      console.log("NUSENSE: Sent product data to widget:", productData);
    }
  }

  function openWidget() {
    if (!widgetIframe) createWidget();

    widgetIframe.style.display = "block";
    isWidgetOpen = true;
    document.body.style.overflow = "hidden";
  }

  function closeWidget() {
    if (widgetIframe) {
      widgetIframe.style.display = "none";
    }
    isWidgetOpen = false;
    document.body.style.overflow = "";
  }

  function handleAddToCart(product) {
    // This is where you would integrate with your cart system
    console.log("NUSENSE: Add to cart:", product);

    // Example: Add to Shopify cart
    if (typeof window.Shopify !== "undefined" && window.Shopify.addItem) {
      // Implement Shopify cart integration here
      alert(`Added ${product.title} to cart!`);
    } else {
      // Fallback: Show alert
      alert(`Added ${product.title} to cart!`);
    }
  }

  // Initialize widget
  function init() {
    if (config.debug) console.log("NUSENSE: Initializing TryON widget");

    // Find and setup button
    const button = document.querySelector(config.buttonSelector);
    if (button) {
      button.addEventListener("click", openWidget);
    } else if (config.debug) {
      console.warn(
        "NUSENSE: Button not found with selector:",
        config.buttonSelector
      );
    }

    // Auto-detect and setup if enabled
    if (config.autoDetect) {
      // Look for common product page elements
      const productIndicators = [
        ".product-form",
        ".product-single",
        ".product-details",
        "[data-product-id]",
        ".product__title",
      ];

      const hasProductPage = productIndicators.some((selector) =>
        document.querySelector(selector)
      );

      if (hasProductPage && config.debug) {
        console.log("NUSENSE: Product page detected");
      }
    }
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose API for manual control
  window.NUSENSE = {
    open: openWidget,
    close: closeWidget,
    extractImages: extractProductImages,
    extractProductInfo: extractProductInfo,
  };
})();
