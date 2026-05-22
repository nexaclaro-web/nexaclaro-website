import { motion } from 'framer-motion'
import { PROCESS_STEPS } from '../data/content'
import { SectionHeader } from '../components/ui/SectionHeader'
import { BorderBeamBox, borderBeamAccent } from '../components/ui/BorderBeam'
import { CONTAINER, SECTION_PY } from '../lib/layout'

export function Process() {
  return (
    <section className={`bg-black border-t border-white/[0.04] ${SECTION_PY}`}>
      <div className={CONTAINER}>
        <SectionHeader
          label="Процес"
          title="Како работиме"
          subtitle="Јасен процес од првиот разговор до финална испорака — со фокус на транспарентност и квалитет."
        />

        <div className="mt-10 sm:mt-16 lg:mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="h-full"
            >
              <BorderBeamBox accent={borderBeamAccent(i)} innerClassName="p-5 sm:p-7 lg:p-8" className="h-full">
                <span className="text-xs font-mono text-neutral-600">{step.step}</span>
                <h3 className="mt-4 text-lg font-semibold text-white tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
                  {step.description}
                </p>
              </BorderBeamBox>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
