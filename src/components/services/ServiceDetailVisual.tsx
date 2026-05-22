import {
  SERVICE_VISUALS,
  SERVICE_VISUAL_BY_ID,
  type ServiceVisualId,
} from '../../data/serviceVisuals'

type Props = {
  serviceId: string
  title: string
}

export function ServiceDetailVisual({ serviceId, title }: Props) {
  const visualId: ServiceVisualId = SERVICE_VISUAL_BY_ID[serviceId] ?? 'website'
  const v = SERVICE_VISUALS[visualId]

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/[0.1] bg-[#0a0a0a] min-h-[200px] sm:min-h-[240px] lg:min-h-full lg:h-full isolate">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] bg-black/70 backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <span className="w-2 h-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[10px] text-neutral-500 truncate font-mono">nexaclaro.com</span>
      </div>

      <img
        src={v.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-400/90">
          {v.tag}
        </p>
        <p className="mt-2 text-base sm:text-lg font-semibold text-white leading-snug">{v.caption}</p>
        <p className="mt-1 text-xs text-neutral-500">{title}</p>
      </div>
    </div>
  )
}
