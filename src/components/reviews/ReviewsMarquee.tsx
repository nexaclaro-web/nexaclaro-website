import { useCallback, useEffect, useRef, useState } from 'react'
import { REVIEWS } from '../../data/content'
import { ReviewCard } from './ReviewCard'

const SCROLL_SPEED = 42 // px per second (Resend-like gentle drift)

/** Resend-style single-row infinite marquee with auto-play + drag to scroll. */
export function ReviewsMarquee() {
  const loop = [...REVIEWS, ...REVIEWS]
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const draggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartOffsetRef = useRef(0)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const applyOffset = useCallback((px: number) => {
    const track = trackRef.current
    if (!track) return
    const half = track.scrollWidth / 2
    if (half <= 0) return
    let next = px
    while (next <= -half) next += half
    while (next > 0) next -= half
    offsetRef.current = next
    track.style.transform = `translate3d(${next}px, 0, 0)`
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const speed = reduceMotion ? SCROLL_SPEED * 0.55 : SCROLL_SPEED

    const tick = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const dt = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      if (!draggingRef.current) {
        applyOffset(offsetRef.current - speed * dt)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [applyOffset, reduceMotion])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const track = trackRef.current
    if (!track) return
    draggingRef.current = true
    setIsDragging(true)
    dragStartXRef.current = e.clientX
    dragStartOffsetRef.current = offsetRef.current
    track.setPointerCapture(e.pointerId)
    e.preventDefault()
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    const delta = e.clientX - dragStartXRef.current
    applyOffset(dragStartOffsetRef.current + delta)
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setIsDragging(false)
    lastTimeRef.current = 0
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  useEffect(() => {
    applyOffset(0)
  }, [applyOffset])

  return (
    <div className="reviews-marquee">
      <div className="reviews-marquee__edge reviews-marquee__edge--left" aria-hidden />
      <div className="reviews-marquee__edge reviews-marquee__edge--right" aria-hidden />
      <div
        className={`reviews-marquee__viewport ${isDragging ? 'reviews-marquee__viewport--dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        <div ref={trackRef} className="reviews-marquee__track">
          {loop.map((review, i) => (
            <ReviewCard key={`${review.seed}-${i}`} {...review} />
          ))}
        </div>
      </div>
    </div>
  )
}
