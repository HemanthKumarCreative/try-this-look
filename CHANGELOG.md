# Changelog

All notable changes to the NUSENSE TryON project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Automatic Image Transmission
- ✨ **Automatic Product Image Transmission**: Product images now transmit automatically to the widget iframe without requiring any manual configuration
- 🔧 **Priority-Based Image Extraction**: Intelligent image extraction with three fallback mechanisms:
  1. Liquid-generated product data (most reliable)
  2. Shopify product JSON extraction
  3. DOM-based extraction (fallback)
- 🔒 **Enhanced Security**: Built-in origin validation, message type validation, and error handling
- 🐛 **Debug Mode**: Configurable debug logging for troubleshooting image transmission issues
- 📱 **Theme Compatibility**: Works automatically with all Shopify themes (2.0+ and legacy)

### Changed
- 🔄 **Theme App Extension**: Enhanced `nusense-tryon-script.liquid` with automatic message listener
- 📝 **Documentation**: Updated integration guides to reflect automatic image transmission

### Technical Details
- Added automatic message listener in Theme App Extension snippet
- Implements `postMessage` API for secure cross-origin communication
- Supports multiple image source formats (Liquid, JSON, DOM)
- Graceful error handling for edge cases
- Zero merchant configuration required

### Migration Guide
**For Merchants:**
- No action required! The update is automatic.
- If you previously added manual image transmission scripts, they will continue to work but are no longer necessary.
- The automatic transmission takes precedence and handles everything.

**For Developers:**
- The implementation is backward compatible
- Existing manual integrations will continue to work
- New installations automatically use the enhanced transmission method
- Debug mode can be enabled via shop metafields: `shop.metafields.nusense.debug_mode`

---

## Previous Versions

### Version History
- Initial release with manual image transmission
- Theme App Extension support
- Basic widget functionality

---

## How to Use

### Enable Debug Mode (for troubleshooting)

Set the debug metafield in your Shopify admin:
```
Namespace: nusense
Key: debug_mode
Value: true
```

This will enable detailed console logging for image transmission debugging.

### Verify Automatic Transmission

1. Install/update the NUSENSE TryON app
2. Add the button block to a product page
3. Open the widget
4. Check browser console (with debug mode enabled) for:
   - "Image transmission listener initialized"
   - "Received image request from iframe"
   - "Sent images to iframe"

---

**For questions or support, refer to:**
- `AUTOMATIC_IMAGE_TRANSMISSION_PLAN.md` - Complete implementation plan
- `IMPLEMENTATION_COMPLETE.md` - Implementation details
- `SHOPIFY_INTEGRATION.md` - Integration guide

