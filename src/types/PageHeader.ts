interface PageHeaderProps {
  header: string
  body?: string
  hasBody: boolean
}

type tooltipProps =
  | { hasExternalLink: false; externalLink?: never; tooltipLabel?: never }
  | { hasExternalLink: true; externalLink: string; tooltipLabel: string }

export type PageHeaderPropsType = PageHeaderProps & tooltipProps
