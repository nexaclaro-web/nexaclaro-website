# Trim platform-demo.webm (optional permanent fix)

The site skips the first **0.4s** at playback (`src/lib/platformDemoVideo.ts`). To cut that segment out of the file itself (requires [ffmpeg](https://ffmpeg.org)):

```bash
ffmpeg -i public/assets/platform-demo.webm -ss 0.4 -c copy public/assets/platform-demo-trimmed.webm

Then replace the original or update paths to `platform-demo-trimmed.webm` and set `PLATFORM_DEMO_TRIM_START_SEC` to `0`.

Adjust `-ss 0.4` (e.g. `0.3` or `0.5`) if needed after previewing the export.
