import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV_LINKS } from '../../data/content'
import { Logo } from '../ui/Logo'
import { CONTAINER } from '../../lib/layout'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className={`${CONTAINER} h-16 lg:h-[4.75rem] flex items-center justify-between gap-6`}>
        <Link to="/" className="shrink-0 overflow-visible" onClick={() => setOpen(false)}>
          <Logo size="md" />
        </Link>

        <nav className="hidden xl:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-[15px] transition-colors ${
                location.pathname === link.href
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden xl:block shrink-0">
          <Link
            to="/ponuda"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white border border-white/20 hover:bg-white/5 transition-all"
          >
            Побарај понуда
          </Link>
        </div>

        <button
          type="button"
          className="xl:hidden p-2 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Затвори мени' : 'Отвори мени'}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="xl:hidden border-t border-white/[0.06] bg-black/98 backdrop-blur-xl max-h-[min(70vh,calc(100dvh-4.5rem))] overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
          >
            <nav className={`${CONTAINER} flex flex-col py-4 pb-6`}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="py-3.5 text-neutral-300 hover:text-white border-b border-white/[0.05] last:border-0 text-base"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/ponuda"
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-white text-black font-medium"
              >
                Побарај понуда
                <ArrowRight className="w-4 h-4" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
