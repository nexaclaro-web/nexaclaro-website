import { useState } from 'react'
import { Star } from 'lucide-react'

type Props = {
  value: number
  onChange: (value: number) => void
}

const LABELS = ['', 'Слабо', 'Добро', 'Многу добро', 'Одлично', 'Совршено'] as const

export function ReviewRating({ value, onChange }: Props) {
  const [hover, setHover] = useState(0)
  const active = hover || value

  return (
    <div className="review-rating" role="radiogroup" aria-label="Оценка од 1 до 5">
      <div className="review-rating__stars">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= active
          return (
            <button
              key={n}
              type="button"
              className="review-rating__star-btn"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onFocus={() => setHover(n)}
              onBlur={() => setHover(0)}
              onClick={() => onChange(n)}
              aria-label={`Оценка ${n} од 5`}
              aria-pressed={value === n}
            >
              <Star
                className={`review-rating__star ${filled ? 'review-rating__star--on' : ''}`}
                strokeWidth={1.5}
              />
            </button>
          )
        })}
      </div>
      <p className="review-rating__hint">
        {active > 0 ? (
          <>
            <span className="review-rating__score">{active}</span>
            <span className="review-rating__label">{LABELS[active]}</span>
          </>
        ) : (
          <span className="review-rating__label review-rating__label--muted">
            Изберете оценка
          </span>
        )}
      </p>
    </div>
  )
}
