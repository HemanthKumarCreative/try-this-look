/**
 * NUSENSE TryON Widget - Embeddable Script
 * This script can be embedded in any Shopify store to add virtual try-on functionality
 */

(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    widgetUrl: "https://try-this-look.vercel.app",
    buttonId: "nusense-tryon-btn",
    widgetId: "nusense-tryon-widget",
    version: "1.0.0",
  };

  // Widget state
  let isWidgetLoaded = false;
  let isWidgetOpen = false;
  let widgetIframe = null;

  // Utility functions
  function log(message, ...args) {
    // Always log for debugging
    console.log(`[NUSENSE TryON] ${message}`, ...args);
  }

  function createButton() {
    const existingButton = document.getElementById(CONFIG.buttonId);
    if (existingButton) {
      return existingButton;
    }

    const button = document.createElement("button");
    button.id = CONFIG.buttonId;
    button.className = "nusense-tryon-button";
    button.innerHTML = `
      <span style="margin-right: 8px;">✨</span>
      Try Now
    `;

    // Apply default styles
    button.style.cssText = `
      background: linear-gradient(135deg, #ce0003, #ff1a1d);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 16px;
      display: inline-flex;
      align-items: center;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    // Add hover effects
    button.addEventListener("mouseenter", () => {
      button.style.transform = "scale(1.05)";
      button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "scale(1)";
      button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    });

    return button;
  }

  function createWidget() {
    if (widgetIframe) {
      return widgetIframe;
    }

    const iframe = document.createElement("iframe");
    iframe.id = CONFIG.widgetId;
    iframe.src = `${CONFIG.widgetUrl}/widget`;
    iframe.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      border: none;
      background: transparent;
      z-index: 999999;
      display: none;
    `;

    document.body.appendChild(iframe);

    widgetIframe = iframe;
    return iframe;
  }

  function openWidget() {
    log("Opening widget");

    if (!isWidgetLoaded) {
      const widget = createWidget();
      isWidgetLoaded = true;
    }

    const widget = document.getElementById(CONFIG.widgetId);
    if (widget) {
      widget.style.display = "block";
      isWidgetOpen = true;
      document.body.style.overflow = "hidden";

      // Send product data to widget
      sendProductData();

      // Ask iframe to open its internal modal (handles subsequent opens)
      try {
        if (widgetIframe && widgetIframe.contentWindow) {
          widgetIframe.contentWindow.postMessage(
            { type: "NUSENSE_OPEN_MODAL" },
            CONFIG.widgetUrl
          );
        }
      } catch {}
    }
  }

  function closeWidget() {
    log("Closing widget");

    const widget = document.getElementById(CONFIG.widgetId);
    if (widget) {
      widget.style.display = "none";
      isWidgetOpen = false;
      document.body.style.overflow = "";
    }
  }

  function sendProductData() {
    if (!widgetIframe) return;

    const productData = extractProductData();
    log("Sending product data:", productData);

    widgetIframe.contentWindow.postMessage(
      {
        type: "NUSENSE_PRODUCT_DATA",
        data: productData,
      },
      CONFIG.widgetUrl
    );
  }

  function extractProductData() {
    const data = {
      title: "",
      price: "",
      images: [],
      description: "",
      variants: [],
      url: window.location.href,
    };

    // Try to extract from Shopify product page
    try {
      // Product title
      const titleSelectors = [
        "h1.product-title",
        "h1[data-product-title]",
        ".product-title h1",
        'h1[class*="product"]',
        'h1[class*="title"]',
      ];

      for (const selector of titleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          data.title = element.textContent.trim();
          break;
        }
      }

      // Product price
      const priceSelectors = [
        ".price",
        ".product-price",
        "[data-price]",
        ".money",
        '[class*="price"]',
      ];

      for (const selector of priceSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          data.price = element.textContent.trim();
          break;
        }
      }

      // Product images - comprehensive extraction
      const imageSelectors = [
        ".product-photos img",
        ".product-images img",
        "[data-product-image]",
        ".product-gallery img",
        ".product__media img",
        ".product-image img",
        ".main-image",
        ".thumbnail",
        'img[alt*="product" i]',
        'img[alt*="T-Shirt" i]',
        'img[alt*="Premium" i]',
        'img[class*="product"]',
        'img[class*="main"]',
        'img[class*="thumbnail"]',
      ];

      for (const selector of imageSelectors) {
        const images = document.querySelectorAll(selector);
        images.forEach((img) => {
          if (
            img.src &&
            !img.src.includes("placeholder") &&
            !img.src.includes("logo") &&
            !img.src.includes("icon") &&
            !data.images.includes(img.src)
          ) {
            data.images.push(img.src);
            log("Found product image:", img.src);
          }
        });
      }

      // Also extract from all img elements as fallback
      const allImages = document.querySelectorAll("img");
      allImages.forEach((img) => {
        if (
          img.src &&
          !img.src.includes("placeholder") &&
          !img.src.includes("logo") &&
          !img.src.includes("icon") &&
          !img.src.includes("badge") &&
          !img.src.includes("payment") &&
          !img.src.includes("social") &&
          !data.images.includes(img.src) &&
          (img.naturalWidth > 100 || img.width > 100) // Only images that are reasonably sized
        ) {
          data.images.push(img.src);
          log("Found additional image:", img.src);
        }
      });

      // Product description
      const descSelectors = [
        ".product-description",
        ".product-details",
        "[data-product-description]",
        ".product-content",
      ];

      for (const selector of descSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          data.description = element.textContent.trim();
          break;
        }
      }

      // Product variants (sizes, colors)
      const variantSelectors = [
        '.product-variants input[type="radio"]:checked',
        ".variant-selector input:checked",
        ".product-options input:checked",
      ];

      for (const selector of variantSelectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          data.variants.push({
            name: el.name || "variant",
            value: el.value,
          });
        });
      }
    } catch (error) {
      log("Error extracting product data:", error);
    }

    return data;
  }

  function initializeWidget() {
    log("Initializing NUSENSE TryON Widget v" + CONFIG.version);

    // Inject responsive styles for various device widths
    injectResponsiveStyles();

    // Create and attach button
    const button = createButton();

    // Try to find common product page locations to insert button
    const insertSelectors = [
      ".product-form",
      ".product-actions",
      ".add-to-cart",
      ".product-buy",
      ".product-purchase",
      "[data-add-to-cart]",
    ];

    let inserted = false;
    for (const selector of insertSelectors) {
      const container = document.querySelector(selector);
      if (container) {
        container.appendChild(button);
        inserted = true;
        log("Button inserted into:", selector);
        break;
      }
    }

    // Fallback: insert after product title
    if (!inserted) {
      const titleSelectors = [
        "h1.product-title",
        "h1[data-product-title]",
        ".product-title h1",
        'h1[class*="product"]',
      ];

      for (const selector of titleSelectors) {
        const element = document.querySelector(selector);
        if (element && element.parentNode) {
          element.parentNode.insertBefore(button, element.nextSibling);
          inserted = true;
          log("Button inserted after title:", selector);
          break;
        }
      }
    }

    // Final fallback: insert at top of page
    if (!inserted) {
      const body = document.body;
      if (body) {
        body.insertBefore(button, body.firstChild);
        log("Button inserted at top of page");
      }
    }

    // Add click handler
    button.addEventListener("click", openWidget);

    // Listen for messages from widget
    window.addEventListener("message", function (event) {
      if (event.origin !== CONFIG.widgetUrl) return;

      switch (event.data.type) {
        case "NUSENSE_CLOSE_WIDGET":
          closeWidget();
          break;
        case "NUSENSE_ADD_TO_CART":
          handleAddToCart(event.data.product);
          break;
        case "NUSENSE_WIDGET_READY":
          log("Widget is ready");
          // Ensure product data and open command are sent when iframe reports ready
          try {
            sendProductData();
            if (isWidgetOpen && widgetIframe && widgetIframe.contentWindow) {
              widgetIframe.contentWindow.postMessage(
                { type: "NUSENSE_OPEN_MODAL" },
                CONFIG.widgetUrl
              );
            }
          } catch {}
          break;
        case "NUSENSE_REQUEST_IMAGES":
          // Send product images to widget
          const productData = extractProductData();
          if (widgetIframe) {
            widgetIframe.contentWindow.postMessage(
              {
                type: "NUSENSE_PRODUCT_IMAGES",
                images: productData.images,
              },
              CONFIG.widgetUrl
            );
            log("Sent product images to widget:", productData.images);
          }
          break;
      }
    });

    // Note: Closing is controlled from inside the iframe via the header close button
    // which posts a message (NUSENSE_CLOSE_WIDGET). We intentionally do not
    // close on Escape or outside clicks to ensure a single, explicit close control.
  }

  function handleAddToCart(product) {
    log("Adding to cart:", product);

    // Try to trigger Shopify's add to cart
    const addToCartSelectors = [
      'form[action*="/cart/add"]',
      ".product-form form",
      "[data-add-to-cart-form]",
    ];

    for (const selector of addToCartSelectors) {
      const form = document.querySelector(selector);
      if (form) {
        // Create hidden inputs for variant selection
        if (product.variants) {
          product.variants.forEach((variant) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = variant.name;
            input.value = variant.value;
            form.appendChild(input);
          });
        }

        // Submit form
        form.submit();
        return;
      }
    }

    // Fallback: redirect to cart
    window.location.href = "/cart";
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeWidget);
  } else {
    initializeWidget();
  }

  // Expose API for external use
  window.NUSENSE_TRYON = {
    open: openWidget,
    close: closeWidget,
    version: CONFIG.version,
    config: CONFIG,
  };
})();

// Adds responsive CSS targeting the widget/button without relying on inline overrides
function injectResponsiveStyles() {
  try {
    const styleId = "nusense-tryon-responsive-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.type = "text/css";
    style.appendChild(
      document.createTextNode(`
/* Responsive adjustments for NUSENSE TryON */
#${"nusense-tryon-widget"} {
  /* Respect iOS safe areas */
  padding: 0 !important;
}

/* Prefer dynamic viewport if supported */
@supports (height: 100dvh) {
  #${"nusense-tryon-widget"} { height: 100dvh !important; }
}

/* Button: fluid sizing and full-width on small screens */
#${"nusense-tryon-btn"}, .nusense-tryon-button {
  font-size: clamp(14px, 1.6vw, 16px) !important;
  padding: 12px 20px !important;
}

@media (max-width: 768px) {
  #${"nusense-tryon-btn"}, .nusense-tryon-button {
    width: 100% !important;
    justify-content: center !important;
    padding: 14px 18px !important;
  }
}

@media (max-width: 480px) {
  #${"nusense-tryon-btn"}, .nusense-tryon-button {
    font-size: clamp(13px, 4vw, 15px) !important;
    padding: 14px 16px !important;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .nusense-tryon-button { transition: none !important; }
}
      `)
    );

    document.head.appendChild(style);
  } catch (e) {
    try {
      console.warn("[NUSENSE TryON] Failed to inject responsive styles", e);
    } catch {}
  }
}
