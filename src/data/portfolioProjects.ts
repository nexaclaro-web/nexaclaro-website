export const PORTFOLIO_UI_META = {
  'urban-table': {
    brand: 'Restaurant Design',
    url: 'restaurant-design.com',
    monogram: 'RD',
  },
  'brew-co': {
    brand: 'Coffee Shop Design',
    url: 'coffeeshop-design.com',
    monogram: 'CS',
  },
  'nova-industries': {
    brand: 'Corporate Website',
    url: 'corporate-website.com',
    monogram: 'CW',
  },
  staypoint: {
    brand: 'Hotel Website',
    url: 'hotel-website.com',
    monogram: 'HW',
  },
  'prime-living': {
    brand: 'Real Estate Website',
    url: 'realestate-website.com',
    monogram: 'RE',
  },
  clearfix: {
    brand: 'Cleaning Services',
    url: 'cleaning-services.com',
    monogram: 'CL',
  },
  opspanel: {
    brand: 'Admin Dashboard',
    url: 'admin-dashboard.app',
    monogram: 'AD',
  },
} as const

export type PortfolioUiProjectId = keyof typeof PORTFOLIO_UI_META

/** @deprecated use PORTFOLIO_UI_META */
export const PORTFOLIO_PROJECT_META = PORTFOLIO_UI_META

export function isPortfolioDesignProject(id?: string): id is PortfolioUiProjectId {
  return !!id && id in PORTFOLIO_UI_META
}
