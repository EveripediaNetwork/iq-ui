interface PortfolioLinkProps {
  label: string
  externalLink: string
  tooltipLabel?: string
}

interface PageHeaderProps {
  header: string
  body?: string
  portfolios?: PortfolioLinkProps[] // Added new prop type
}

type tooltipProps = { externalLink?: string; tooltipLabel?: string }

export type PageHeaderPropsType = PageHeaderProps & tooltipProps
