import { ReviewStars } from './ReviewStars'

export type ReviewCardProps = {
  quote: string
  name: string
  role: string
  company: string
  companyMark: string
  rating: number
  avatar?: string
  noPhoto?: boolean
  seed: string
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
  }
  return (parts[0]?.slice(0, 2) ?? '?').toUpperCase()
}

function avatarFallback(seed: string) {
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=141414`
}

export function ReviewCard({
  quote,
  name,
  role,
  company,
  companyMark,
  rating,
  avatar,
  noPhoto,
  seed,
}: ReviewCardProps) {
  const photo = avatar ?? avatarFallback(seed)
  const initials = initialsFromName(name)

  return (
    <article className="review-card" draggable={false}>
      <ReviewStars rating={rating} className="review-card__stars" />
      <p className="review-card__quote">&ldquo;{quote}&rdquo;</p>
      <div className="review-card__author">
        <div className="review-card__avatars" aria-hidden>
          <span className="review-card__brand">{companyMark}</span>
          {noPhoto ? (
            <span className="review-card__initials" title={name}>
              {initials}
            </span>
          ) : (
            <img
              src={photo}
              alt=""
              className="review-card__avatar"
              width={36}
              height={36}
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
        <div className="review-card__meta">
          <p className="review-card__name">{name}</p>
          <p className="review-card__role">
            {role} · {company}
          </p>
        </div>
      </div>
    </article>
  )
}
