export interface ProductInfo {
  id: string;
  name: string;
  price: number;
  image: string;
  url: string;
  description?: string;
  sizes?: string;
  colors?: string;
  brand?: string;
  category?: string;
  availability?: string;
  rating?: number;
  material?: string;
}

export interface CartItem extends ProductInfo {
  quantity: number;
  timestamp: number;
}

export interface TryOnSession {
  uploadedImage: string | null;
  selectedClothingUrl: string | null;
  generatedImage: string | null;
  timestamp: number;
}

export interface TryOnResponse {
  status: 'success' | 'error';
  image?: string;
  error_message?: {
    code: string;
    message: string;
  };
}

export interface GenerationState {
  isGenerating: boolean;
  currentStep: number;
  progress: number;
}

export type ErrorCode = 
  | 'MODEL_TIMEOUT'
  | 'MISSING_FILES_ERROR'
  | 'SERVER_ERROR'
  | 'CORS_ERROR'
  | 'NETWORK_ERROR';

export const LOADING_MESSAGES = [
  "🎯 Preparing your virtual try-on experience...",
  "📥 Retrieving clothing image from the website...",
  "🎨 Preparing images for generation...",
  "💫 Let us work our magic... This may take a moment.",
  "✨ Finalizing your personalized image...",
  "🎉 Amazing! Your virtual try-on is ready!"
];

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  MODEL_TIMEOUT: "Generation is taking longer than expected. Please try again with simpler images or a better internet connection.",
  MISSING_FILES_ERROR: "Please make sure you have selected both your photo and a clothing item.",
  SERVER_ERROR: "A technical error occurred. Please try again in a few moments.",
  CORS_ERROR: "Image loading error. Please try again.",
  NETWORK_ERROR: "Connection error. Please check your internet connection."
};
