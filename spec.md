# DIVYANSH GAMING

## Current State
The site has an `AnimatedBackground` component with:
- Pulsing hex grid (CSS SVG pattern)
- Four aurora orbs (blurred radial gradients, motion-animated)
- Three diagonal beam sweeps
- 25 floating particles (motion-animated dots)
- Scanlines overlay
- Circuit board CSS pattern overlay

## Requested Changes (Diff)

### Add
- A full-screen `<canvas>` live wallpaper layer rendered at `z-index: 0` behind all content
- Canvas renders a Three.js or requestAnimationFrame-based scene with:
  - Fast-flying neon star particles moving toward the viewer (hyperspace/warp tunnel effect)
  - A continuous neon grid floor/perspective plane scrolling toward viewer (like a retro-futuristic racing game)
  - Occasional bright shooting-star/laser streaks across the screen
  - Color palette: electric cyan, neon violet, hot pink accent — matching existing CSS tokens
- A `LiveWallpaper` React component encapsulating the canvas and all animation logic
- The component uses `requestAnimationFrame` loop with proper cleanup on unmount

### Modify
- Replace existing `AnimatedBackground` component in `App.tsx` with the new `LiveWallpaper` component
- Keep existing aurora orbs, hex grid, scanlines, and circuit overlay as secondary CSS layers on top of the canvas for depth
- Reduce some existing Motion animations to avoid visual overload (orb opacity slightly reduced)

### Remove
- The current hex grid motion pulsing (replaced by the live canvas energy)
- Redundant beam sweeps (the canvas shooting stars serve this role)

## Implementation Plan
1. Create `src/frontend/src/components/LiveWallpaper.tsx` with a canvas-based animation:
   - requestAnimationFrame loop
   - Warp/hyperspace star particles (hundreds of points flying from center outward)
   - Neon perspective grid floor using 2D canvas perspective transform lines
   - Occasional shooting laser/streak lines
   - Resize handling
   - Cleanup on unmount
2. Update `App.tsx`:
   - Import `LiveWallpaper`
   - Replace `AnimatedBackground` JSX call with `<LiveWallpaper />`
   - Keep aurora orbs, scanlines, circuit as a second overlay layer
   - Remove hex grid pulsing motion div (kept as static CSS underneath)
