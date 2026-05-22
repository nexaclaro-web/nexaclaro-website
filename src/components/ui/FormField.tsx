type Props = {
  label: string
  id: string
  children: React.ReactNode
  className?: string
  dark?: boolean
}

export function FormField({ label, id, children, className = '', dark = false }: Props) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={id}
        className={`block text-sm font-medium ${dark ? 'text-neutral-400' : 'text-neutral-700'}`}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export const inputClass =
  'w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-400 transition-colors text-sm'

export const textareaClass = `${inputClass} resize-none min-h-[120px]`

export const inputClassDark =
  'w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-white/10 transition-colors text-sm'

export const textareaClassDark = `${inputClassDark} resize-none min-h-[128px]`
