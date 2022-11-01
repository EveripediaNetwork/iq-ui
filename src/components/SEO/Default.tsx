import { DefaultSeo } from 'next-seo'
import React from 'react'
import { NextRouter } from 'next/dist/shared/lib/router/router'

interface SEOHeaderProps {
  router: NextRouter
}

const SEOHeader = ({ router }: SEOHeaderProps) => (
  <DefaultSeo
    title="BrainDAO | native DAO and treasury of the IQ Token"
    titleTemplate="%s | BrainDAO"
    description="BrainDAO is the native DAO and treasury of the IQ Token which powers IQ.wiki"
    canonical={`https://iq.braindao.org/${router.asPath || ''}`}
    openGraph={{
      title: 'BrainDAO | native DAO and treasury of the IQ Token',
      description:
        'BrainDAO is the native DAO and treasury of the IQ Token which powers IQ.wiki',
      type: 'website',
      site_name: 'IQ Dashboard',
      images: [
        {
          url: 'https://iq.braindao.org/og_image.png',
          alt: 'BrainDAO | native DAO and treasury of the IQ Token',
        },
      ],
    }}
    twitter={{
      cardType: 'summary_large_image',
      handle: '@Everipedia',
      site: 'BrainDao',
    }}
  />
)

export default SEOHeader
