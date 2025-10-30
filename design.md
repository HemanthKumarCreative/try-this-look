## NUSENSE TryON Design System

### Overview
- **Product**: NUSENSE TryON (popup UI)
- **Language**: French labels in UI
- **Theme**: Clean, modern, airy; strong primary red accents; soft neutrals for surfaces; rounded corners; subtle shadows; generous spacing.

### Brand and Logos
- **Wordmark**: `NUSENSE_LOGO.svg`
- **Usage**:
  - Header brand: image in `.logo-text-image` within `.header` left.
  - Footer brand: `.footer-logo` (footer is currently hidden via `.footer { display: none !important; }`).

### Color System
Tokens from `:root` in `popup.css`:
- **Primary**:
  - `--primary`: `#ce0003`
  - `--primary-light`: `#ff1a1d`
  - `--primary-dark`: `#a30002`
  - Scale: `--primary-50` `#fef2f2`, `--primary-100` `#fee2e2`, `--primary-200` `#fecaca`, `--primary-300` `#fca5a5`, `--primary-400` `#f87171`, `--primary-500` `#ce0003`, `--primary-600` `#a30002`, `--primary-700` `#8b0000`, `--primary-800` `#750000`, `--primary-900` `#5c0000`
- **Secondary**:
  - `--secondary`: `#564646`
  - `--secondary-light`: `#6b5a5a`
  - `--secondary-dark`: `#3d3232`
  - Scale: `--secondary-50` `#f8f7f7` → `--secondary-900` `#231e1e`
- **Neutrals**: `--white #ffffff`, `--gray-50 #fafafa`, `--gray-100 #f5f5f5`, `--gray-200 #e5e5e5`, `--gray-300 #d4d4d4`, `--gray-400 #a3a3a3`, `--gray-500 #737373`, `--gray-600 #525252`, `--gray-700 #404040`, `--gray-800 #262626`, `--gray-900 #171717`
- **Semantic**: `--success #10b981`, `--success-light #34d399`, `--warning #f59e0b`, `--warning-light #fbbf24`, `--error #ef4444`, `--error-light #f87171`, `--info #3b82f6`, `--info-light #60a5fa`
- **Background**: Body background gradient `linear-gradient(135deg, var(--primary-50) 0%, var(--white) 100%)`

### Typography
- **Font stack**: `--font-family`: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Sizes (rem)**:
  - `--font-size-xs: 0.75`
  - `--font-size-sm: 0.875` (body base)
  - `--font-size-base: 1`
  - `--font-size-lg: 1.125`
  - `--font-size-xl: 1.25`
  - `--font-size-2xl: 1.5`
  - `--font-size-3xl: 1.875`
- **Line-height**: Body `1.4`
- **Headings**: `.logo-text h1`, `.step-title`, `.result-header h3` use semibold/700 and larger sizes.

### Spacing Scale (rem)
- `--space-1: 0.25`, `--space-2: 0.5`, `--space-3: 0.75`, `--space-4: 1`, `--space-5: 1.25`, `--space-6: 1.5`, `--space-8: 2`, `--space-10: 2.5`, `--space-12: 3`

### Radii
- `--radius-sm: 0.25rem`
- `--radius-md: 0.25rem`
- `--radius-lg: 0.25rem`
- `--radius-xl: 0.25rem`
- `--radius-2xl: 0.25rem`

### Shadows
- `--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)`
- `--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
- `--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
- `--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`

### Motion
- Transitions: `--transition-fast 150ms`, `--transition-normal 250ms`, `--transition-slow 350ms`
- Key animations used: `cartBounce`, `pulse`, `spin`, `fadeInScale`, `progressShimmer`, `glow`, `bounce`, `progressFlow`, `buttonPulse`, `buttonGlow`, `statusShimmer`, and others for fine micro-interactions.
- Motion reduced respects `@media (prefers-reduced-motion: reduce)`.

### Layout
- **Viewport**: Fixed 800x600 canvas within popup; responsive blocks adapt for ≤768px and ≤480px.
- **Header** (`.header`): left brand; right action (`.cart-btn`).
- **Main** (`.main-content`): column layout with `--space-4` gaps; scrollable area.
- **Steps** (`.steps-container`): grid; single column by default, switches to two columns when both previews selected; each `.step` is a card.
- **Preview containers**: `.preview-container` with `.preview-header` and `.preview-image-container`.

### Components
- **Buttons**
  - Primary action: `.generate-btn` (outlined primary with interactive glow/ripple/progress states)
  - Secondary actions: `.buy-now-btn`, `.add-to-cart-btn`, `.download-btn`, `.try-in-store-btn` with semantic color borders
  - Destructive: `.clear-cart-btn` (error gradient)
  - Confirm: `.checkout-btn` (primary gradient)
  - Icon-only small: `.result-download-btn`, `.preview-action-btn`
  - States: `.button-loading`, `.button-success`, `.button-error`, focus-visible outlines per semantic color
- **Inputs**
  - Floating label pattern `.floating-label` with `.form-input` and `.form-label`
  - Password toggle `.password-toggle`
- **Cards**
  - `.step`, `.cart-item`, `.preview-container`, `.status-message`, `.cart-summary`
- **Modals**
  - `.modal` with `.modal-overlay`, `.modal-content`, `.modal-header`, `.modal-body`, `.modal-footer`
- **Gallery**
  - `.gallery-container` grid with preview hover/focus states
  - Demo grid: `.demo-pictures-grid` of `.demo-picture-item`
- **Auth gate**
  - Split layout `.auth-gate-left` (info) and `.auth-gate-right` (forms)

### States and Feedback
- `.status-message` with info/success/error/warning backgrounds
- Loading overlays for `.auth-gate.loading`, `.main-content.loading`, `.person-upload-container.uploading`

### Accessibility
- Hidden scrollbars while preserving scroll
- Focus-visible outlines for interactive elements using brand/semantic colors
- Reduced motion support
- Button sizes meet touch targets (`min-height: 44px` on destructive, ≥48px on main actions)

### Asset Inventory
- Logos: `NUSENSE_LOGO.svg`
- Icons (extension sizes): `icons/16.png`, `icons/20.png`, `icons/29.png`, `icons/32.png`, `icons/40.png`, `icons/48.png`, `icons/50.png`
- Favicon: `favicon.ico`
- Demo photos: `demo_pics/Audrey-Fleurot.jpg`, `demo_pics/french_man.webp`, `demo_pics/frwm2.webp`, `demo_pics/frwm3.jpg`

### Implementation Notes
- Base tokens are defined under `:root` in `popup.css` and consumed via `var(--token)` across components.
- Body, sections, and components use consistent spacing and shadow scales.
- Footer is intentionally hidden; enable by removing `display: none !important` on `.footer`.

### Usage in Other Apps
- Copy `popup.css` tokens block (`:root`) into your app’s global stylesheet.
- Reuse component class names or adapt styles by mapping tokens and semantic color usage.
- Include `NUSENSE_LOGO.svg` where brand wordmark is needed, with `.logo-text-image` sizing.

### Quick Token Block (copy/paste)
```css
:root {
  --primary: #ce0003; --primary-light: #ff1a1d; --primary-dark: #a30002;
  --primary-50: #fef2f2; --primary-100: #fee2e2; --primary-200: #fecaca; --primary-300: #fca5a5; --primary-400: #f87171; --primary-500: #ce0003; --primary-600: #a30002; --primary-700: #8b0000; --primary-800: #750000; --primary-900: #5c0000;
  --secondary: #564646; --secondary-light: #6b5a5a; --secondary-dark: #3d3232;
  --secondary-50: #f8f7f7; --secondary-100: #f0eeee; --secondary-200: #e0dddd; --secondary-300: #c7c2c2; --secondary-400: #a89f9f; --secondary-500: #564646; --secondary-600: #4a3c3c; --secondary-700: #3d3232; --secondary-800: #302828; --secondary-900: #231e1e;
  --white: #ffffff; --gray-50: #fafafa; --gray-100: #f5f5f5; --gray-200: #e5e5e5; --gray-300: #d4d4d4; --gray-400: #a3a3a3; --gray-500: #737373; --gray-600: #525252; --gray-700: #404040; --gray-800: #262626; --gray-900: #171717;
  --success: #10b981; --success-light: #34d399; --warning: #f59e0b; --warning-light: #fbbf24; --error: #ef4444; --error-light: #f87171; --info: #3b82f6; --info-light: #60a5fa;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-size-xs: 0.75rem; --font-size-sm: 0.875rem; --font-size-base: 1rem; --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem; --font-size-2xl: 1.5rem; --font-size-3xl: 1.875rem;
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem; --space-5: 1.25rem; --space-6: 1.5rem; --space-8: 2rem; --space-10: 2.5rem; --space-12: 3rem;
  --radius-sm: 0.25rem; --radius-md: 0.25rem; --radius-lg: 0.25rem; --radius-xl: 0.25rem; --radius-2xl: 0.25rem;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --transition-fast: 150ms ease-in-out; --transition-normal: 250ms ease-in-out; --transition-slow: 350ms ease-in-out;
}
```
