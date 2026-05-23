import { PLATFORM } from '../../data/content'

export function VideoCaption({ className = '' }: { className?: string }) {
  return (
    <p className={`mt-5 text-center text-sm leading-relaxed ${className}`}>
      <span className="text-violet-300/95 font-medium">{PLATFORM.productName}</span>
      <span className="text-neutral-600"> — </span>
      <span className="text-sky-300/85">нашата најнова креација</span>
      <span className="text-neutral-500"> во </span>
      <span className="text-amber-200/75">Македонија</span>
    </p>
  )
}
