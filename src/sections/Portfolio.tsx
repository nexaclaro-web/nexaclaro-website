import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { PLATFORM, PORTFOLIO } from '../data/content'
import { SectionHeader } from '../components/ui/SectionHeader'
import { PortfolioPreview } from '../components/portfolio/PortfolioPreview'
import { ProjectModal } from '../components/portfolio/ProjectModal'
import { CONTAINER, PAGE_PT, SECTION_PY } from '../lib/layout'

export function Portfolio() {
  const [selected, setSelected] = useState<(typeof PORTFOLIO)[number] | null>(null)

  return (
    <div className={`bg-black min-h-screen ${PAGE_PT}`}>
      <section className={SECTION_PY}>
        <div className={CONTAINER}>
          <SectionHeader
            label="Портфолио"
            title="Завршени проекти"
            subtitle="Реална изработка за клиенти — веб-страници, панели и платформи. (проекти од САД и Македонија)."
            size="large"
          />

          <div className="mt-10 sm:mt-16 lg:mt-20 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {PORTFOLIO.map((item, i) => (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: (i % 4) * 0.04 }}
                onClick={() => setSelected(item)}
                className="group text-left rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden hover:border-white/[0.16] hover:bg-white/[0.04] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <div className="relative">
                  <PortfolioPreview theme={item.theme} name={item.name} projectId={item.id} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-black text-sm font-medium">
                      <ExternalLink className="w-4 h-4" />
                      Погледни проект
                    </span>
                  </div>
                  {'isLive' in item && item.isLive && (
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full text-emerald-400 border border-emerald-500/40 bg-black/60">
                      {PLATFORM.portfolioBadge}
                    </span>
                  )}
                </div>
                <div className="p-5 lg:p-6">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full text-neutral-500 border border-white/[0.06]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-neutral-600 uppercase tracking-wide">
                    {item.type} · {item.region}
                  </p>
                  <h3 className="mt-1.5 text-base font-semibold text-white group-hover:text-white/90">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
