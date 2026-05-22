import type { PortfolioTheme } from '../../data/content'
import { isPortfolioDesignProject, PORTFOLIO_UI_META } from '../../data/portfolioProjects'
import { ExchangeDashboardPreview } from './ExchangeDashboardPreview'
import { PortfolioScreenshotPreview } from './PortfolioScreenshotPreview'
import type { PortfolioUiProjectId } from '../../data/portfolioProjects'

type Props = {
  theme: PortfolioTheme
  name: string
  projectId?: string
  tall?: boolean
  compact?: boolean
  variant?: 0 | 1 | 2
  onNavigate?: (variant: 0 | 1 | 2) => void
}

type ThemePreview = {
  image?: string
  urlSlug: string
  accent: string
  accentMuted: string
  surface: string
}

const themePreviews: Record<PortfolioTheme, ThemePreview> = {
  restaurant: {
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    urlSlug: 'restaurant-design.com',
    accent: '#f59e0b',
    accentMuted: 'rgba(245,158,11,0.35)',
    surface: '#1c1917',
  },
  cafe: {
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    urlSlug: 'brewco.com',
    accent: '#d97706',
    accentMuted: 'rgba(217,119,6,0.35)',
    surface: '#1c1917',
  },
  corporate: {
    urlSlug: 'novaindustries.com',
    accent: '#3b82f6',
    accentMuted: 'rgba(59,130,246,0.35)',
    surface: '#0f172a',
  },
  hotel: {
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
    urlSlug: 'staypoint.com',
    accent: '#818cf8',
    accentMuted: 'rgba(129,140,248,0.35)',
    surface: '#1e1b4b',
  },
  realestate: {
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
    urlSlug: 'primeliving.com',
    accent: '#10b981',
    accentMuted: 'rgba(16,185,129,0.35)',
    surface: '#14532d',
  },
  service: {
    urlSlug: 'clearfixservices.com',
    accent: '#0ea5e9',
    accentMuted: 'rgba(14,165,233,0.35)',
    surface: '#0c4a6e',
  },
  dashboard: {
    urlSlug: 'opspanel.app',
    accent: '#8b5cf6',
    accentMuted: 'rgba(139,92,246,0.3)',
    surface: '#0a0a0a',
  },
  platform: {
    urlSlug: 'exchange-office.nexaclaro.com',
    accent: '#34d399',
    accentMuted: 'rgba(52,211,153,0.3)',
    surface: '#0a0a0a',
  },
}

function slugFromName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '').concat('.com')
}

function BrowserChrome({ url, compact }: { url: string; compact?: boolean }) {
  return (
    <div
      className={`shrink-0 bg-[#141414] border-b border-white/[0.08] flex items-center gap-2 ${
        compact ? 'h-5 px-1.5' : 'h-7 sm:h-8 px-2.5'
      }`}
    >
      <div className={`flex gap-1 ${compact ? 'scale-75 origin-left' : ''}`}>
        <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <span className="w-2 h-2 rounded-full bg-[#28c840]" />
      </div>
      <div
        className={`flex-1 rounded-md bg-black/50 border border-white/[0.06] flex items-center px-2 min-w-0 ${
          compact ? 'h-3.5' : 'h-5'
        }`}
      >
        <span
          className={`text-neutral-500 truncate w-full ${compact ? 'text-[7px]' : 'text-[9px] sm:text-[10px]'}`}
        >
          {url}
        </span>
      </div>
    </div>
  )
}

function MarketingPreview({
  theme,
  name,
  variant,
  compact,
  image,
}: {
  theme: PortfolioTheme
  name: string
  variant: 0 | 1 | 2
  compact?: boolean
  image?: string
}) {
  const t = themePreviews[theme]
  const pad = compact ? 'p-2' : 'p-3 sm:p-4'
  const titleSize = compact ? 'text-[10px]' : 'text-xs sm:text-sm'
  const subSize = compact ? 'text-[8px]' : 'text-[9px] sm:text-[10px]'

  if (variant === 1) {
    return (
      <div className="relative flex-1 min-h-0" style={{ background: t.surface }}>
        <div className={`relative h-full flex flex-col ${pad}`}>
          <div className="flex items-center justify-between mb-2">
            <div
              className="h-4 w-14 rounded-md"
              style={{ background: t.accentMuted, border: `1px solid ${t.accent}55` }}
            />
            <div className="flex gap-1">
              {['Menu', 'Gallery', 'Contact'].map((l) => (
                <span key={l} className={`${subSize} text-white/40 px-1`}>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div className={`grid grid-cols-2 gap-1.5 flex-1 ${compact ? 'gap-1' : 'gap-2'}`}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden border border-white/10 bg-black/30 flex flex-col"
              >
                <div
                  className={`${compact ? 'h-10' : 'h-14 sm:h-16'} bg-cover bg-center`}
                  style={{
                    backgroundImage: image ? `url(${image})` : undefined,
                    filter: 'saturate(1.1)',
                  }}
                />
                <div className="p-1.5 space-y-1">
                  <div className="h-1 w-3/4 rounded bg-white/25" />
                  <div className="h-0.5 w-1/2 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 2) {
    return (
      <div className="relative flex-1 min-h-0 flex" style={{ background: t.surface }}>
        <div
          className="w-[42%] bg-cover bg-center border-r border-white/10"
          style={{ backgroundImage: image ? `url(${image})` : undefined }}
        />
        <div className={`flex-1 flex flex-col justify-center ${pad} gap-2`}>
          <p className={`${subSize} uppercase tracking-wider`} style={{ color: t.accent }}>
            Contact
          </p>
          <p className={`${titleSize} font-semibold text-white leading-tight line-clamp-2`}>{name}</p>
          <div className="space-y-1 mt-1">
            <div className="h-4 rounded border border-white/15 bg-white/5" />
            <div className="h-4 rounded border border-white/15 bg-white/5" />
            <div
              className={`${compact ? 'h-5' : 'h-6'} rounded-md mt-1 flex items-center justify-center text-[8px] font-medium text-black`}
              style={{ background: t.accent }}
            >
              Send
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/50 to-black/20" />
      <div className={`relative h-full flex flex-col ${pad}`}>
        <nav className="flex items-center justify-between gap-2">
          <span className={`${titleSize} font-bold text-white tracking-tight line-clamp-1`}>
            {name}
          </span>
          {!compact && (
            <div className="flex gap-2 shrink-0">
              {['Home', 'Menu', 'Book'].map((l) => (
                <span key={l} className={`${subSize} text-white/50`}>
                  {l}
                </span>
              ))}
            </div>
          )}
        </nav>
        <div className={`mt-auto ${compact ? 'space-y-1' : 'space-y-2'}`}>
          <p
            className={`${compact ? 'text-[11px]' : 'text-sm sm:text-base'} font-semibold text-white leading-snug max-w-[95%]`}
          >
            {theme === 'restaurant'
              ? 'Reserve your table'
              : theme === 'cafe'
                ? 'Craft coffee & atmosphere'
                : theme === 'hotel'
                  ? 'Stay with comfort'
                  : 'Find your next home'}
          </p>
          <div
            className={`inline-flex items-center justify-center rounded-md font-medium text-black ${
              compact ? 'h-5 px-2 text-[8px]' : 'h-6 sm:h-7 px-3 text-[9px] sm:text-[10px]'
            }`}
            style={{ background: t.accent }}
          >
            View more
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewBody({
  theme,
  name,
  variant,
  compact,
  projectId,
}: {
  theme: PortfolioTheme
  name: string
  variant: 0 | 1 | 2
  compact?: boolean
  projectId?: string
  onNavigate?: (variant: 0 | 1 | 2) => void
}) {
  if (projectId === 'exchange-platform') {
    if (variant === 0) {
      return (
        <>
          <BrowserChrome url="exchange-office.nexaclaro.com" compact={compact} />
          <div className="relative flex-1 min-h-0 overflow-hidden bg-[#0a0a0a]">
            <img
              src="/assets/portfolio/exchange/landing.jpg"
              alt=""
              className="w-full h-full object-cover object-top"
              loading={compact ? 'lazy' : 'eager'}
              decoding="async"
              draggable={false}
            />
          </div>
        </>
      )
    }
    return (
      <>
        <BrowserChrome url="exchange-office.nexaclaro.com" compact={compact} />
        <ExchangeDashboardPreview variant={variant} compact={compact} />
      </>
    )
  }

  if (isPortfolioDesignProject(projectId)) {
    const url = PORTFOLIO_UI_META[projectId].url
    return (
      <>
        <BrowserChrome url={url} compact={compact} />
        <div className="relative flex-1 min-h-0 overflow-hidden">
          <PortfolioScreenshotPreview
            projectId={projectId as PortfolioUiProjectId}
            variant={variant}
            compact={compact}
          />
        </div>
      </>
    )
  }

  const t = themePreviews[theme]
  const url = t.urlSlug || slugFromName(name)

  return (
    <>
      <BrowserChrome url={url} compact={compact} />
      <MarketingPreview
        theme={theme}
        name={name}
        variant={variant}
        compact={compact}
        image={t.image}
      />
    </>
  )
}

export function PortfolioPreview({
  theme,
  name,
  projectId,
  tall,
  compact,
  variant = 0,
  onNavigate,
}: Props) {
  const height = tall ? 'h-64 sm:h-80' : compact ? 'h-full min-h-[96px]' : 'h-52 sm:h-56'

  return (
    <div
      className={`relative ${height} flex flex-col overflow-hidden bg-[#0a0a0a] ring-1 ring-inset ring-white/[0.06]`}
      aria-hidden={!onNavigate}
    >
      <PreviewBody
        theme={theme}
        name={name}
        variant={variant}
        compact={compact}
        projectId={projectId}
      />
    </div>
  )
}
