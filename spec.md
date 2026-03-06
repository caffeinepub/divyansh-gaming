# DIVYANSH GAMING

## Current State
- Full gaming site with Car Racing, Space Shooter 3D, 10 Mini Games, Multiplayer, Tournament, Daily Challenge
- 22 achievements across 5 categories: level, xp, challenge, tournament, social
- `useAchievements.ts` holds all definitions and `checkAndUnlockAchievements()` trigger
- `AchievementsSection.tsx` renders filter tabs + achievement cards
- `AchievementToast.tsx` shows pop-up on unlock
- No secret/hidden achievement category exists yet

## Requested Changes (Diff)

### Add
- New `AchievementCategory` value: `"secret"`
- 10 secret achievements in `useAchievements.ts`, each triggered by unusual/unexpected in-game events:
  1. **Ghost Racer** — survive 60s in Car Racing without moving lanes (stay in same lane the whole run)
  2. **Speed Demon** — reach max speed in Car Racing (score > 800 in a single run)
  3. **Untouchable** — complete Car Racing with 3 lives still intact (finish with full health, score ≥ 200)
  4. **Stargazer** — stay idle on the Space Shooter start screen for 10 seconds without clicking Start
  5. **Nuke Happy** — use 3 nukes in a single Space Shooter session
  6. **Bullet Storm** — fire 100 bullets in a single Space Shooter session
  7. **Night Owl** — visit the site between midnight and 4am (local time)
  8. **Speed Reader** — complete the Typing Test mini game with 0 errors
  9. **Clicker** — click the ARIA chatbot toggle 5 times in a row within 5 seconds
  10. **Secret Admirer** — scroll to the very bottom of the page and stay there for 5 seconds
- Each secret achievement is initially shown as "???" with a lock icon and a cryptic hint (not the real description) until discovered
- A new "Secret" filter tab in `AchievementsSection.tsx`
- A dedicated `useSecretAchievements.ts` hook that tracks hidden triggers via custom events and localStorage counters
- Secret achievements fire a custom event `secret-trigger` from respective games/components
- Secret achievements use a special "secret" rarity style: deep purple/dark shimmer instead of standard colors

### Modify
- `useAchievements.ts` — extend `AchievementCategory` to include `"secret"`, add secret definitions with `isSecret: true` flag; secret unlocked cards show real content, locked ones show "???" name and cryptic hint
- `AchievementsSection.tsx` — add "Secret" tab; for locked secret achievements, render a special "???" mystery card (no name/icon revealed)
- `RacingGame.tsx` — fire `secret-trigger` events for Ghost Racer, Speed Demon, Untouchable
- `SpaceShooter3D.tsx` — fire `secret-trigger` events for Nuke Happy, Bullet Storm; Stargazer fires after 10s idle on start screen
- `games/TypingTest.tsx` — fire `secret-trigger` for Speed Reader (perfect game)
- `AIChatBot.tsx` — fire `secret-trigger` for Clicker (5 toggles in 5s)
- `App.tsx` — wire Night Owl (time check on mount) and Secret Admirer (scroll sentinel)

### Remove
- Nothing removed

## Implementation Plan
1. Update `useAchievements.ts`: add `isSecret` field, add `"secret"` category, add 10 secret achievement definitions, update `getAchievements()` to mask locked secrets as "???"
2. Update `AchievementsSection.tsx`: add "Secret" filter tab, render mystery card style for locked secrets
3. Add secret trigger event dispatch in `RacingGame.tsx` (Ghost Racer, Speed Demon, Untouchable)
4. Add secret trigger dispatch in `SpaceShooter3D.tsx` (Nuke Happy, Bullet Storm, Stargazer idle)
5. Add secret trigger dispatch in `games/TypingTest.tsx` (Speed Reader)
6. Add secret trigger dispatch in `AIChatBot.tsx` (Clicker)
7. Wire Night Owl and Secret Admirer triggers in `App.tsx`
8. Update `AchievementToast.tsx` to show special "SECRET UNLOCKED!" header for secret achievements
