import { DefaultSeo } from 'next-seo'
import React from 'react'
import { NextRouter } from 'next/dist/shared/lib/router/router'

interface SEOHeaderProps {
  router: NextRouter
}

const SEOHeader = ({ router }: SEOHeaderProps) => (
  <DefaultSeo
    title="Braindao | Largest Blockchain & Crypto Encyclopedia"
    titleTemplate="%s | Braindao"
    description="World's largest Blockchain & Crypto Encyclopedia"
    canonical={`https://dashboard.iq.wiki/${router.asPath || ''}`}
    openGraph={{
      title: 'Braindao | Crypto Encyclopedia',
      description:
        'The IQ token is a multichain token that powers the BrainDAO ecosystem of dapps and features. IQ token is a DeFi token that can be staked for hiIQ to earn rewards + yields. You can bridge your token from all chains IQ circulares on, using our bridge UI, an lots more.',
      type: 'website',
      site_name: 'IQ Dashboard',
      images: [
        {
          url: 'https://dashboard.iq.wiki/android-chrome-512x512.png',
          width: 512,
          height: 512,
          alt: 'Braindao | Crypto Encyclopedia',
        },
      ],
    }}
    twitter={{
      cardType: 'summary_large_image',
      handle: '@Everipedia',
      site: 'Everipedia',
    }}
  />
)

export default SEOHeader
