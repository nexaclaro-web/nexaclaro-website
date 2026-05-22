import type { ReactNode } from 'react'
import { HERO_TRUST_LINE } from '../../data/content'

type Props = {
  children?: ReactNode
  className?: string
}

export function ResendHorizonSection({ children, className = '' }: Props) {
  return (
    <div className={`resend-horizon ${className}`}>
      <div className="resend-horizon__band">
        <div className="resend-horizon__glow" aria-hidden />
        <p className="resend-horizon__text">
          {HERO_TRUST_LINE.line1}
          <br />
          {HERO_TRUST_LINE.line2}
        </p>
      </div>
      {children ? <div className="resend-horizon__body">{children}</div> : null}
    </div>
  )
}
