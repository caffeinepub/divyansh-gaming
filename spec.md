# DIVYANSH GAMING

## Current State
The `AvatarCustomizer.tsx` component has a 3D avatar with customizable:
- Skin tone (6 options)
- Hair style (6 options: short, long, spiky, bun, fade, bald)
- Hair color (6 options)
- Shirt style (3 options: t-shirt, hoodie, jersey) with 5 color choices
- Pants style (3 options: joggers, cargo, shorts) with 4 color choices

Shoes are rendered on the 3D model but are not customizable (always dark grey). There are no hats, accessories, or shoe style options.

## Requested Changes (Diff)

### Add
- **Hat styles** panel: No Hat, Cap, Beanie, Headband — rendered on the 3D avatar above the hair
- **Hat color** swatches: shown when a hat style other than "No Hat" is selected
- **Shoe styles** panel: Sneakers (current default), Boots, Slides — each with distinct 3D geometry
- **Shoe color** swatches: 5 color options
- **Accessories** panel: None, Glasses (round frames on face), Chain (necklace on chest), Headphones (over ears/head)
- Extend `AvatarConfig` interface to include `hatStyle`, `hatColor`, `shoeStyle`, `shoeColor`, `accessory`
- Update `DEFAULT_CONFIG` with sensible defaults
- Update `handleSave` emoji string to include hat and shoe emojis
- Update `LS_CONFIG_KEY` logic to merge new fields with existing saved data

### Modify
- `Avatar3D` component: render hat, shoe variants, and accessories based on config
- Customization grid: add three new Panel cards (Hat, Shoes, Accessories) — extend existing 2-column grid

### Remove
- Nothing removed

## Implementation Plan
1. Extend `AvatarConfig` type and constants for hat styles/colors, shoe styles/colors, accessories
2. Build 3D hat geometry components: cap (brim + dome), beanie (rounded cylinder), headband (torus)
3. Build shoe style variants in `Avatar3D`: sneakers (existing), boots (taller box), slides (flat box with strap)
4. Add shoe color material driven by `config.shoeColor`
5. Build accessory geometry: glasses (two torus rings + bridge bar), chain (torus necklace), headphones (arc + two pads)
6. Add three new Panel sections to the customizer UI grid with StyleButton and ColorSwatch controls
7. Update `handleSave` to include new fields in emoji string
8. Persist new config fields to localStorage
