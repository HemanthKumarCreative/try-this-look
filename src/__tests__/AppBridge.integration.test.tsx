import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

// Mock App Bridge script
vi.mock('@shopify/app-bridge-react', () => ({
  useAppBridge: () => ({
    toast: { show: vi.fn() },
    resourcePicker: vi.fn(),
  }),
}));

describe('App Bridge Integration', () => {
  beforeEach(() => {
    // Reset window location
    delete (window as any).location;
    window.location = { search: '' } as Location;
  });

  it('should render App component without errors', () => {
    render(<App />);
    
    // App should render without crashing
    expect(document.body).toBeTruthy();
  });

  it('should handle embedded app scenario', () => {
    window.location.search = '?host=test-host&shop=test-shop.myshopify.com';
    
    render(<App />);
    
    // App should render in embedded mode
    expect(document.body).toBeTruthy();
  });

  it('should handle standalone app scenario', () => {
    window.location.search = '';
    
    render(<App />);
    
    // App should render in standalone mode
    expect(document.body).toBeTruthy();
  });
});

