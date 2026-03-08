# DIVYANSH GAMING

## Current State

The site already has:
- Animated live wallpaper background (3D canvas, neon grid, warp stars)
- Navbar with many section links
- Hero section
- 3D Lobby section
- Games section (5 featured games)
- Car Racing mini game
- Mini Games section (10 games)
- Space Shooter 3D with power-ups, enemies, boss waves
- Multiplayer Pong
- Daily Challenge
- Tournament Bracket
- XP & Leveling system
- Achievements section (22 regular + 10 secret badges)
- 3D Avatar Customizer
- 3D Platformer
- Leaderboard (per-game filter, player search, player profiles)
- News/Blog section (fetched from backend, fallback static posts)
- Positive Thoughts section
- ARIA AI chatbot (colorful, with sound effects)
- Day/Night toggle + 4 neon color themes
- Animated loading screen
- Sound effects
- Footer with "Made with ♥ by Divyansh Yadav (Creator)"

Backend supports: games, leaderboard entries (with score submission), news posts.

## Requested Changes (Diff)

### Add

1. **Gaming Blog/News section enhancement** -- expand the existing news section with a "New game added every week!" update banner and richer article cards
2. **YouTube embed section** -- a new "Watch & Learn" section with 6 popular gaming videos embedded via YouTube iframe
3. **Daily Login Streak** -- a widget/section that tracks consecutive day logins, shows streak count, flame animation, and displays a milestone reward (XP bonus) at day 3, 7, 14, 30
4. **Weekly Leaderboard Reset** -- show a "Weekly Champions" leaderboard that resets every week; stored in localStorage with last-reset timestamp; displays special prize badge for top 3
5. **Invite Friends section** -- a shareable link/CTA section where players can copy the site URL or share to social, with a "Beat your friend's score" prompt
6. **About / Contact page section** -- a proper About section with Divyansh's gaming story, mission statement, and a contact form (fields: name, email, message) that is purely frontend (no email sending)
7. **Favicon** -- a generated logo favicon set in index.html
8. **Mobile performance** -- ensure lazy-loading on heavy sections (add `loading="lazy"` to images, use Suspense boundaries where appropriate)

### Modify

- **News section** -- add a sticky "New game added every week!" announcement banner above the news grid
- **Navbar** -- add links for: YouTube, Streak, Weekly LB, Invite, About
- **index.html** -- set favicon, proper title, meta description for SEO

### Remove

Nothing removed.

## Implementation Plan

1. Generate favicon image (gamepad logo, neon cyan on dark)
2. Update `index.html` with favicon link, page title "DIVYANSH GAMING | Play, Compete & Dominate", meta description
3. Add `DailyStreakSection` component -- uses localStorage to track `lastLoginDate` and `currentStreak`, shows flame animation, milestone rewards (XP awards at streak 3/7/14/30)
4. Add `WeeklyLeaderboardSection` component -- takes the global leaderboard data, filters by current week (stored reset time in localStorage), shows top 3 with special "Weekly Champion" crown badge
5. Add `InviteFriendsSection` component -- shows site URL in a styled copy-to-clipboard input, social share buttons (Twitter/X, WhatsApp), "Challenge a friend" flavor copy
6. Add `AboutContactSection` component -- two columns: left is brand story/mission, right is a contact form (name, email, message, submit button) that shows a success toast; purely frontend
7. Add `YouTubeSection` component -- 2-row grid of 6 embedded YouTube videos (popular gaming trailers/highlights) using iframes with `loading="lazy"`
8. Update `NewsSection` -- add sticky "🎮 New game added every week!" banner above the grid
9. Update `App.tsx` -- insert all new sections in logical order, add navbar links
10. Wire `DailyStreakSection` to `awardXP` hook for streak milestone rewards
