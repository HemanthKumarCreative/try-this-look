import { TryOnSession, CartItem, ProductInfo } from '@/types/tryon';

const STORAGE_KEYS = {
  UPLOADED_IMAGE: 'nusense_tryon_uploaded_image',
  GENERATED_IMAGE: 'nusense_tryon_generated_image',
  SELECTED_CLOTHING_URL: 'nusense_tryon_selected_clothing_url',
  LAST_SESSION_DATA: 'nusense_tryon_last_session',
  CART_ITEMS: 'nusense_tryon_cart_items',
  PRODUCT_INFO: 'nusense_tryon_product_info',
} as const;

export const storage = {
  // Session management
  saveSession(session: TryOnSession): void {
    localStorage.setItem(STORAGE_KEYS.LAST_SESSION_DATA, JSON.stringify(session));
  },

  getSession(): TryOnSession | null {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_SESSION_DATA);
    return data ? JSON.parse(data) : null;
  },

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.LAST_SESSION_DATA);
    localStorage.removeItem(STORAGE_KEYS.UPLOADED_IMAGE);
    localStorage.removeItem(STORAGE_KEYS.GENERATED_IMAGE);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_CLOTHING_URL);
  },

  // Image storage
  saveUploadedImage(dataURL: string): void {
    localStorage.setItem(STORAGE_KEYS.UPLOADED_IMAGE, dataURL);
  },

  getUploadedImage(): string | null {
    return localStorage.getItem(STORAGE_KEYS.UPLOADED_IMAGE);
  },

  saveGeneratedImage(dataURL: string): void {
    localStorage.setItem(STORAGE_KEYS.GENERATED_IMAGE, dataURL);
  },

  getGeneratedImage(): string | null {
    return localStorage.getItem(STORAGE_KEYS.GENERATED_IMAGE);
  },

  saveClothingUrl(url: string): void {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CLOTHING_URL, url);
  },

  getClothingUrl(): string | null {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_CLOTHING_URL);
  },

  // Cart management
  getCartItems(): CartItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
    return data ? JSON.parse(data) : [];
  },

  saveCartItems(items: CartItem[]): void {
    localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(items));
  },

  addToCart(product: ProductInfo): void {
    const items = this.getCartItems();
    const existingItem = items.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({
        ...product,
        quantity: 1,
        timestamp: Date.now(),
      });
    }

    this.saveCartItems(items);
  },

  removeFromCart(productId: string): void {
    const items = this.getCartItems().filter(item => item.id !== productId);
    this.saveCartItems(items);
  },

  updateCartItemQuantity(productId: string, quantity: number): void {
    const items = this.getCartItems();
    const item = items.find(i => i.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCartItems(items);
    }
  },

  clearCart(): void {
    localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
  },

  // Product info
  saveProductInfo(product: ProductInfo): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCT_INFO, JSON.stringify(product));
  },

  getProductInfo(): ProductInfo | null {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCT_INFO);
    return data ? JSON.parse(data) : null;
  },
};
