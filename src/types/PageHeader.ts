interface PageHeaderProps {
  header: string
  body?: string
}

type tooltipProps = { externalLink?: string; tooltipLabel?: string }

export type PageHeaderPropsType = PageHeaderProps & tooltipProps
