import { DefaultSeo } from 'next-seo'
import React from 'react'
import { NextRouter } from 'next/dist/shared/lib/router/router'

interface SEOHeaderProps {
  router: NextRouter
}

const SEOHeader = ({ router }: SEOHeaderProps) => (
  <DefaultSeo
    title="IQ | native DAO and treasury of the IQ Token"
    titleTemplate="%s | IQ"
    description="IQ is the native DAO and treasury of the IQ Token which powers IQ.wiki"
    canonical={`https://iq.iqai.com/${router.asPath || ''}`}
    openGraph={{
      title: 'IQ | native DAO and treasury of the IQ Token',
      description:
        'IQ is the native DAO and treasury of the IQ Token which powers IQ.wiki',
      type: 'website',
      site_name: 'IQ Dashboard',
      images: [
        {
          url: 'https://iq.iqai.com/og_image.png',
          alt: 'IQ | native DAO and treasury of the IQ Token',
        },
      ],
    }}
    twitter={{
      cardType: 'summary_large_image',
      handle: '@Everipedia',
      site: '@Everipedia',
    }}
  />
)

export default SEOHeader
