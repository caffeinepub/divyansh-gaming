# DIVYANSH GAMING

## Current State
A full 3D gaming website with React Three Fiber background scene (warp stars, neon grid, floating gamepad, particle sparks), 10 mini games, car racing game, Space Shooter 3D, global leaderboard with player profiles/search/avatars, AI chatbot (ARIA), sound effects, glowing crosshair cursor, and positive thoughts section. The app is always in dark mode with a fixed cyan/violet/pink neon color scheme.

## Requested Changes (Diff)

### Add
- **Animated Loading Screen**: Full-screen loading screen shown on first app mount with animated DIVYANSH GAMING logo (spinning gamepad, glowing title text, neon progress bar, particle burst), auto-dismisses after assets settle (~2.5s).
- **Day/Night Mode Toggle**: Persisted in localStorage. Night mode = current dark cyberpunk theme. Day mode = lighter background (deep navy/indigo instead of near-black), softer neon glows, lighter card surfaces — still vibrant/gaming aesthetic.
- **Custom Site Theme Selector**: Three neon accent themes selectable via a popover/panel in the navbar or a floating controls panel: Cyan (default), Red Neon, Green Neon, Purple Neon. Theme drives the primary accent color (--neon-primary) used across glows, borders, gradients, and 3D scene emissives. Persisted in localStorage.
- **3D Lobby Scene Enhancements**: Expand Scene3D background with more 3D objects: floating trophy, orbiting gem crystals, a spinning DNA-helix-like strand of orbs, and a more dramatic lighting rig. Add a dedicated "3D Lobby" section (above the hero or as a full-height banner) showing the interactive R3F scene with camera mouse-parallax and rotating platform with floating objects.

### Modify
- `App.tsx`: Add `ThemeProvider` context wrapping entire app. Inject CSS variables for the active theme accent into `:root`. Add loading screen before app renders. Add theme/mode controls to navbar.
- `Scene3D.tsx`: Accept optional theme color prop to tint emissive materials. Add new 3D objects (trophy, crystals, helix strand).
- `index.css`: Add day-mode CSS overrides and CSS custom properties for theme accent colors (red, green, purple, cyan variants).

### Remove
- Nothing removed.

## Implementation Plan
1. Generate logo image for loading screen (gamepad + "DIVYANSH GAMING" text, dark bg).
2. Create `ThemeContext.tsx` — exposes `{ theme, setTheme, isDark, setIsDark }` with localStorage persistence. Theme values: `cyan | red | green | purple`.
3. Update `index.css` — add CSS vars for each theme accent (`--accent-*` sets), day-mode class overrides for background/surface colors.
4. Create `LoadingScreen.tsx` — full-screen animated intro with logo, progress bar, particle burst, auto-dismiss.
5. Create `ThemeControls.tsx` — compact floating panel (or inline in navbar) with day/night toggle switch and 4 theme color swatches.
6. Update `Scene3D.tsx` — add trophy, orbiting crystals, helix strand objects; accept theme color prop for emissives.
7. Update `App.tsx` — wrap with ThemeProvider, mount LoadingScreen, add ThemeControls to navbar area.
8. Validate and deploy.
