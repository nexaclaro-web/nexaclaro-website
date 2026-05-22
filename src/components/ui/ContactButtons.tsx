import { Mail, MessageCircle, Phone, Send, Linkedin } from 'lucide-react'
import { CONTACT } from '../../data/content'

type Size = 'sm' | 'md'

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-2 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
}

type Layout = 'wrap' | 'grid'

type Props = {
  email?: string
  whatsapp?: string
  viber?: string
  telegram?: string
  linkedin?: string
  size?: Size
  showLinkedIn?: boolean
  dark?: boolean
  layout?: Layout
}

export function ContactButtons({
  email = CONTACT.email,
  whatsapp = CONTACT.whatsapp,
  viber = CONTACT.viber,
  telegram = CONTACT.telegram,
  linkedin,
  size = 'md',
  showLinkedIn = true,
  dark = false,
  layout = 'wrap',
}: Props) {
  const cls = sizeClasses[size]
  const btnClass = dark
    ? 'inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/25 transition-all'
    : 'inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:text-neutral-950 hover:shadow-sm transition-all'

  const items = [
    { href: whatsapp, label: 'WhatsApp', icon: MessageCircle },
    { href: viber, label: 'Viber', icon: Phone },
    { href: telegram, label: 'Telegram', icon: Send },
    { href: `mailto:${email}`, label: 'Gmail', icon: Mail },
  ]

  if (showLinkedIn && linkedin) {
    items.push({ href: linkedin, label: 'LinkedIn', icon: Linkedin })
  }

  const containerClass =
    layout === 'grid'
      ? 'grid w-full grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 max-sm:gap-2'
      : 'flex flex-wrap gap-2 justify-center sm:justify-start'

  const itemClass = layout === 'grid' ? `${btnClass} ${cls} w-full` : `${btnClass} ${cls}`

  return (
    <div className={containerClass}>
      {items.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={label === 'LinkedIn' ? 'LinkedIn' : undefined}
          className={itemClass}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">{label}</span>
        </a>
      ))}
    </div>
  )
}
