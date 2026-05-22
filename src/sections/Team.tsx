import { TEAM } from '../data/content'
import { TeamMemberCard } from '../components/contact/TeamMemberCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { CONTAINER, SECTION_PY } from '../lib/layout'

/** Team member cards only (no duplicate quick-contact / general-info blocks). */
export function Team() {
  return (
    <section className={`bg-black border-t border-white/[0.04] ${SECTION_PY}`}>
      <div className={CONTAINER}>
        <SectionHeader title="Тимот зад NexaClaro" />
        <div className="mt-12 lg:mt-14 grid md:grid-cols-2 gap-4 lg:gap-5">
          {TEAM.map((member, i) => (
            <TeamMemberCard key={member.email} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
