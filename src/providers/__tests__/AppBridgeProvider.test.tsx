import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { AppBridgeProviderWrapper } from '../AppBridgeProvider';

// Mock @shopify/app-bridge-react
vi.mock('@shopify/app-bridge-react', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => <div data-testid="app-bridge-provider">{children}</div>,
}));

describe('AppBridgeProviderWrapper', () => {
  beforeEach(() => {
    // Reset window location
    delete (window as any).location;
    window.location = { search: '' } as Location;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render children when no host parameter is present', () => {
    window.location.search = '';
    
    const { container } = render(
      <AppBridgeProviderWrapper apiKey="test-api-key">
        <div>Test Content</div>
      </AppBridgeProviderWrapper>
    );

    expect(container.textContent).toBe('Test Content');
  });

  it('should render children when apiKey is not provided', () => {
    window.location.search = '?host=test-host';
    
    const { container } = render(
      <AppBridgeProviderWrapper apiKey="">
        <div>Test Content</div>
      </AppBridgeProviderWrapper>
    );

    expect(container.textContent).toBe('Test Content');
  });

  it('should render children in standalone mode', () => {
    window.location.search = '';
    
    const TestComponent = () => <div>Standalone Mode</div>;
    
    const { container } = render(
      <AppBridgeProviderWrapper apiKey="test-api-key">
        <TestComponent />
      </AppBridgeProviderWrapper>
    );

    expect(container.textContent).toBe('Standalone Mode');
  });
});

