import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useShopifyAppBridge } from '../useAppBridge';

// Mock @shopify/app-bridge-react BEFORE importing the hook
vi.mock('@shopify/app-bridge-react', () => {
  const mockUseAppBridge = vi.fn();
  return {
    useAppBridge: mockUseAppBridge,
  };
});

describe('useShopifyAppBridge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.location mock
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
        href: 'http://localhost:3000',
        origin: 'http://localhost:3000',
        pathname: '/',
      },
      writable: true,
      configurable: true,
    });
  });

  it('should return shopify object when App Bridge is available', () => {
    const { useAppBridge } = require('@shopify/app-bridge-react');
    const mockShopify = {
      toast: { show: vi.fn() },
      resourcePicker: vi.fn(),
    };
    
    useAppBridge.mockReturnValue(mockShopify);
    
    // Mock URL params with host
    Object.defineProperty(window, 'location', {
      value: {
        search: '?host=test-host',
        href: 'http://localhost:3000?host=test-host',
        origin: 'http://localhost:3000',
        pathname: '/',
      },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useShopifyAppBridge());

    expect(result.current.shopify).toBe(mockShopify);
    expect(result.current.isEmbedded).toBe(true);
  });

  it('should return null shopify when App Bridge is not available', () => {
    const { useAppBridge } = require('@shopify/app-bridge-react');
    useAppBridge.mockImplementation(() => {
      throw new Error('App Bridge not initialized');
    });
    
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
        href: 'http://localhost:3000',
        origin: 'http://localhost:3000',
        pathname: '/',
      },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useShopifyAppBridge());

    expect(result.current.shopify).toBe(null);
    expect(result.current.isEmbedded).toBe(false);
  });

  it('should detect embedded context from host parameter', () => {
    const { useAppBridge } = require('@shopify/app-bridge-react');
    useAppBridge.mockImplementation(() => {
      throw new Error('App Bridge not initialized');
    });
    
    Object.defineProperty(window, 'location', {
      value: {
        search: '?host=encoded-host-value',
        href: 'http://localhost:3000?host=encoded-host-value',
        origin: 'http://localhost:3000',
        pathname: '/',
      },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useShopifyAppBridge());

    expect(result.current.isEmbedded).toBe(true);
    expect(result.current.shopify).toBe(null);
  });

  it('should handle non-embedded scenarios gracefully', () => {
    const { useAppBridge } = require('@shopify/app-bridge-react');
    useAppBridge.mockImplementation(() => {
      throw new Error('App Bridge not initialized');
    });
    
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
        href: 'http://localhost:3000',
        origin: 'http://localhost:3000',
        pathname: '/',
      },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useShopifyAppBridge());

    expect(result.current.shopify).toBe(null);
    expect(result.current.isEmbedded).toBe(false);
  });
});
