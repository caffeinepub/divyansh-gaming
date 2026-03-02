# DIVYANSH GAMING

## Current State
The site has a dark cyberpunk aesthetic with:
- A static hero background image with a plain gradient overlay
- A simple CSS grid pattern and scanlines on the hero
- 40 floating particles in the hero section
- Solid flat dark backgrounds on all other sections (games, leaderboard, news, footer)
- Basic radial blur glows in section corners

## Requested Changes (Diff)

### Add
- Animated hex grid pattern as a persistent full-page background layer
- Moving beam/streak lights that sweep across the background
- Pulsing radial aura/orb effects layered behind all sections
- A noise/grain texture overlay for depth
- Parallax depth lines that subtly animate on scroll
- Glowing circuit board trace lines on section transitions
- More immersive per-section background differentiation (each section gets a unique ambient glow color treatment)
- Animated grid that shifts/distorts on the hero for a holographic look

### Modify
- `index.css`: Add new keyframe animations for hex pulse, beam sweep, circuit trace, and aurora drift
- `App.tsx`: Replace `ParticleField` with a richer `AnimatedBackground` component that includes hex grid + orbs + beams. Apply unique per-section background treatments.
- All section backgrounds: richer gradient stops with more depth, less flat

### Remove
- Nothing removed — all existing content retained

## Implementation Plan
1. Add new CSS keyframe animations and background utility classes to `index.css`
2. Replace `ParticleField` with a full-viewport `AnimatedBackground` component (hex grid, pulsing orbs, beam sweeps, particles combined)
3. Apply a persistent animated background layer that sits behind all page content
4. Give each section a richer background treatment with unique color temperament
5. Validate build passes
