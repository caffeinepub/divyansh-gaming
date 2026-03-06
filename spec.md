# DIVYANSH GAMING

## Current State
- Full gaming website with Car Racing, Space Shooter 3D, 10 Mini Games (Canvas + DOM)
- Global leaderboard with per-game filter, player search, player profiles, avatar picker
- AI chatbot (ARIA), animated live wallpaper, React Three Fiber 3D background + lobby
- Day/night mode + neon theme selector (cyan/red/green/purple)
- Positive thoughts section, gaming news section
- Backend: Motoko actor with Game, LeaderboardEntry, NewsPost types and submitScore logic

## Requested Changes (Diff)

### Add
1. **Multiplayer Pong** -- local 2-player Pong game (Player 1: W/S keys, Player 2: Up/Down arrows) with score tracking and round winner announcement
2. **Daily Challenge** -- a featured challenge that rotates every 24 hours; shows a countdown timer to next challenge; tracks and saves a "challenge completed today" state in localStorage; displays exclusive badge/reward for completing it; challenge types: beat a target score in a specific mini game or car racing
3. **Tournament System** -- bracket-style single-elimination tournament UI with 8 fictional player slots; user can enter their name and register; bracket shows match-ups and simulates match results with animated reveals; winner gets a trophy + prize announcement
4. **3D Platformer Game** -- new playable 3D game using React Three Fiber: player ball/character that rolls/jumps on floating platforms, uses arrow keys to move and Space to jump, falls off = restart, has collectible stars, score counter, timer, game over + win screen
5. **Nav links** for Multiplayer, Daily Challenge, Tournament, 3D Platformer sections

### Modify
- App.tsx: add 4 new sections (MultiplayerSection, DailyChallengeSection, TournamentSection, Platformer3DSection) inserted before Footer
- Navbar: add links to all 4 new sections
- Footer community links: add Tournaments link

### Remove
- Nothing removed

## Implementation Plan
1. Write new backend with DailyChallenge and Tournament types/methods
2. Create `MultiplayerPong.tsx` -- two-player local Pong on a single Canvas
3. Create `DailyChallenge.tsx` -- daily challenge card with countdown, challenge type, completion badge, localStorage persistence
4. Create `TournamentBracket.tsx` -- 8-player single-elimination bracket, registration form, animated match simulation
5. Create `Platformer3D.tsx` -- R3F 3D platformer: rolling ball, floating platforms, jump physics, star collectibles
6. Add 4 new sections to App.tsx and new nav links
