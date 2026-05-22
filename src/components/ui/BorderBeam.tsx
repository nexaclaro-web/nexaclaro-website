import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export type BorderBeamAccent = 'emerald' | 'sky' | 'violet' | 'amber'

const accents: BorderBeamAccent[] = ['sky', 'emerald', 'violet', 'amber']

const beamGradients: Record<BorderBeamAccent, string> = {
  sky: 'conic-gradient(from 0deg, transparent 0deg 262deg, #38bdf8 276deg, #7dd3fc 284deg, #38bdf8 292deg, transparent 304deg 360deg)',
  emerald:
    'conic-gradient(from 0deg, transparent 0deg 262deg, #34d399 276deg, #6ee7b7 284deg, #34d399 292deg, transparent 304deg 360deg)',
  violet:
    'conic-gradient(from 0deg, transparent 0deg 262deg, #a78bfa 276deg, #c4b5fd 284deg, #a78bfa 292deg, transparent 304deg 360deg)',
  amber:
    'conic-gradient(from 0deg, transparent 0deg 262deg, #fbbf24 276deg, #fde68a 284deg, #fbbf24 292deg, transparent 304deg 360deg)',
}

const BEAM_DURATION_MS = 4000

export function borderBeamAccent(index: number): BorderBeamAccent {
  return accents[index % accents.length]!
}

type BoxProps = {
  accent?: BorderBeamAccent
  className?: string
  innerClassName?: string
  children: ReactNode
}

function BeamRotate({ accent, phase = 0 }: { accent: BorderBeamAccent; phase?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    const start = performance.now() - phase * BEAM_DURATION_MS

    const tick = (now: number) => {
      const deg = (((now - start) % BEAM_DURATION_MS) / BEAM_DURATION_MS) * 360
      el.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  return (
    <div
      ref={ref}
      className="border-beam-rotate pointer-events-none absolute z-0"
      style={{
        background: beamGradients[accent],
        transform: 'translate(-50%, -50%) rotate(0deg)',
      }}
      aria-hidden
    />
  )
}

function BeamShell({
  accent = 'violet',
  className,
  innerClassName,
  children,
  asLink,
  href,
  phase = 0,
}: BoxProps & { asLink?: boolean; href?: string; phase?: number }) {
  const shell = `border-beam-card block ${className ?? 'rounded-2xl'}`
  const inner = `border-beam-inner relative z-[1] h-full rounded-[15px] ${innerClassName ?? 'p-6 lg:p-7'}`

  const content = (
    <>
      <BeamRotate accent={accent} phase={phase} />
      <div className={inner}>{children}</div>
    </>
  )

  if (asLink && href) {
    return (
      <Link to={href} data-accent={accent} className={`${shell} group`}>
        {content}
      </Link>
    )
  }

  return (
    <div data-accent={accent} className={shell}>
      {content}
    </div>
  )
}

export function BorderBeamCard({
  href,
  accent = 'violet',
  className = '',
  innerClassName,
  children,
}: BoxProps & { href: string }) {
  const phase = accents.indexOf(accent) * 0.25

  return (
    <BeamShell
      asLink
      href={href}
      accent={accent}
      phase={phase}
      className={`group ${className}`}
      innerClassName={innerClassName ?? 'p-6'}
    >
      {children}
    </BeamShell>
  )
}

export function BorderBeamBox({
  accent = 'violet',
  className = '',
  innerClassName,
  children,
}: BoxProps) {
  const phase = accents.indexOf(accent) * 0.25

  return (
    <BeamShell accent={accent} phase={phase} className={className} innerClassName={innerClassName}>
      {children}
    </BeamShell>
  )
}
