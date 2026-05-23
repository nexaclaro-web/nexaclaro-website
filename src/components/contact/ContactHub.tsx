import { motion } from 'framer-motion'
import { Mail, Phone } from 'lucide-react'
import { CONTACT, TEAM } from '../../data/content'
import { ContactButtons } from '../ui/ContactButtons'
import { BorderBeamBox } from '../ui/BorderBeam'
import { TeamMemberCard } from './TeamMemberCard'

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.18em] sm:tracking-[0.2em] text-neutral-500 mb-3 sm:mb-4 text-center sm:text-left">
      {children}
    </p>
  )
}

function GeneralInfoTile({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail
  label: string
  value: string
  href: string
}) {
  return (
    <div className="flex w-full items-center gap-4 min-w-0 text-left">
      <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0 text-neutral-400">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-neutral-500 leading-snug">{label}</p>
        <a
          href={href}
          className="mt-1 block text-base font-medium text-white hover:text-neutral-300 transition-colors break-all"
        >
          {value}
        </a>
      </div>
    </div>
  )
}

/** Team cards + channels + general contact — one combined block. */
export function ContactHub() {
  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <SectionLabel>Брз контакт</SectionLabel>
        <BorderBeamBox accent="violet" innerClassName="p-5 sm:p-8 max-sm:text-center">
          <p className="text-sm text-neutral-500 leading-relaxed max-w-2xl max-sm:mx-auto max-sm:text-center">
            Пишете ни преку омилениот канал — одговараме во најкраток можен рок.
          </p>
          <div className="mt-5 w-full max-sm:max-w-sm max-sm:mx-auto">
            <ContactButtons size="md" dark layout="grid" />
          </div>
        </BorderBeamBox>
      </motion.div>

      <div>
        <SectionLabel>Тим</SectionLabel>
        <div className="flex flex-col gap-3 sm:gap-4 max-lg:gap-3 lg:grid lg:grid-cols-2 lg:gap-5">
          {TEAM.map((member, i) => (
            <TeamMemberCard
              key={member.email}
              member={member}
              index={i}
              mobileOrder={
                member.email === 'vladimir@nexaclaro.com' ? 'max-lg:order-1' : 'max-lg:order-2'
              }
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.06 }}
      >
        <SectionLabel>Општи информации</SectionLabel>
        <BorderBeamBox accent="sky" innerClassName="p-5 sm:p-8">
          <div className="flex flex-col gap-4 w-full sm:grid sm:grid-cols-2 sm:gap-10">
            <GeneralInfoTile
              icon={Mail}
              label="Контакт е-пошта"
              value={CONTACT.email}
              href={`mailto:${CONTACT.email}`}
            />
            <GeneralInfoTile
              icon={Phone}
              label="Телефон / пораки"
              value={CONTACT.phone}
              href={`tel:${CONTACT.phoneRaw}`}
            />
          </div>
        </BorderBeamBox>
      </motion.div>
    </div>
  )
}
