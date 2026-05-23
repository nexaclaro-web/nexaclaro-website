import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, Phone } from 'lucide-react'
import { CONTACT } from '../data/content'
import {
  ServicePicker,
  getServiceById,
  OFFER_OTHER_ID,
} from '../components/offer/ServicePicker'
import { SectionHeader } from '../components/ui/SectionHeader'
import { FormField, inputClassDark, textareaClassDark } from '../components/ui/FormField'
import { Button } from '../components/ui/Button'
import { useFormPost } from '../utils/formPost'
import { CONTAINER, PAGE_PT, SECTION_PY } from '../lib/layout'

const VALID_SERVICE_IDS = [
  'websites',
  'ui-design',
  'platforms',
  'admin',
  'automation',
  'finance',
  'coding',
  'support',
  OFFER_OTHER_ID,
] as const

/** Digits plus separators for amounts and ranges (e.g. 500 – 1000). */
function sanitizeBudgetInput(value: string): string {
  return value.replace(/[^\d\s.,–\-]/g, '')
}

export function RequestOffer() {
  const [searchParams] = useSearchParams()
  const { submit, message, status, isLoading } = useFormPost('NexaClaro – барање за понуда')
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [hasWebsite, setHasWebsite] = useState<string>('')
  const [budget, setBudget] = useState('')
  const [description, setDescription] = useState('')

  const selectedService = getServiceById(selectedServiceId)

  useEffect(() => {
    const fromUrl = searchParams.get('service')
    if (fromUrl && VALID_SERVICE_IDS.includes(fromUrl as (typeof VALID_SERVICE_IDS)[number])) {
      setSelectedServiceId(fromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    const service = getServiceById(selectedServiceId)
    if (!service) return
    const draft =
      service.id === OFFER_OTHER_ID
        ? `${service.highlight}\n\n`
        : `Интересирам се за: ${service.title}.\n\n${service.highlight}\n\n`
    setDescription((prev) => {
      if (!prev.trim() || prev.startsWith('Интересирам се за:')) return draft
      return prev
    })
  }, [selectedServiceId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget
    const ok = await submit(e)
    if (ok) {
      form.reset()
      setHasWebsite('')
      setBudget('')
      setDescription(selectedService ? `Интересирам се за: ${selectedService.title}.\n\n` : '')
    }
  }

  return (
    <div className={`bg-black min-h-screen ${PAGE_PT}`}>
      <section className={SECTION_PY}>
        <div className={CONTAINER}>
          <SectionHeader
            title="Побарај понуда"
            subtitle="Изберете услуга, пополнете ги податоците — ќе ве контактираме со прашања и индивидуален предлог. Без фиксни цени; понудата зависи од обемот и функциите."
            size="large"
          />

          <div className="mt-10 sm:mt-14 lg:mt-16 grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
            <motion.aside
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 lg:sticky lg:top-28"
            >
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7">
                <ServicePicker selectedId={selectedServiceId} onSelect={setSelectedServiceId} />
              </div>

              <div className="mt-6 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <p className="text-xs uppercase tracking-wider text-neutral-600 mb-3">
                  Брз контакт
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    {CONTACT.email}
                  </a>
                  <a
                    href={`tel:${CONTACT.phoneRaw}`}
                    className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    {CONTACT.phone}
                  </a>
                </div>
                <p className="mt-4 text-xs text-neutral-600">
                  Претпочитате разговор пред форма?{' '}
                  <Link to="/kontakt" className="text-neutral-400 hover:text-white underline underline-offset-2">
                    Страница Контакт
                  </Link>
                </p>
              </div>
            </motion.aside>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <form
                onSubmit={handleSubmit}
                className="p-5 sm:p-7 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-5"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-600">Чекор 2</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">Вашите податоци и опис</h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                    Пополнете ги полињата — ќе ве контактираме со прашања или првична понуда.
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden
                />

                <input type="hidden" name="serviceId" value={selectedServiceId ?? ''} />
                <input
                  type="hidden"
                  name="projectType"
                  value={selectedService?.title ?? ''}
                />

                {selectedService && (
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06]">
                    <p className="text-xs text-emerald-400/90 uppercase tracking-wider">Избрана услуга</p>
                    <p className="mt-1 text-sm font-medium text-white">{selectedService.title}</p>
                    <p className="mt-1 text-xs text-neutral-400">{selectedService.highlight}</p>
                  </div>
                )}

                {!selectedServiceId && (
                  <p className="text-sm text-amber-400/90 bg-amber-500/[0.08] border border-amber-500/20 rounded-lg px-3 py-2">
                    Изберете услуга лево за побрза и поточна понуда.
                  </p>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Име и презиме" id="offer-name" dark>
                    <input id="offer-name" name="name" required className={inputClassDark} />
                  </FormField>
                  <FormField label="Компанија" id="offer-company" dark>
                    <input id="offer-company" name="company" className={inputClassDark} />
                  </FormField>
                  <FormField label="Телефон" id="offer-phone" dark>
                    <input id="offer-phone" name="phone" type="tel" className={inputClassDark} />
                  </FormField>
                  <FormField label="Е-пошта" id="offer-email" dark>
                    <input
                      id="offer-email"
                      name="email"
                      type="email"
                      required
                      className={inputClassDark}
                    />
                  </FormField>
                </div>

                <FormField label="Опис на проектот" id="offer-desc" dark>
                  <textarea
                    id="offer-desc"
                    name="description"
                    required
                    rows={5}
                    className={textareaClassDark}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      selectedServiceId === OFFER_OTHER_ID
                        ? 'Опишете го проектот — тип, цели, функции, рокови...'
                        : 'Што ви треба, рокови, постоечко решение, број на корисници...'
                    }
                  />
                </FormField>

                <fieldset>
                  <legend className="text-sm font-medium text-neutral-400 mb-3">
                    Дали имате постоеча веб-страница или систем?
                  </legend>
                  <div className="flex flex-wrap gap-4">
                    {['Да', 'Не', 'Во изработка'].map((opt) => (
                      <label
                        key={opt}
                        className="inline-flex items-center gap-2 text-sm text-neutral-400 cursor-pointer hover:text-white transition-colors"
                      >
                        <input
                          type="radio"
                          name="hasWebsite"
                          value={opt}
                          checked={hasWebsite === opt}
                          onChange={() => setHasWebsite(opt)}
                          className="accent-white"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <FormField
                  label="Планиран буџет за проектот (EUR)"
                  id="offer-budget"
                  dark
                  hint="Наведете ја планираната сума во евра (на пр. 350 или 500 – 1000). Не е обврзувачки договор."
                >
                  <input
                    id="offer-budget"
                    name="budget"
                    type="text"
                    required
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="на пр. 350 € или 500 – 1.000 €"
                    className={inputClassDark}
                    value={budget}
                    onChange={(e) => setBudget(sanitizeBudgetInput(e.target.value))}
                    pattern="[\d][\d\s.,–\-]*"
                    title="Внесете само бројки (може и опсег, на пр. 500 – 1000)"
                  />
                </FormField>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  Цената зависи од обемот, функционалностите и специфичните потреби. По испраќање
                  добивате одговор со прашања или првична понуда.
                </p>

                <Button as="button" type="submit" variant="primary" disabled={isLoading} showArrow>
                  {isLoading ? 'Се испраќа...' : 'Испрати барање за понуда'}
                </Button>

                {message && (
                  <p
                    className={`text-sm ${
                      status === 'success'
                        ? 'text-emerald-400'
                        : status === 'error'
                          ? 'text-amber-400'
                          : 'text-neutral-400'
                    }`}
                    role="status"
                  >
                    {message}
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
