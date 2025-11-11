# Test Setup Summary

## ✅ Test Infrastructure Created

The App Bridge implementation includes comprehensive unit tests. Here's what has been set up:

### Test Files Created

1. **`src/hooks/__tests__/useAppBridge.test.ts`**
   - Tests for `useShopifyAppBridge` hook
   - Tests App Bridge availability detection
   - Tests embedded context detection
   - Tests error handling

2. **`src/providers/__tests__/AppBridgeProvider.test.tsx`**
   - Tests for `AppBridgeProviderWrapper` component
   - Tests rendering in different scenarios
   - Tests host parameter handling

3. **`src/components/__tests__/AppBridgeRouter.test.tsx`**
   - Tests for `AppBridgeRouter` component
   - Tests route propagation

4. **`src/__tests__/AppBridge.integration.test.tsx`**
   - Integration tests for App component
   - Tests embedded and standalone scenarios

5. **`src/test/setup.ts`**
   - Test setup and configuration
   - Mock window.location
   - Mock App Bridge global

6. **`vitest.config.ts`**
   - Vitest configuration
   - jsdom environment
   - Path aliases
   - Setup files

### Dependencies Added

The following testing dependencies have been added to `package.json`:

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^14.3.1",
    "@testing-library/user-event": "^14.6.1",
    "@vitest/ui": "^1.6.1",
    "jsdom": "^23.2.0",
    "vitest": "^1.6.1"
  }
}
```

### Test Scripts

The following npm scripts have been added:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## 🚀 Running Tests

### Prerequisites

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Verify installation**:
   ```bash
   npx vitest --version
   ```

### Running Tests

1. **Run all tests**:
   ```bash
   npm test
   ```
   or
   ```bash
   npx vitest run
   ```

2. **Run tests in watch mode**:
   ```bash
   npm test
   ```
   (Vitest runs in watch mode by default)

3. **Run tests with UI**:
   ```bash
   npm run test:ui
   ```

4. **Run tests with coverage**:
   ```bash
   npm run test:coverage
   ```

## 📝 Test Coverage

The tests cover:

- ✅ App Bridge hook (`useShopifyAppBridge`)
  - App Bridge availability detection
  - Embedded context detection
  - Error handling
  - Host parameter parsing

- ✅ App Bridge Provider (`AppBridgeProviderWrapper`)
  - Component rendering
  - Host parameter handling
  - Standalone mode

- ✅ App Bridge Router (`AppBridgeRouter`)
  - Route propagation
  - Component rendering

- ✅ Integration tests
  - App component rendering
  - Embedded app scenarios
  - Standalone app scenarios

## 🔧 Troubleshooting

### Issue: Vitest not found

**Solution**: Install dependencies:
```bash
npm install
```

### Issue: Module not found errors

**Solution**: Check that all dependencies are installed:
```bash
npm install --legacy-peer-deps
```

### Issue: Tests fail with "App Bridge not initialized"

**Solution**: This is expected in test environment. The tests mock App Bridge to test both scenarios (initialized and not initialized).

### Issue: Window.location errors

**Solution**: The test setup mocks `window.location`. If you see errors, check that `src/test/setup.ts` is properly configured.

## 📚 Next Steps

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Run tests**:
   ```bash
   npm test
   ```

3. **Review test results** and fix any failures

4. **Add more tests** as needed for your specific use cases

## 🎯 Test Best Practices

1. **Mock external dependencies**: App Bridge is mocked in tests to avoid dependency on actual Shopify environment

2. **Test both scenarios**: Tests cover both embedded and standalone scenarios

3. **Test error handling**: Tests verify graceful handling of errors (e.g., App Bridge not initialized)

4. **Use descriptive test names**: Test names clearly describe what they're testing

5. **Keep tests focused**: Each test focuses on a specific behavior

## 📖 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Shopify App Bridge Documentation](https://shopify.dev/docs/api/app-bridge-library)

---

**Status**: ✅ Test infrastructure complete
**Next Step**: Install dependencies and run tests

