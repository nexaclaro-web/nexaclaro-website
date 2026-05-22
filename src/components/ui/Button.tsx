import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'

type Props = {
  href?: string
  variant?: Variant
  as?: 'a' | 'button'
  type?: 'button' | 'submit'
  disabled?: boolean
  showArrow?: boolean
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

const variants: Record<Variant, string> = {
  primary:
    'bg-white text-black hover:bg-neutral-100 border border-white/80 btn-glow rounded-full',
  secondary:
    'bg-neutral-900 text-white border border-white/15 hover:border-white/25 hover:bg-neutral-800 rounded-full',
  ghost: 'bg-transparent text-neutral-300 hover:text-white rounded-full',
  outline:
    'bg-transparent text-white border border-white/20 hover:bg-white/5 rounded-full',
}

export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, Props>(
  function Button(
    {
      variant = 'primary',
      className = '',
      as = 'a',
      type = 'button',
      disabled,
      showArrow = false,
      href = '#',
      children,
      onClick,
    },
    ref,
  ) {
    const base =
      'inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none'

    const classes = `${base} ${variants[variant]} ${className}`

    const content = (
      <>
        {children}
        {showArrow && <ChevronRight className="w-4 h-4 opacity-70" />}
      </>
    )

    if (as === 'button') {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type={type}
          disabled={disabled}
          className={classes}
          onClick={onClick}
        >
          {content}
        </button>
      )
    }

    if (href.startsWith('/')) {
      return (
        <Link ref={ref as React.Ref<HTMLAnchorElement>} to={href} className={classes}>
          {content}
        </Link>
      )
    }

    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes}>
        {content}
      </a>
    )
  },
)
