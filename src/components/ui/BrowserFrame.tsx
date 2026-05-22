import { useState, useRef, useCallback, useEffect } from 'react'
import { Play, Pause, Maximize2 } from 'lucide-react'

type Props = {
  videoSrc: string
  urlBar?: string
  className?: string
  large?: boolean
  /** Start playing when scrolled into view */
  playOnVisible?: boolean
  /** Skip first N seconds (e.g. blank/bright frames at file start) */
  trimStartSec?: number
}

const CONTROLS_HEIGHT = '4.5rem'
const SKIP_SECONDS = 10
const DOUBLE_TAP_MS = 320

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function UrlBar({ url }: { url: string }) {
  const parts = url.split('.')
  if (parts.length >= 3) {
    const host = parts.slice(0, -1).join('.')
    const tld = parts[parts.length - 1]
    const hostParts = host.split('.')
    const brand = hostParts.pop() ?? host
    const subdomain = hostParts.join('.')
    return (
      <span className="truncate">
        <span className="text-sky-200/70">{subdomain ? `${subdomain}.` : ''}</span>
        <span className="text-violet-300 font-medium">{brand}</span>
        <span className="text-sky-200/50">.{tld}</span>
      </span>
    )
  }
  return <span className="text-sky-200/80">{url}</span>
}

export function BrowserFrame({
  videoSrc,
  urlBar = 'exchange-office.nexaclaro.com',
  className = '',
  large = false,
  playOnVisible = false,
  trimStartSec = 0,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const autoPlayAttempted = useRef(false)
  const lastTapAt = useRef(0)
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [skipFlash, setSkipFlash] = useState<{ delta: number; key: number } | null>(null)
  /** Avoid flashing frame 0 before trim seek applies */
  const [trimReady, setTrimReady] = useState(trimStartSec <= 0)

  const trim = Math.max(0, trimStartSec)
  const playableDuration = Math.max(0, duration - trim)
  const displayTime = Math.max(0, currentTime - trim)
  const progress = playableDuration > 0 ? (displayTime / playableDuration) * 100 : 0

  const applyTrimStart = useCallback(
    (v: HTMLVideoElement) => {
      if (trim <= 0 || !Number.isFinite(v.duration)) return
      if (v.currentTime < trim - 0.01) {
        v.currentTime = trim
        setCurrentTime(trim)
      }
      setTrimReady(true)
    },
    [trim],
  )

  const syncTime = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (trim > 0 && v.currentTime < trim) {
      v.currentTime = trim
    }
    setCurrentTime(v.currentTime)
  }, [trim])

  const startPlayback = useCallback(async () => {
    const v = videoRef.current
    if (!v) return
    applyTrimStart(v)
    try {
      await v.play()
      setStarted(true)
      setPlaying(true)
    } catch {
      v.muted = true
      try {
        applyTrimStart(v)
        await v.play()
        setStarted(true)
        setPlaying(true)
      } catch {
        /* user must press play */
      }
    }
  }, [applyTrimStart])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.muted && !v.paused) v.muted = false
    if (v.paused) {
      void startPlayback()
    } else {
      v.pause()
      setPlaying(false)
    }
  }, [startPlayback])

  useEffect(() => {
    setStarted(false)
    setPlaying(false)
    autoPlayAttempted.current = false
  }, [videoSrc])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onMeta = () => {
      setDuration(v.duration)
      applyTrimStart(v)
    }
    const onData = () => applyTrimStart(v)
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('loadeddata', onData)
    return () => {
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('loadeddata', onData)
    }
  }, [videoSrc, applyTrimStart])

  useEffect(() => {
    const onFs = () => {
      setIsFullscreen(document.fullscreenElement === stageRef.current)
    }
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    if (!playOnVisible) return
    const el = stageRef.current
    const v = videoRef.current
    if (!el || !v) return

    v.preload = 'auto'

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && v.readyState < HTMLMediaElement.HAVE_METADATA) {
          v.load()
        }
      },
      { rootMargin: '480px 0px', threshold: 0 },
    )
    preloadObserver.observe(el)

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        const v = videoRef.current
        if (!v) return

        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          if (!autoPlayAttempted.current) {
            autoPlayAttempted.current = true
            void startPlayback()
          } else if (v.paused && started) {
            void v.play().then(() => setPlaying(true))
          }
        } else if (!entry.isIntersecting && !v.paused) {
          v.pause()
          setPlaying(false)
        }
      },
      { threshold: [0, 0.4, 0.6] },
    )

    observer.observe(el)
    return () => {
      preloadObserver.disconnect()
      observer.disconnect()
    }
  }, [playOnVisible, startPlayback, started])

  const handleSeek = (displayValue: number) => {
    const v = videoRef.current
    if (!v || !Number.isFinite(displayValue)) return
    const next = trim + Math.max(0, displayValue)
    v.currentTime = next
    setCurrentTime(next)
  }

  const skipBy = useCallback(
    (delta: number) => {
      const v = videoRef.current
      if (!v) return
      const max = duration || v.duration || 0
      const next = Math.min(Math.max(trim, v.currentTime + delta), max)
      v.currentTime = next
      setCurrentTime(next)
      setSkipFlash({ delta, key: Date.now() })
      window.setTimeout(() => setSkipFlash(null), 700)
      if (v.paused && started) void v.play().then(() => setPlaying(true))
    },
    [duration, started],
  )

  const handleVideoTap = useCallback(
    (clientX: number, width: number) => {
      const now = Date.now()
      const isDoubleTap = now - lastTapAt.current < DOUBLE_TAP_MS

      if (isDoubleTap) {
        if (singleTapTimer.current) {
          clearTimeout(singleTapTimer.current)
          singleTapTimer.current = null
        }
        lastTapAt.current = 0
        const ratio = clientX / width
        if (ratio < 0.45) skipBy(-SKIP_SECONDS)
        else if (ratio > 0.55) skipBy(SKIP_SECONDS)
        return
      }

      lastTapAt.current = now
      if (singleTapTimer.current) clearTimeout(singleTapTimer.current)
      singleTapTimer.current = setTimeout(() => {
        singleTapTimer.current = null
        if (lastTapAt.current === now) togglePlay()
      }, DOUBLE_TAP_MS)
    },
    [skipBy, togglePlay],
  )

  useEffect(() => {
    return () => {
      if (singleTapTimer.current) clearTimeout(singleTapTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!started) return

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        ;(document.activeElement as HTMLElement | null)?.blur()
        skipBy(-SKIP_SECONDS)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        ;(document.activeElement as HTMLElement | null)?.blur()
        skipBy(SKIP_SECONDS)
      } else if (e.key === ' ') {
        e.preventDefault()
        togglePlay()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [started, skipBy, togglePlay])

  const toggleFullscreen = async () => {
    const el = stageRef.current
    if (!el) return
    if (document.fullscreenElement !== el) {
      await el.requestFullscreen?.()
    } else {
      await document.exitFullscreen?.()
    }
  }

  const stageAspect = large
    ? 'aspect-video max-lg:aspect-[4/3] lg:aspect-[16/9]'
    : 'aspect-video'

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-neutral-950 product-glow overflow-hidden ${large ? 'lg:rounded-3xl' : ''} ${className}`}
    >
      <div className="flex items-center gap-2 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 lg:py-3.5 border-b border-white/[0.08] bg-gradient-to-r from-neutral-950 via-slate-950/90 to-neutral-950">
        <span
          className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-[0_0_8px_rgba(255,95,87,0.45)]"
          aria-hidden
        />
        <span
          className="w-3 h-3 rounded-full bg-[#febc2e] shadow-[0_0_8px_rgba(254,188,46,0.4)]"
          aria-hidden
        />
        <span
          className="w-3 h-3 rounded-full bg-[#28c840] shadow-[0_0_8px_rgba(40,200,64,0.4)]"
          aria-hidden
        />
        <div className="flex-1 min-w-0 mx-1 sm:mx-2 lg:mx-3 px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-sky-950/50 via-violet-950/40 to-indigo-950/30 border border-sky-500/25 text-[10px] sm:text-xs font-mono text-center truncate shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <UrlBar url={urlBar} />
        </div>
      </div>

      <div
        ref={stageRef}
        className={`video-stage relative bg-[#0c0c0c] group flex flex-col outline-none ${stageAspect} ${
          isFullscreen ? '!aspect-auto h-screen w-screen max-h-none' : ''
        }`}
        aria-label="Видео плеер: стрелки лево/десно ±10 секунди, space пауза"
      >
        <div className={`relative flex-1 min-h-0 ${isFullscreen ? 'h-full' : 'h-full w-full'}`}>
          <video
            ref={videoRef}
            src={videoSrc}
            className={`absolute inset-0 w-full h-full object-cover object-top bg-black transition-opacity duration-75 ${
              trimReady ? 'opacity-100' : 'opacity-0'
            }`}
            playsInline
            preload={playOnVisible ? 'auto' : 'metadata'}
            onTimeUpdate={syncTime}
            onLoadedMetadata={() => {
              const v = videoRef.current
              if (!v) return
              setDuration(v.duration)
              applyTrimStart(v)
            }}
            onLoadedData={() => {
              const v = videoRef.current
              if (v) applyTrimStart(v)
            }}
            onEnded={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          {/* Skip flash (−10 / +10) */}
          {skipFlash && started && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 z-[12] pointer-events-none px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm ${
                skipFlash.delta < 0 ? 'left-[12%] sm:left-[18%]' : 'right-[12%] sm:right-[18%]'
              }`}
              key={skipFlash.key}
            >
              <span className="text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                {skipFlash.delta < 0 ? `−${SKIP_SECONDS}` : `+${SKIP_SECONDS}`}
              </span>
            </div>
          )}

          {/* Tap: single = play/pause · double left/right = ±10s */}
          {started && (
            <div
              className="absolute inset-x-0 top-0 z-10 touch-manipulation outline-none [-webkit-tap-highlight-color:transparent]"
              style={{ bottom: CONTROLS_HEIGHT }}
              onPointerUp={(e) => {
                if (e.button !== 0) return
                const rect = e.currentTarget.getBoundingClientRect()
                handleVideoTap(e.clientX - rect.left, rect.width)
              }}
              aria-hidden
            />
          )}

          {/* Center play icon when paused */}
          {started && !playing && (
            <div
              className="absolute inset-x-0 top-0 z-[11] flex items-center justify-center pointer-events-none bg-black/20"
              style={{ bottom: CONTROLS_HEIGHT }}
            >
              <span
                className={`flex items-center justify-center rounded-full bg-white text-black shadow-2xl ${
                  large ? 'w-20 h-20' : 'w-16 h-16'
                }`}
              >
                <Play
                  className={`${large ? 'w-8 h-8' : 'w-7 h-7'} ml-1`}
                  fill="currentColor"
                />
              </span>
            </div>
          )}

          {!started && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/40"
              aria-label="Пушти видео"
            >
              <span
                className={`flex items-center justify-center rounded-full bg-white text-black shadow-2xl hover:scale-105 transition-transform ${
                  large ? 'w-20 h-20' : 'w-16 h-16'
                }`}
              >
                <Play className={`${large ? 'w-8 h-8' : 'w-7 h-7'} ml-1`} fill="currentColor" />
              </span>
            </button>
          )}

          {!started && (
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              className="absolute bottom-3 right-3 z-20 p-2.5 rounded-lg bg-black/60 border border-white/15 text-white hover:bg-black/80 hover:border-white/25 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Цел екран"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Control bar — always pinned at bottom, including fullscreen */}
        {started && (
          <div
            className="relative z-30 shrink-0 px-3 sm:px-4 pb-3 pt-6 bg-gradient-to-t from-black via-black/95 to-black/80"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <input
              type="range"
              min={0}
              max={playableDuration || 0}
              step={0.1}
              value={displayTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="video-seeker w-full h-1.5 rounded-full appearance-none cursor-pointer accent-violet-400"
              style={{
                background: `linear-gradient(to right, rgb(167 139 250) ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
              }}
              aria-label="Позиција на видеото"
              aria-valuetext={`${formatTime(displayTime)} од ${formatTime(playableDuration)}`}
            />

            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 rounded-md text-white hover:bg-white/10 transition-colors"
                aria-label={playing ? 'Паузирај' : 'Пушти'}
              >
                {playing ? (
                  <Pause className="w-4 h-4" fill="currentColor" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                )}
              </button>

              <span className="text-[11px] sm:text-xs text-neutral-400 font-mono tabular-nums min-w-[4.5rem]">
                <span className="text-neutral-200">{formatTime(displayTime)}</span>
                <span className="text-neutral-600"> / </span>
                <span>{formatTime(playableDuration)}</span>
              </span>

              <div className="flex-1" />

              <button
                type="button"
                onClick={() => void toggleFullscreen()}
                className="p-1.5 rounded-md text-white hover:bg-white/10 transition-colors"
                aria-label="Цел екран"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
