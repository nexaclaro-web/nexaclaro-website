import { useEffect, useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { X } from 'lucide-react'

import { PLATFORM, type PORTFOLIO } from '../../data/content'

import { isPortfolioDesignProject } from '../../data/portfolioProjects'

import { PortfolioPreview } from './PortfolioPreview'

import { BrowserFrame } from '../ui/BrowserFrame'

import { PLATFORM_DEMO_TRIM_START_SEC } from '../../lib/platformDemoVideo'



type Project = (typeof PORTFOLIO)[number]



type Props = {

  project: Project | null

  onClose: () => void

}



export function ProjectModal({ project, onClose }: Props) {

  const [screen, setScreen] = useState<0 | 1 | 2>(0)



  useEffect(() => {

    if (!project) return

    setScreen(0)

    const onKey = (e: KeyboardEvent) => {

      if (e.key === 'Escape') onClose()

    }

    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', onKey)

    return () => {

      document.body.style.overflow = ''

      window.removeEventListener('keydown', onKey)

    }

  }, [project, onClose])



  const interactive = project ? isPortfolioDesignProject(project.id) : false
  const canSwitchScreens = interactive



  return (

    <AnimatePresence>

      {project && (

        <motion.div

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          exit={{ opacity: 0 }}

          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-sm"

          onClick={onClose}

        >

          <motion.div

            initial={{ opacity: 0, y: 40 }}

            animate={{ opacity: 1, y: 0 }}

            exit={{ opacity: 0, y: 20 }}

            transition={{ type: 'spring', damping: 28, stiffness: 300 }}

            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl"

            onClick={(e) => e.stopPropagation()}

          >

            <button

              type="button"

              onClick={onClose}

              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/60 border border-white/10 text-white hover:bg-black/80"

              aria-label="Затвори"

            >

              <X className="w-5 h-5" />

            </button>



            {'video' in project && project.video ? (
              <div className="p-4 sm:p-6">
                <BrowserFrame
                  videoSrc={project.video}
                  urlBar="exchange-office.nexaclaro.com"
                  trimStartSec={PLATFORM_DEMO_TRIM_START_SEC}
                />
              </div>
            ) : (
              <PortfolioPreview
                theme={project.theme}
                name={project.name}
                projectId={project.id}
                tall
                variant={canSwitchScreens ? screen : 0}
                onNavigate={interactive ? setScreen : undefined}
              />
            )}



            <div className="p-5 sm:p-8 border-t border-white/[0.06]">

              <div className="flex flex-wrap gap-2 mb-4">

                {project.tags.map((tag) => (

                  <span

                    key={tag}

                    className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full text-neutral-500 border border-white/[0.08]"

                  >

                    {tag}

                  </span>

                ))}

                {'isLive' in project && project.isLive && (

                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full text-emerald-400 border border-emerald-500/30 bg-emerald-500/10">

                    {PLATFORM.portfolioBadge}

                  </span>

                )}

              </div>



              <p className="text-xs text-neutral-600 uppercase tracking-wide">

                {project.type} · {project.region}

              </p>

              <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-white">{project.name}</h3>

              <p className="mt-4 text-neutral-400 leading-relaxed">{project.longDescription}</p>



              <div className="mt-6">

                <p className="text-xs uppercase tracking-wider text-neutral-600 mb-2">

                  Испорачано

                </p>

                <ul className="space-y-1">

                  {project.deliverables.map((d) => (

                    <li key={d} className="text-sm text-neutral-300">

                      · {d}

                    </li>

                  ))}

                </ul>

              </div>



              {'screenshots' in project &&
                project.screenshots &&
                !('video' in project && project.video) && (

                <div className="mt-6">

                  <p className="text-xs uppercase tracking-wider text-neutral-600 mb-1">

                    Преглед на екрани

                  </p>

                  {canSwitchScreens && (
                    <p className="text-[11px] text-neutral-500 mb-3">
                      Кликнете на минијатурите за да ги смените екраните.
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">

                    {project.screenshots.map((label, n) => {

                      const idx = n as 0 | 1 | 2

                      const isActive = canSwitchScreens && screen === idx

                      return (

                        <div key={label} className="space-y-1.5">

                          <button

                            type="button"

                            onClick={() => canSwitchScreens && setScreen(idx)}

                            className={`w-full rounded-lg overflow-hidden border bg-[#0a0a0a] h-24 sm:h-36 transition-all ${

                              isActive

                                ? 'border-white/30 ring-2 ring-white/20'

                                : 'border-white/[0.06] hover:border-white/15'

                            } ${canSwitchScreens ? 'cursor-pointer' : 'cursor-default'}`}

                          >

                            <PortfolioPreview

                              theme={project.theme}

                              name={project.name}

                              projectId={project.id}

                              compact

                              variant={idx}

                            />

                          </button>

                          <p

                            className={`text-[10px] text-center uppercase tracking-wide ${

                              isActive ? 'text-white' : 'text-neutral-600'

                            }`}

                          >

                            {label}

                          </p>

                        </div>

                      )

                    })}

                  </div>

                </div>

              )}

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  )

}


