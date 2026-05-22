import { motion } from 'framer-motion'

type Props = {
  label?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  serif?: boolean
  size?: 'default' | 'large'
}

export function SectionHeader({
  label,
  title,
  subtitle,
  align = 'center',
  serif = true,
  size = 'default',
}: Props) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'
  const titleSize =
    size === 'large'
      ? 'text-3xl sm:text-5xl lg:text-[3.5rem]'
      : 'text-2xl sm:text-4xl lg:text-5xl'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-3xl ${alignClass}`}
    >
      {label && (
        <p className="text-xs font-medium uppercase tracking-[0.2em] sm:tracking-[0.22em] text-neutral-500 mb-4 sm:mb-5">
          {label}
        </p>
      )}
      <h2
        className={`${titleSize} leading-[1.08] tracking-tight text-white ${
          serif ? 'font-serif font-normal' : 'font-semibold'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 sm:mt-6 text-sm sm:text-lg leading-relaxed text-neutral-400 max-w-2xl ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
