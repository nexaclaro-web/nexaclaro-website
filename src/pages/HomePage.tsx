import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PLATFORM, TRUST_STATS } from '../data/content'
import { Button } from '../components/ui/Button'
import { BrowserFrame } from '../components/ui/BrowserFrame'
import { BorderBeamCard } from '../components/ui/BorderBeam'
import { VideoCaption } from '../components/ui/VideoCaption'
import { HeroRubiksCube } from '../components/hero/HeroRubiksCube'
import { PLATFORM_DEMO_TRIM_START_SEC } from '../lib/platformDemoVideo'
import { ResendHorizonSection } from '../components/hero/ResendHorizonSection'
import { CONTAINER, SECTION_PY } from '../lib/layout'

const quickLinks = [
  {
    href: '/uslugi',
    title: 'Услуги',
    desc: 'Веб, платформи, код и поддршка',
    accent: 'sky' as const,
  },
  {
    href: '/platform',
    title: 'Платформа',
    desc: PLATFORM.cardDesc,
    accent: 'emerald' as const,
  },
  {
    href: '/portfolio',
    title: 'Портфолио',
    desc: 'Реални завршени проекти',
    accent: 'amber' as const,
  },
  {
    href: '/recenzii',
    title: 'Рецензии',
    desc: 'Што кажуваат клиентите',
    accent: 'violet' as const,
  },
]

export function HomePage() {
  return (
    <>
      <section id="hero" className="relative bg-black text-white overflow-x-clip">
        <div className="resend-hero-stage relative bg-black max-lg:min-h-0 lg:min-h-[min(800px,90svh)]">
          <div
            className={`relative z-10 ${CONTAINER} pt-20 sm:pt-24 pb-4 sm:pb-6 lg:pt-28 lg:pb-10 flex flex-col justify-center lg:min-h-[inherit]`}
          >
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-4 xl:gap-8 items-center overflow-visible">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left order-2 lg:order-1"
            >
              <Link
                to="/platform"
                className="gradient-border-pill inline-flex flex-wrap items-center justify-center lg:justify-start gap-x-1.5 gap-y-1 max-w-full px-3 py-1.5 rounded-full text-xs border-emerald-500/20 bg-emerald-500/[0.05] hover:border-emerald-500/35 transition-colors mb-5 sm:mb-6 lg:mb-7"
              >
                <span className="text-emerald-400/90 font-medium">{PLATFORM.badgeLabel}</span>
                <span className="text-white/75">{PLATFORM.productName}</span>
                <ArrowRight className="w-3 h-3 text-emerald-500/60" />
              </Link>

              <h1 className="font-serif text-[1.9rem] min-[400px]:text-[2.1rem] sm:text-[2.85rem] lg:text-[3.35rem] xl:text-[3.6rem] leading-[1.08] sm:leading-[1.06] tracking-tight text-white">
                Модерни веб-страници и бизнис платформи по нарачка
              </h1>

              <p className="mt-5 lg:mt-6 text-base sm:text-[1.05rem] text-neutral-500 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Креираме професионални веб-страници, дигитални системи и прилагодени
                платформи — за компании што сакаат побрза, поорганизирана и посериозна
                дигитална работа.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-5">
                <Button href="/ponuda" variant="primary" showArrow className="text-sm">
                  Побарај понуда
                </Button>
                <Button href="/platform" variant="ghost" className="!px-2 text-sm">
                  Погледни ја платформата
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.15 }}
              className="order-1 lg:order-2 flex items-center justify-center w-full overflow-visible bg-black min-h-[280px] sm:min-h-[460px] lg:min-h-[560px]"
            >
              <HeroRubiksCube className="w-full max-w-[600px] lg:max-w-[720px] xl:max-w-[780px] mx-auto px-2 sm:px-6 lg:px-8 h-[min(360px,46svh)] sm:h-[min(560px,64vh)] lg:h-[min(620px,62vh)] xl:h-[min(660px,66vh)] min-h-[260px] sm:min-h-[460px]" />
            </motion.div>
          </div>
          </div>
        </div>

        <div className={`relative z-10 ${CONTAINER} -mt-px pt-6 sm:pt-8 pb-12 sm:pb-16 lg:pb-24`}>
          <ResendHorizonSection>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-8 lg:gap-6 mb-8 sm:mb-10 lg:mb-12 max-md:[&>*:nth-child(5)]:col-span-2 max-md:[&>*:nth-child(5)]:justify-self-center max-md:[&>*:nth-child(5)]:max-w-[11rem]">
              {TRUST_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <BrowserFrame
              videoSrc="/assets/platform-demo.webm"
              urlBar="exchange-office.nexaclaro.com"
              large
              playOnVisible
              trimStartSec={PLATFORM_DEMO_TRIM_START_SEC}
            />
            <VideoCaption />
          </ResendHorizonSection>
        </div>
      </section>

      <section className={`bg-black border-t border-white/[0.08] ${SECTION_PY}`}>
        <div className={CONTAINER}>
          <h2 className="font-serif text-2xl sm:text-4xl text-white text-center mb-8 sm:mb-12">
            Истражете ги нашите решенија
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((item) => (
              <BorderBeamCard
                key={item.href}
                href={item.href}
                accent={item.accent}
                innerClassName="px-6 py-3.5"
              >
                <p className="font-semibold text-white group-hover:text-white/90">{item.title}</p>
                <p className="mt-1.5 text-sm text-neutral-500">{item.desc}</p>
                <ArrowRight className="w-4 h-4 text-neutral-600 mt-2.5 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </BorderBeamCard>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
