/** Wait until the browser has a decoded frame ready to paint (avoids white flash). */
export function waitForVideoFrame(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      if ('requestVideoFrameCallback' in video) {
        video.requestVideoFrameCallback(() => resolve())
      } else {
        requestAnimationFrame(() => resolve())
      }
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      done()
      return
    }

    video.addEventListener('loadeddata', done, { once: true })
  })
}
