import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquarePlus } from 'lucide-react'
import { REVIEWS_SECTION } from '../data/content'
import { ReviewsMarquee } from '../components/reviews/ReviewsMarquee'
import { ReviewRating } from '../components/reviews/ReviewRating'
import { SectionHeader } from '../components/ui/SectionHeader'
import { FormField, inputClassDark, textareaClassDark } from '../components/ui/FormField'
import { Button } from '../components/ui/Button'
import { useFormPost } from '../utils/formPost'
import { CONTAINER, PAGE_PT, SECTION_PY } from '../lib/layout'

export function Reviews() {
  const { submit, message, status, isLoading } = useFormPost('NexaClaro – рецензија')
  const [rating, setRating] = useState(5)

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget
    const ok = await submit(e)
    if (ok) {
      form.reset()
      setRating(5)
    }
  }

  return (
    <div className={`bg-black min-h-screen ${PAGE_PT}`}>
      <section className={`overflow-hidden ${SECTION_PY}`}>
        <div className={`${CONTAINER} mb-14 lg:mb-16`}>
          <SectionHeader
            title={REVIEWS_SECTION.title}
            subtitle={REVIEWS_SECTION.subtitle}
            size="large"
          />
        </div>

        <div className="mb-14 sm:mb-20 lg:mb-28">
          <ReviewsMarquee />
        </div>

        <div className={CONTAINER}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="review-form-card"
          >
            <div className="review-form-card__glow" aria-hidden />

            <div className="review-form-card__header">
              <div className="review-form-card__icon" aria-hidden>
                <MessageSquarePlus className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="review-form-card__title">{REVIEWS_SECTION.formTitle}</h3>
                <p className="review-form-card__subtitle">{REVIEWS_SECTION.formSubtitle}</p>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="review-form-card__form">
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />
              <input type="hidden" name="rating" value={rating} />

              <div className="review-form-card__fields">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <FormField label="Име" id="review-name" dark>
                    <input
                      id="review-name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Вашето име"
                      className={inputClassDark}
                    />
                  </FormField>
                  <FormField label="Компанија" id="review-company" dark>
                    <input
                      id="review-company"
                      name="company"
                      autoComplete="organization"
                      placeholder="По избор"
                      className={inputClassDark}
                    />
                  </FormField>
                </div>

                <FormField label="Вашиот коментар" id="review-comment" dark>
                  <textarea
                    id="review-comment"
                    name="comment"
                    required
                    className={textareaClassDark}
                    rows={5}
                    placeholder="Кратко споделете го вашето искуство — што ви се допадна, како помогна сајтот или системот..."
                  />
                </FormField>
              </div>

              <div className="review-form-card__footer">
                <FormField label="Оценка" id="review-rating" dark className="mb-0">
                  <ReviewRating value={rating} onChange={setRating} />
                </FormField>

                <div className="review-form-card__actions">
                  <Button
                    as="button"
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="review-form-card__submit"
                  >
                    {isLoading ? 'Се испраќа...' : 'Испрати коментар'}
                  </Button>
                  {message && (
                    <p
                      className={`review-form-card__message ${
                        status === 'success'
                          ? 'review-form-card__message--success'
                          : status === 'error'
                            ? 'review-form-card__message--error'
                            : 'review-form-card__message--neutral'
                      }`}
                      role="status"
                    >
                      {message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
