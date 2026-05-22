import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Palette,
  Layers,
  LayoutDashboard,
  Workflow,
  BarChart3,
  LifeBuoy,
  Code2,
  ChevronDown,
  Check,
  type LucideIcon,
} from 'lucide-react'
import { SERVICES, FAQ } from '../data/content'
import { BorderBeamBox } from '../components/ui/BorderBeam'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Button } from '../components/ui/Button'
import { ServiceDetailVisual } from '../components/services/ServiceDetailVisual'
import { CONTAINER, PAGE_PT, SECTION_PY } from '../lib/layout'

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

export function Services() {
  const [activeId, setActiveId] = useState<string | null>(SERVICES[0].id)

  const active = SERVICES.find((s) => s.id === activeId) ?? SERVICES[0]
  const ActiveIcon = iconMap[active.icon] ?? Globe

  return (
    <div className={`bg-black min-h-screen ${PAGE_PT}`}>
      <section className={`${SECTION_PY} border-b border-white/[0.04]`}>
        <div className={CONTAINER}>
          <SectionHeader
            label="Услуги"
            title="Што изработуваме"
            subtitle="Веб-страници за презентација, дизајн пред код, бизнис платформи за дневна работа и специјализирани системи (на пр. менувачници). Изберете услуга лево — десно е конкретно што правиме, што добивате и што не е во опфатот."
            size="large"
          />

          <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-neutral-600 max-w-2xl mx-auto px-1">
            {SERVICES.length} јасно дефинирани услуги · секој проект со индивидуална понуда
          </p>

          <div className="mt-10 sm:mt-14 lg:mt-20 grid lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-stretch">
            <div className="lg:col-span-5 flex flex-col gap-2 max-h-[min(48vh,380px)] sm:max-h-[min(55vh,480px)] lg:max-h-[min(72vh,680px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              {SERVICES.map((service) => {
                const Icon = iconMap[service.icon] ?? Globe
                const isActive = activeId === service.id
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setActiveId(service.id)}
                    className={`text-left p-4 lg:p-5 rounded-xl border transition-all duration-200 flex items-start gap-4 shrink-0 ${
                      isActive
                        ? 'border-white/20 bg-white/[0.06]'
                        : 'border-white/[0.06] bg-transparent hover:border-white/12 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                        isActive
                          ? 'border-white/20 bg-white/10 text-white'
                          : 'border-white/10 text-neutral-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium ${isActive ? 'text-white' : 'text-neutral-300'}`}>
                        {service.title}
                      </p>
                      <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-neutral-600 transition-transform ${
                        isActive ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            <div className="lg:col-span-7 max-lg:min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  <BorderBeamBox
                    accent="violet"
                    innerClassName="p-5 sm:p-8 lg:p-9 h-full"
                    className="h-full"
                  >
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 h-full">
                      <div className="flex flex-col order-2 lg:order-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-11 h-11 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-white shrink-0">
                            <ActiveIcon className="w-5 h-5" strokeWidth={1.5} />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-tight">
                            {active.title}
                          </h3>
                        </div>

                        <p className="text-sm sm:text-base text-emerald-400/90 font-medium leading-relaxed">
                          {active.highlight}
                        </p>

                        <p className="mt-4 text-sm sm:text-[15px] text-neutral-400 leading-relaxed">
                          {active.details}
                        </p>

                        <div className="mt-6">
                          <p className="text-xs uppercase tracking-wider text-neutral-600 mb-3">
                            Што добивате
                          </p>
                          <ul className="space-y-2">
                            {active.outcomes.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2.5 text-sm text-neutral-300"
                              >
                                <Check
                                  className="w-4 h-4 shrink-0 text-emerald-500/80 mt-0.5"
                                  strokeWidth={2}
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6">
                          <p className="text-xs uppercase tracking-wider text-neutral-600 mb-3">
                            Што вклучува
                          </p>
                          <ul className="flex flex-wrap gap-2">
                            {active.includes.map((item) => (
                              <li
                                key={item}
                                className="text-xs sm:text-sm text-neutral-300 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-8 pt-2">
                          <Button href={`/ponuda?service=${active.id}`} variant="secondary" showArrow>
                            Побарај понуда
                          </Button>
                        </div>
                      </div>

                      <div className="order-1 lg:order-2 min-h-[200px] lg:min-h-0">
                        <ServiceDetailVisual serviceId={active.id} title={active.title} />
                      </div>
                    </div>
                  </BorderBeamBox>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className={`${SECTION_PY} border-t border-white/[0.04]`}>
        <div className={CONTAINER}>
          <SectionHeader
            label="ЧПП"
            title="Најчесто поставувани прашања"
            subtitle="Одговори на прашања за рокови, цени, платформи и поддршка."
          />

          <div className="mt-12 max-w-3xl mx-auto space-y-3">
            <FaqList />
          </div>
        </div>
      </section>
    </div>
  )
}

function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      {FAQ.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={item.q}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 text-left"
            >
              <span className="font-medium text-white text-sm sm:text-base pr-2">{item.q}</span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 text-neutral-500 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="px-5 pb-5 text-sm text-neutral-400 leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </>
  )
}
