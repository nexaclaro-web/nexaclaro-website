import type { PortfolioUiProjectId } from './portfolioProjects'


/**
 * Local JPEGs — 3 real pages per folder (screen-0 home, screen-1 inner, screen-2 contact/booking).
 * Regenerate: npm run capture:portfolio
 */
export const PORTFOLIO_SCREENSHOT_FOLDERS: Record<PortfolioUiProjectId, string> = {
  'urban-table': 'restaurant',
  'brew-co': 'cafe',
  'nova-industries': 'corporate',
  staypoint: 'hotel',
  'prime-living': 'estate',
  clearfix: 'service',
  opspanel: 'dashboard',
}

export function portfolioScreenshotSrc(projectId: PortfolioUiProjectId, variant: 0 | 1 | 2) {
  const folder = PORTFOLIO_SCREENSHOT_FOLDERS[projectId]
  return `/assets/portfolio/${folder}/screen-${variant}.jpg`
}
