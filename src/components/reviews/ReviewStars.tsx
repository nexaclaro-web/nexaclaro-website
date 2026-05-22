import { Star } from 'lucide-react'

type Props = {
  rating: number
  size?: 'sm' | 'md'
  className?: string
}

export function ReviewStars({ rating, size = 'sm', className = '' }: Props) {
  const value = Math.min(5, Math.max(1, Math.round(rating)))

  return (
    <div
      className={`review-stars review-stars--${size} ${className}`.trim()}
      role="img"
      aria-label={`Оценка ${value} од 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`review-stars__icon ${n <= value ? 'review-stars__icon--on' : ''}`}
          strokeWidth={1.5}
          aria-hidden
        />
      ))}
    </div>
  )
}
