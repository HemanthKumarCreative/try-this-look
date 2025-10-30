## NUSENSE TryON — Complete User Flow

### 1) Entry → Popup Loaded
- **Header (top)**: Brand wordmark left, `cart` button right with live count.
- **Status bar**: Persistent message area under header for guidance and errors.
- **Main area**: Two steps stacked; becomes two-column when both selections are made.
- **Footer**: Present in markup but hidden in UI.

### 2) Step 1 — Upload or Select Your Photo (Left side)
- Before selection:
  - Upload area: file input to choose a personal photo.
  - “or” separator.
  - Demo photos grid: 4 preloaded models; click or press Enter/Space to select.
- After selection (upload or demo):
  - Upload and demo grid hide; a `Votre Photo` preview card shows with a clear button.
  - Clearing restores upload area, “or” separator, and demo grid.

### 3) Step 2 — Select Clothing From Current Page (Right side)
- Before selection:
  - A gallery auto-populates from the active page (images and backgrounds heuristically filtered).
  - Each image is clickable; errors (e.g., CORS) are silently filtered.
- After selection:
  - Gallery hides; `Article Sélectionné` preview card shows with a clear button.
  - Clearing restores the gallery.

### 4) Layout Behavior (Left/Right logic)
- Single-column by default on load and on mobile.
- When both selections exist, container applies a two-column layout:
  - Left: Step 1 (`Votre Photo` preview).
  - Right: Step 2 (`Article Sélectionné` preview).
  - Generate controls span full width under both.

### 5) Generate — Try-On Creation
- The `Générer` button is enabled only when both a person photo and a clothing item are selected.
- On submit:
  - Status progresses through fetching clothing image, preparing images, and generating.
  - A progress bar and button loading states reflect progress.
  - Generation posts both images to the backend and waits for a result.

### 6) Results — Success
- The generated try-on image appears in a result card with:
  - Inline small download button over the image.
  - Action buttons: `Acheter Maintenant`, `Ajouter au Panier`, `essayer en magasin`, and `Télécharger` (collage with inputs and product info).
- Download states are enabled once a result exists.

### 7) Results — Error
- If the backend returns an error or fetch fails, an inline error block shows with user-friendly, specific messaging (CORS/network/unknown).

### 8) Cart & Purchase Flow
- Cart count updates as items are added.
- Clicking the header cart opens a modal showing items, quantities, and total.
- Modal actions: clear cart, checkout, remove item, quantity +/- (also via keyboard).
- Checkout simulates a redirect confirmation via status updates.

### 9) Restore & Continuity
- On popup load, previous session data is restored if available:
  - Previously uploaded/demo photo, clothing selection, and any generated image.
  - If a generation was in-flight, the UI resumes with progress and restarts generation.

### 10) Accessibility & Keyboard
- Demo photos are focusable and operable via Enter/Space.
- Clear buttons are keyboard operable.
- Escape closes the cart modal.
- Visible focus styles; reduced motion respected.

### 11) Mobile/Responsive Notes
- For small viewports, flow is single-column; cards and controls stack with adequate spacing.
- Touch targets meet recommended sizes; overflow lists scroll.

### 12) Preconditions and Edge Cases
- Generate requires both inputs; otherwise a friendly status prompt appears.
- Images that fail to load (e.g., CORS) are excluded from selection.
- Clearing either selection disables generate until both are provided again.


