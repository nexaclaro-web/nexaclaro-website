import { Link } from 'react-router-dom'
import { PRIVACY_POLICY } from '../data/privacy-policy-mk'
import { SectionHeader } from '../components/ui/SectionHeader'
import { CONTAINER, PAGE_PT, SECTION_PY } from '../lib/layout'

function renderLine(line: string) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-neutral-200">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function PrivacyPage() {
  return (
    <div className={`bg-black min-h-screen ${PAGE_PT}`}>
      <section className={SECTION_PY}>
        <div className={CONTAINER}>
          <SectionHeader
            label="Правни информации"
            title={PRIVACY_POLICY.title}
            subtitle={PRIVACY_POLICY.intro}
            align="left"
            size="large"
          />

          <p className="mt-6 text-sm text-neutral-600">
            Последна измена: <span className="text-neutral-500">{PRIVACY_POLICY.updated}</span>
          </p>

          <div className="mt-12 max-w-3xl space-y-10">
            {PRIVACY_POLICY.sections.map((section) => (
              <article key={section.heading}>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-3 text-sm sm:text-[0.9375rem] leading-relaxed text-neutral-400">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{renderLine(paragraph)}</p>
                  ))}
                </div>
              </article>
            ))}

            <p className="text-sm leading-relaxed text-neutral-500 border-t border-white/[0.08] pt-8">
              {renderLine(PRIVACY_POLICY.closing)}
            </p>

            <Link
              to="/kontakt"
              className="inline-flex text-sm text-neutral-400 hover:text-white transition-colors underline underline-offset-2"
            >
              Контакт
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
