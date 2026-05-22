import { TRUST_STATS } from '../data/content'
import { CONTAINER, SECTION_PY } from '../lib/layout'

export function TrustStats() {
  return (
    <section className={`border-y border-white/[0.06] bg-black ${SECTION_PY}`}>
      <div className={CONTAINER}>
        <p className="text-center text-xs sm:text-sm text-neutral-500 mb-8 sm:mb-12 max-w-xl mx-auto px-2">
          Компании од различни индустрии ни се доверуваат за веб-страници, платформи
          и дигитални решенија по мерка.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-10 lg:gap-8 max-md:[&>*:nth-child(5)]:col-span-2 max-md:[&>*:nth-child(5)]:justify-self-center max-md:[&>*:nth-child(5)]:max-w-[11rem]">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
