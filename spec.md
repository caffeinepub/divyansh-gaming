# DIVYANSH GAMING

## Current State
The `CinematicIntro.tsx` component plays a 60-second, 9-scene text-based cinematic intro with Web Audio sounds, particle effects, scan lines, and animated visuals. The intro plays once per session and is replayable via a button in the hero section.

## Requested Changes (Diff)

### Add
- A video phase at the very START of the cinematic intro (before Scene 1), where the uploaded video (`/assets/intro-video.mp4`) plays fullscreen with controls disabled.
- A `videoPhase` state: when `true`, the video plays fullscreen; when the video ends (or user skips), `videoPhase` becomes `false` and the existing 9-scene text cinematic begins.
- The video should autoplay, muted initially (to comply with browser autoplay policies), with a visible "SKIP" button in the top-right.
- After the video ends naturally, smoothly fade-transition into the text cinematic scenes.
- A `useRef` for the video element to control playback.

### Modify
- The main `CinematicIntro` component: add `videoPhase` state initialized to `true`, and conditionally render either the video player or the existing cinematic scene content.
- The `complete`/skip button: during video phase, clicking skip ends the video phase and starts the text cinematic (does NOT skip the entire intro).
- Keep the existing 9-scene cinematic fully intact after the video phase ends.

### Remove
- Nothing is removed.

## Implementation Plan
1. In `CinematicIntro.tsx`, add `const [videoPhase, setVideoPhase] = useState(true)` and `const videoRef = useRef<HTMLVideoElement>(null)`.
2. Add a `handleVideoEnd` function that sets `videoPhase(false)` and starts the text cinematic (the existing useEffect already handles start on `visible` but needs to be gated on `!videoPhase`).
3. Conditionally render: if `videoPhase`, show a fullscreen `<video>` element with `src="/assets/intro-video.mp4"`, `autoPlay`, `playsInline`, `muted={false}` (try unmuted, fall back gracefully), object-fit cover, plus Skip button that calls `() => setVideoPhase(false)`.
4. When `videoPhase` is false, render the existing cinematic scene content (unchanged).
5. Gate the animation `rafRef` useEffect on `!videoPhase && visible`.
6. When `forceShow` changes to true, reset `videoPhase` to `true` as well so replay also shows the video.
