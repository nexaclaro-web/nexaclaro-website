import { motion } from 'framer-motion'
import { TEAM } from '../../data/content'
import { ContactButtons } from '../ui/ContactButtons'
import { BorderBeamBox, borderBeamAccent, type BorderBeamAccent } from '../ui/BorderBeam'

type Member = (typeof TEAM)[number]

type Props = {
  member: Member
  index: number
  accent?: BorderBeamAccent
}

export function TeamMemberCard({ member, index, accent }: Props) {
  const beam = accent ?? borderBeamAccent(index)

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="h-full"
    >
      <BorderBeamBox accent={beam} innerClassName="p-5 sm:p-8 lg:p-9 h-full flex flex-col" className="h-full">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-900 border border-white/10 flex items-center justify-center text-xs sm:text-sm font-semibold text-white shrink-0 font-sans tracking-wide"
            aria-hidden
          >
            {member.initials}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">{member.name}</h3>
            <p className="text-sm text-neutral-500 mt-1 leading-snug">{member.role}</p>
          </div>
        </div>

        <p className="mt-5 text-sm text-neutral-400 leading-relaxed flex-1">{member.description}</p>

        <a
          href={`mailto:${member.email}`}
          className="inline-block mt-5 text-sm font-medium text-white hover:text-neutral-300 transition-colors break-all"
        >
          {member.email}
        </a>

        <div className="mt-6 pt-5 border-t border-white/[0.06] max-sm:text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 mb-3">
            Канали
          </p>
          <div className="w-full max-sm:max-w-sm max-sm:mx-auto">
            <ContactButtons
              email={member.email}
              whatsapp={member.channels.whatsapp}
              viber={member.channels.viber}
              telegram={member.channels.telegram}
              linkedin={member.channels.linkedin}
              size="sm"
              dark
              layout="grid"
            />
          </div>
        </div>
      </BorderBeamBox>
    </motion.article>
  )
}
