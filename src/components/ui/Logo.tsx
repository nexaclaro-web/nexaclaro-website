type Size = 'sm' | 'md' | 'lg'
type Variant = 'header' | 'footer'

const logoMark: Record<Size, string> = {
  sm: 'h-10 w-10 scale-[1.6] origin-right object-contain object-right',
  md: 'h-11 w-11 scale-[1.75] origin-right object-contain object-right',
  lg: 'h-12 w-12 scale-[1.7] origin-right object-contain object-right',
}

const logoMarkFooter: Record<Size, string> = {
  sm: 'h-10 w-10 object-contain object-right',
  md: 'h-11 w-11 object-contain object-right',
  lg: 'h-12 w-12 object-contain object-right',
}

/** Pulls text into PNG side-padding; header only */
const logoPull: Record<Size, string> = {
  sm: '-mr-1.5',
  md: '-mr-2',
  lg: '-mr-2',
}

const textSize: Record<Size, string> = {
  sm: 'text-xl',
  md: 'text-[1.35rem] tracking-tight',
  lg: 'text-[1.65rem] tracking-tight',
}

const textGap: Record<Size, string> = {
  sm: 'ml-[0.1rem]',
  md: 'ml-[0.1rem]',
  lg: 'ml-[0.1rem]',
}

/** Chrome fill for “Claro” — header: sharper band; footer: ~10% softer */
const claroChromeClass: Record<Variant, string> = {
  header:
    'bg-[linear-gradient(180deg,#3f3f46_0%,#71717a_26%,#a1a1aa_34%,#f4f4f5_36%,#ffffff_37.5%,#f4f4f5_39%,#d4d4d8_52%,#a1a1aa_66%,#71717a_100%)] bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(255,255,255,0.35),0_2px_4px_rgba(0,0,0,0.22)]',
  footer:
    'bg-[linear-gradient(180deg,#52525b_0%,#71717a_30%,#a1a1aa_38%,#e4e4e7_37%,#f4f4f5_39%,#e4e4e7_41%,#d4d4d8_54%,#a1a1aa_72%,#71717a_100%)] bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(255,255,255,0.22),0_1px_3px_rgba(0,0,0,0.18)]',
}

type Props = {
  size?: Size
  variant?: Variant
  showText?: boolean
  className?: string
}

export function Logo({
  size = 'md',
  variant = 'header',
  showText = true,
  className = '',
}: Props) {
  const isFooter = variant === 'footer'
  const markClass = isFooter ? logoMarkFooter[size] : logoMark[size]
  const pullClass = isFooter ? '' : logoPull[size]

  return (
    <div className={`flex items-center min-w-0 ${className}`}>
      <img
        src="/assets/logo.png"
        alt="NexaClaro"
        className={`block shrink-0 ${markClass} ${pullClass}`}
      />
      {showText && (
        <span
          className={`font-extrabold text-white whitespace-nowrap ${textGap[size]} ${textSize[size]}`}
        >
          Nexa
          <span className={`font-extrabold ${claroChromeClass[variant]}`}>Claro</span>
        </span>
      )}
    </div>
  )
}
