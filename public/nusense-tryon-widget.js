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
    if (window.NUSENSE_DEBUG) {
      console.log(`[NUSENSE TryON] ${message}`, ...args);
    }
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
      border-radius: 8px;
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

    const widget = document.createElement("div");
    widget.id = CONFIG.widgetId;
    widget.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 999999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
    `;

    const iframe = document.createElement("iframe");
    iframe.src = `${CONFIG.widgetUrl}/widget`;
    iframe.style.cssText = `
      width: 100%;
      max-width: 1200px;
      height: 90vh;
      border: none;
      border-radius: 12px;
      background: white;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;

    // Close button
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "×";
    closeButton.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000000;
    `;

    closeButton.addEventListener("click", closeWidget);

    widget.appendChild(iframe);
    widget.appendChild(closeButton);
    document.body.appendChild(widget);

    widgetIframe = iframe;
    return widget;
  }

  function openWidget() {
    log("Opening widget");

    if (!isWidgetLoaded) {
      const widget = createWidget();
      isWidgetLoaded = true;
    }

    const widget = document.getElementById(CONFIG.widgetId);
    if (widget) {
      widget.style.display = "flex";
      isWidgetOpen = true;
      document.body.style.overflow = "hidden";

      // Send product data to widget
      sendProductData();
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

      // Product images
      const imageSelectors = [
        ".product-photos img",
        ".product-images img",
        "[data-product-image]",
        ".product-gallery img",
        'img[alt*="product" i]',
      ];

      for (const selector of imageSelectors) {
        const images = document.querySelectorAll(selector);
        images.forEach((img) => {
          if (
            img.src &&
            !img.src.includes("placeholder") &&
            !data.images.includes(img.src)
          ) {
            data.images.push(img.src);
          }
        });
      }

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
          break;
      }
    });

    // Close on escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isWidgetOpen) {
        closeWidget();
      }
    });

    // Close on outside click
    document.addEventListener("click", function (event) {
      if (isWidgetOpen && event.target.id === CONFIG.widgetId) {
        closeWidget();
      }
    });
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
