import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppBridgeRouter } from '../AppBridgeRouter';

// Mock @shopify/app-bridge-react
vi.mock('@shopify/app-bridge-react', () => ({
  useRoutePropagation: vi.fn(),
}));

describe('AppBridgeRouter', () => {
  it('should render children without errors', () => {
    const { container } = render(
      <BrowserRouter>
        <AppBridgeRouter>
          <div>Test Content</div>
        </AppBridgeRouter>
      </BrowserRouter>
    );

    expect(container.textContent).toBe('Test Content');
  });

  it('should handle route propagation gracefully', () => {
    const { container } = render(
      <BrowserRouter>
        <AppBridgeRouter>
          <div>Router Test</div>
        </AppBridgeRouter>
      </BrowserRouter>
    );

    expect(container.textContent).toBe('Router Test');
  });
});

