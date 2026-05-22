import {
  Globe,
  Palette,
  Layers,
  LayoutDashboard,
  Workflow,
  BarChart3,
  Code2,
  LifeBuoy,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { SERVICES } from '../../data/content'

export const OFFER_OTHER_ID = 'other' as const

export const OFFER_OTHER_OPTION = {
  id: OFFER_OTHER_ID,
  title: 'Друго',
  description: 'Ниедна услуга од листата не одговара — опишете го проектот подолу.',
  highlight: 'Опишете што ви треба во формата — ќе предложиме решение по мерка.',
} as const

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Palette,
  Layers,
  LayoutDashboard,
  Workflow,
  BarChart3,
  LifeBuoy,
  Code2,
}

type Props = {
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ServicePicker({ selectedId, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-neutral-600">Чекор 1</p>
        <h3 className="mt-1 text-lg font-semibold text-white">Изберете тип на проект</h3>
        <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
          Кликнете на услуга — формата ќе се пополни. Не одговара ништо? Изберете{' '}
          <span className="text-neutral-400">Друго</span>. Детали на{' '}
          <Link to="/uslugi" className="text-neutral-300 underline underline-offset-2 hover:text-white">
            Услуги
          </Link>
          .
        </p>
      </div>

      <ul className="space-y-2 max-h-[min(52vh,520px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
        {SERVICES.map((service) => {
          const Icon = iconMap[service.icon] ?? Globe
          const isSelected = selectedId === service.id
          return (
            <li key={service.id}>
              <button
                type="button"
                onClick={() => onSelect(service.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex gap-3 ${
                  isSelected
                    ? 'border-white/25 bg-white/[0.08] ring-1 ring-white/10'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'border-white/20 bg-white/10 text-white'
                      : 'border-white/10 text-neutral-500'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                    {service.title}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{service.description}</p>
                </div>
              </button>
            </li>
          )
        })}
        <li className="pt-1 border-t border-white/[0.06]">
          {(() => {
            const isSelected = selectedId === OFFER_OTHER_ID
            return (
              <button
                type="button"
                onClick={() => onSelect(OFFER_OTHER_ID)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex gap-3 ${
                  isSelected
                    ? 'border-white/25 bg-white/[0.08] ring-1 ring-white/10'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'border-white/20 bg-white/10 text-white'
                      : 'border-white/10 text-neutral-500'
                  }`}
                >
                  <MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                    {OFFER_OTHER_OPTION.title}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">{OFFER_OTHER_OPTION.description}</p>
                </div>
              </button>
            )
          })()}
        </li>
      </ul>
    </div>
  )
}

export function getServiceById(id: string | null) {
  if (!id) return null
  if (id === OFFER_OTHER_ID) return OFFER_OTHER_OPTION
  return SERVICES.find((s) => s.id === id) ?? null
}
