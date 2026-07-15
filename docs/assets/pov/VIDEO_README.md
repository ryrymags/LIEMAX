Place the POV renderer video assets here:

- `imax-demo-poster.jpg`
- `imax-demo-1.43-1024x716.mp4`
- `imax-demo-1.43-1546x1080.mp4`

The renderer lazy-loads the MP4 only after the Three.js POV view mounts, keeps
audio muted by default, and falls back to the poster/fallback texture if video
loading fails.
