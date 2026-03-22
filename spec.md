# DIVYANSH GAMING

## Current State
Full-featured gaming website with 80+ mini games, 3D avatar customizer, XP/achievements, leaderboards, tournaments, cinematic intro, admin panel, and monetization features.

## Requested Changes (Diff)

### Add
- `public/manifest.webmanifest` — PWA manifest with app name, icons, theme colors, display mode
- `public/sw.js` — Service worker that caches shell assets for offline play and fast load
- `<link rel="manifest">` in index.html
- `<meta name="theme-color">` and `<meta name="mobile-web-app-capable">` tags in index.html
- Service worker registration script in index.html
- PWA install prompt component in the app (shows a subtle "Install App" banner when the browser fires `beforeinstallprompt`)

### Modify
- `index.html` — add manifest link, theme-color meta, apple-touch-icon improvements, SW registration

### Remove
- Nothing removed

## Implementation Plan
1. Write `src/frontend/public/manifest.webmanifest` with DIVYANSH GAMING branding
2. Write `src/frontend/public/sw.js` service worker (cache-first for static assets, network-first for API)
3. Update `src/frontend/index.html` to link manifest, add theme-color, register SW
4. Add a small `PWAInstallBanner` component that listens for `beforeinstallprompt` and shows a neon install button
5. Mount the banner in App.tsx
