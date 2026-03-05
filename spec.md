# DIVYANSH GAMING — Full 3D Upgrade

## Current State
- Full gaming website with: hero section, games grid, car racing game, 10 mini games, leaderboard, news, positive thoughts, AI chatbot, glowing crosshair cursor, sound effects, animated live wallpaper (canvas 2D: star warp tunnel, perspective grid, laser streaks)
- Background: `LiveWallpaper.tsx` — 2D canvas with warp stars, perspective grid floor, laser streaks
- Sections: 2D flat layouts with framer-motion scroll animations, neon glow CSS effects
- React Three Fiber (`@react-three/fiber`), `@react-three/drei`, `@react-three/cannon`, and `three` are already installed in package.json

## Requested Changes (Diff)

### Add
- **3D Live Background** (`Scene3D.tsx`): Replace the `LiveWallpaper.tsx` 2D canvas with a full-screen React Three Fiber `<Canvas>` scene containing:
  - Warp-speed star field (instanced mesh, 800 stars flying toward camera along Z)
  - Neon perspective grid floor (custom `PlaneGeometry` + `LineSegments` or `GridHelper`) scrolling toward camera
  - Floating 3D game controller model built from `BoxGeometry` / `SphereGeometry` primitives — glowing neon material, slowly rotating
  - Particle system: random neon spark bursts drifting across the scene
  - Bloom post-processing via `@react-three/postprocessing` (if available) or a custom emissive glow approach
- **3D Hero Floating Text** (`Hero3DText.tsx`): The hero section's "DIVYANSH GAMING" title gets a 3D layered depth effect using CSS `transform: perspective()` + rotateX/rotateY on mouse move (pure CSS/JS, no R3F needed here — keep it performant)
- **3D Game Cards** (`GameCard3D`): Cards in the games grid tilt in 3D on hover using CSS `perspective` + `rotateX/rotateY` driven by mouse position within the card
- **3D Section Dividers**: Between each major section, add a thin 3D-looking neon divider line with a glowing orb traveling along it (CSS perspective transform)
- **3D Floating Icons** in hero stats row: each stat (Active Players, Games Available, Tournaments Won) gets a small 3D-spinning icon rendered using inline CSS 3D transforms with `animation: spin3d`

### Modify
- `LiveWallpaper.tsx`: Replace 2D canvas implementation with `Scene3D.tsx` R3F canvas (or keep LiveWallpaper as a thin wrapper that mounts Scene3D)
- `App.tsx`: Import and use new 3D components; apply 3D card tilt to `GameCard`; add 3D section separators; hero stats get 3D icons; hero title gets 3D mouse-track perspective
- `index.css`: Add CSS 3D utility classes: `.card-3d-tilt`, `.spin3d`, `.depth-text`, `@keyframes spin3d`

### Remove
- The 2D canvas star/grid/streak rendering code in `LiveWallpaper.tsx` (replaced by R3F scene)

## Implementation Plan
1. Create `src/components/Scene3D.tsx` — full-screen R3F Canvas with: warp star field (InstancedMesh), neon grid plane, floating 3D controller model from primitives, particle sparks, bloom via `UnrealBloomPass` or emissive materials
2. Replace `LiveWallpaper.tsx` contents to mount `Scene3D.tsx` in a fixed full-screen container at z-index 0
3. Add CSS 3D tilt logic to `GameCard` in `App.tsx` — `onMouseMove` tracks pointer offset within card and applies `rotateX/rotateY` via inline style `transform: perspective(800px) rotateX(Xdeg) rotateY(Ydeg)`
4. Add 3D hero title parallax: `HeroSection` listens to `mousemove` on `document`, applies `perspective(1200px) rotateX/rotateY` (max ±6deg) to the heading wrapper
5. Add 3D spinning CSS icons to hero stats (use `@keyframes` rotate3d in index.css)
6. Add section divider component with traveling glow orb between sections
7. Validate typecheck + build; fix any errors
