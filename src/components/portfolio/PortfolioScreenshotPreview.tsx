import { portfolioScreenshotSrc } from '../../data/portfolioScreenshots'
import type { PortfolioUiProjectId } from '../../data/portfolioProjects'

type Props = {
  projectId: PortfolioUiProjectId
  variant: 0 | 1 | 2
  compact?: boolean
}

export function PortfolioScreenshotPreview({ projectId, variant, compact }: Props) {
  const src = portfolioScreenshotSrc(projectId, variant)

  return (
    <img
      src={src}
      alt=""
      className={`w-full h-full object-cover object-top bg-[#0a0a0a] ${
        compact ? 'object-[center_12%]' : ''
      }`}
      loading={compact ? 'lazy' : 'eager'}
      decoding="async"
      draggable={false}
    />
  )
}
