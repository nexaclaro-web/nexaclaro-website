import { useRef, useState, useCallback, useEffect } from 'react'

const DESKTOP_GRADIENT = (x: number, y: number) =>
  `radial-gradient(circle 220px at ${x}% ${y}%, rgba(255,255,255,0.92) 0%, rgba(200,220,255,0.45) 14%, rgba(52,211,153,0.25) 28%, rgba(255,255,255,0.06) 48%, rgba(255,255,255,0.02) 65%)`

type MobilePhase = 'idle' | 'intro' | 'ambient'

const LG_MQ = '(min-width: 1024px)'

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(LG_MQ).matches,
  )
  const [active, setActive] = useState(false)
  const [pos, setPos] = useState({ x: 50, y: 55 })
  const [mobilePhase, setMobilePhase] = useState<MobilePhase>('idle')

  useEffect(() => {
    const mq = window.matchMedia(LG_MQ)
    const onChange = () => {
      const desktop = mq.matches
      setIsDesktop(desktop)
      if (desktop) setMobilePhase('idle')
    }
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (isDesktop) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.2) return
        setMobilePhase((phase) => (phase === 'idle' ? 'intro' : phase))
        observer.disconnect()
      },
      { threshold: [0, 0.2, 0.35] },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isDesktop])

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    })
  }, [])

  const handleIntroEnd = useCallback(() => {
    setMobilePhase('ambient')
  }, [])

  const textClass = [
    'footer-wordmark__text absolute left-1/2 -translate-x-1/2 bottom-[-0.08em] font-semibold tracking-tighter leading-none whitespace-nowrap text-[clamp(3.25rem,14vw,11rem)]',
    !isDesktop && 'footer-wordmark__text--mobile',
    !isDesktop && mobilePhase === 'idle' && 'footer-wordmark__text--idle',
    !isDesktop && mobilePhase === 'intro' && 'footer-wordmark__text--intro',
    !isDesktop && mobilePhase === 'ambient' && 'footer-wordmark__text--ambient',
    isDesktop && 'transition-[opacity,filter] duration-200',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={ref}
      className="footer-wordmark relative w-full overflow-hidden h-24 sm:h-36 lg:h-44 mb-8 sm:mb-10 lg:mb-14 cursor-default"
      {...(isDesktop
        ? {
            onMouseEnter: () => setActive(true),
            onMouseLeave: () => {
              setActive(false)
              setPos({ x: 50, y: 55 })
            },
            onMouseMove: onMove,
          }
        : {})}
      aria-hidden
    >
      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none" />

      <span
        className={textClass}
        style={
          isDesktop
            ? active
              ? {
                  color: 'transparent',
                  backgroundImage: DESKTOP_GRADIENT(pos.x, pos.y),
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 24px rgba(255,255,255,0.12))',
                }
              : {
                  color: 'rgba(255,255,255,0.035)',
                }
            : undefined
        }
        onAnimationEnd={(e) => {
          if (e.animationName === 'footer-wordmark-intro') handleIntroEnd()
        }}
      >
        NexaClaro
      </span>

      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </div>
  )
}
