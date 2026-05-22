import { useRef, useState, useCallback } from 'react'

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [pos, setPos] = useState({ x: 50, y: 55 })

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    })
  }, [])

  return (
    <div
      ref={ref}
      className="footer-wordmark relative w-full overflow-hidden h-24 sm:h-36 lg:h-44 mb-8 sm:mb-10 lg:mb-14 cursor-default"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false)
        setPos({ x: 50, y: 55 })
      }}
      onMouseMove={onMove}
      aria-hidden
    >
      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none" />

      <span
        className="absolute left-1/2 -translate-x-1/2 bottom-[-0.08em] font-semibold tracking-tighter leading-none whitespace-nowrap text-[clamp(3.25rem,14vw,11rem)] transition-[opacity,filter] duration-200"
        style={
          active
            ? {
                color: 'transparent',
                backgroundImage: `radial-gradient(circle 220px at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.92) 0%, rgba(200,220,255,0.45) 14%, rgba(52,211,153,0.25) 28%, rgba(255,255,255,0.06) 48%, rgba(255,255,255,0.02) 65%)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 24px rgba(255,255,255,0.12))',
              }
            : {
                color: 'rgba(255,255,255,0.035)',
              }
        }
      >
        NexaClaro
      </span>

      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </div>
  )
}
