interface PageHeaderProps {
    header: string
    body: string
    hasBody: boolean
    tooltipLabel: string
  }
  
  type tooltipProps = 
    | {hasExternalLink: false; externalLink: never}
    | {hasExternalLink: true; externalLink: string}
  
  export type PageHeaderPropsType = PageHeaderProps & tooltipProps