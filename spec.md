# DIVYANSH GAMING — Car Racing Game

## Current State
A gaming website for "DIVYANSH GAMING" with:
- Hero section with branding
- Games showcase section (5 games listed)
- Leaderboard section
- News section
- Footer
- Backend: stores games, leaderboard entries, news posts

## Requested Changes (Diff)

### Add
- A fully playable browser-based car racing game embedded directly in the website
- The game features:
  - A player car controlled with arrow keys or WASD
  - Oncoming traffic/obstacle cars that scroll toward the player
  - Score counter that increases over time
  - Speed increases over time making it harder
  - Lives/health system (3 lives, lose one on collision)
  - Game Over screen with final score and restart button
  - High score tracking (stored in backend leaderboard with player name "Divyansh Gamer")
  - Racing track with lane markings, scrolling road effect
- A new "Race" nav link pointing to the racing game section
- A dedicated "Play Now" button in the games section that scrolls to the racing game
- Backend: new leaderboard entry type for racing scores

### Modify
- App.tsx: Add RacingGame section between GamesSection and LeaderboardSection
- Navbar: Add "Race" link
- The existing "Hyperdrive X" game card should link to the racing game section
- Footer games list: add "Car Racing"

### Remove
- Nothing removed

## Implementation Plan
1. Build a Canvas-based car racing game component (RacingGame) in React using useRef + requestAnimationFrame
2. Game mechanics: scrolling road, player car movement, enemy car spawning, collision detection, score/lives system
3. Wire score submission to backend leaderboard on game over
4. Add RacingGame section to App.tsx with proper id anchor
5. Update Navbar to include "Race" link
6. Style consistently with the existing dark gaming aesthetic (neon colors, OKLCH tokens)
