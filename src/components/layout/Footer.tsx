import { Link } from 'react-router-dom'

import { MessageCircle, Phone, Send, Mail, Linkedin } from 'lucide-react'

import { NAV_LINKS, CONTACT } from '../../data/content'

import { Logo } from '../ui/Logo'

import { FooterWordmark } from './FooterWordmark'

import { CONTAINER } from '../../lib/layout'



const social = [

  { href: CONTACT.whatsapp, icon: MessageCircle, label: 'WhatsApp' },

  { href: CONTACT.viber, icon: Phone, label: 'Viber' },

  { href: CONTACT.telegram, icon: Send, label: 'Telegram' },

  { href: `mailto:${CONTACT.email}`, icon: Mail, label: 'Е-пошта' },

  { href: CONTACT.linkedin, icon: Linkedin, label: 'LinkedIn' },

]



export function Footer() {

  return (

    <footer className="relative bg-black text-neutral-500 border-t border-white/[0.06] overflow-hidden">

      <div className={`relative ${CONTAINER}`}>

        <FooterWordmark />



        <div className="pb-12 sm:pb-16 lg:pb-20">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12">

            <div className="lg:col-span-5 flex flex-col items-start gap-5">

              <Link to="/" className="inline-flex">

                <Logo size="md" variant="footer" />

              </Link>

              <p className="text-sm leading-relaxed max-w-sm text-neutral-500 w-full">

                Модерни веб-страници, бизнис платформи и дигитални решенија по мерка.

              </p>

              <div className="flex gap-2 w-full">

                {social.map(({ href, icon: Icon, label }) => (

                  <a

                    key={label}

                    href={href}

                    target={href.startsWith('http') ? '_blank' : undefined}

                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}

                    aria-label={label}

                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/25 transition-all"

                  >

                    <Icon className="w-4 h-4" />

                  </a>

                ))}

              </div>

            </div>



            <div className="lg:col-span-3">

              <h4 className="text-sm font-medium text-white mb-4">Навигација</h4>

              <ul className="space-y-3 text-sm">

                {NAV_LINKS.map((l) => (

                  <li key={l.href}>

                    <Link to={l.href} className="hover:text-white transition-colors">

                      {l.label}

                    </Link>

                  </li>

                ))}

              </ul>

            </div>



            <div className="lg:col-span-4">

              <h4 className="text-sm font-medium text-white mb-4">Контакт</h4>

              <ul className="space-y-3 text-sm">

                <li>

                  <a href="mailto:martin@nexaclaro.com" className="hover:text-white transition-colors">

                    martin@nexaclaro.com

                  </a>

                </li>

                <li>

                  <a href="mailto:vladimir@nexaclaro.com" className="hover:text-white transition-colors">

                    vladimir@nexaclaro.com

                  </a>

                </li>

                <li>

                  <a href={`mailto:${CONTACT.email}`} className="hover:text-white transition-colors">

                    {CONTACT.email}

                  </a>

                </li>

                <li>

                  <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-white transition-colors">

                    {CONTACT.phone}

                  </a>

                </li>

              </ul>

            </div>

          </div>



          <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">

            <p>© 2026 NexaClaro. Сите права се задржани.</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-neutral-500">
              <Link to="/privatnost" className="hover:text-white transition-colors">
                Политика за приватност
              </Link>
              <span className="hidden sm:inline text-neutral-700" aria-hidden>
                ·
              </span>
              <span>Прилеп, Северна Македонија</span>
            </div>

          </div>

        </div>

      </div>

    </footer>

  )

}

