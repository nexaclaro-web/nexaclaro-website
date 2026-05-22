import { CONTACT } from '../data/content'
import { ContactHub } from '../components/contact/ContactHub'
import { Button } from '../components/ui/Button'
import { CONTAINER, PAGE_PT, SECTION_PY } from '../lib/layout'

export function Contact() {
  return (
    <div className={`bg-black min-h-0 ${PAGE_PT}`}>
      <section className={`relative overflow-hidden ${SECTION_PY}`}>
        <div className="absolute inset-0 resend-beam-soft pointer-events-none" />

        <div className={`relative ${CONTAINER}`}>
          <div className="text-center mb-8 sm:mb-14 lg:mb-16">
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] text-white tracking-tight leading-[1.08]">
              Контакт
            </h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed px-1">
              Контактирајте не за веб-страница, платформа или дигитално решение за вашиот бизнис.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col items-stretch gap-3 w-full max-w-sm mx-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Button href="/ponuda" variant="primary" showArrow className="w-full sm:w-auto justify-center">
                Побарај понуда
              </Button>
              <Button
                href={`mailto:${CONTACT.email}`}
                variant="ghost"
                className="w-full sm:w-auto justify-center !px-4 text-xs sm:text-sm break-all"
              >
                {CONTACT.email}
              </Button>
            </div>
          </div>

          <ContactHub />
        </div>
      </section>
    </div>
  )
}
