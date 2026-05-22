import { motion } from 'framer-motion'
import { PLATFORM, PLATFORM_FEATURES } from '../data/content'
import { SectionHeader } from '../components/ui/SectionHeader'
import { BrowserFrame } from '../components/ui/BrowserFrame'
import { PLATFORM_DEMO_TRIM_START_SEC } from '../lib/platformDemoVideo'
import { VideoCaption } from '../components/ui/VideoCaption'
import { Button } from '../components/ui/Button'
import { BorderBeamBox, borderBeamAccent } from '../components/ui/BorderBeam'
import { CONTAINER, PAGE_PT, SECTION_PY } from '../lib/layout'

export function Platform() {
  return (
    <div className={`bg-black min-h-screen ${PAGE_PT}`}>
      <section className={`relative overflow-hidden ${SECTION_PY}`}>
        <div className="absolute inset-0 resend-beam-soft pointer-events-none" />

        <div className={`relative ${CONTAINER}`}>
          <SectionHeader
            label={PLATFORM.label}
            title={PLATFORM.title}
            subtitle={PLATFORM.subtitle}
            size="large"
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-5 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 px-1"
          >
            <span className="px-4 py-1.5 rounded-full text-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              {PLATFORM.liveNote}
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs border border-white/10 text-neutral-400">
              {PLATFORM.productName}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center text-neutral-400 leading-relaxed max-w-3xl mx-auto text-base sm:text-lg"
          >
            {PLATFORM.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-14 lg:mt-20 max-w-6xl mx-auto"
          >
            <BrowserFrame
              videoSrc="/assets/platform-demo.webm"
              urlBar="exchange-office.nexaclaro.com"
              large
              playOnVisible
              trimStartSec={PLATFORM_DEMO_TRIM_START_SEC}
            />
            <VideoCaption />
          </motion.div>

          <div className="mt-16 lg:mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {PLATFORM_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="h-full"
              >
                <BorderBeamBox accent={borderBeamAccent(i)} className="h-full">
                  <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                    {feature.description}
                  </p>
                </BorderBeamBox>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Button href="/ponuda?service=finance" variant="primary" showArrow>
              {PLATFORM.cta}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
