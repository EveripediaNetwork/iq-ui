import ColorMode from '@/components/chakra/ColorMode'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BrainDAO | native DAO and treasury of the IQ Token',
  titleTemplate: '%s | BrainDAO',
  description:
    'BrainDAO is the native DAO and treasury of the IQ Token which powers IQ.wiki',
  openGraph: {
    title: 'BrainDAO | native DAO and treasury of the IQ Token',
    description:
      'BrainDAO is the native DAO and treasury of the IQ Token which powers IQ.wiki',
    // eslint-disable-line
    type: 'website',
    site_name: 'IQ Dashboard',
    images: [
      {
        url: 'https://iq.braindao.org/og_image.png',
        alt: 'BrainDAO | native DAO and treasury of the IQ Token',
      },
    ],
  },
  twitter: {
    // eslint-disable-line
    card: 'summary_large_image',
    handle: '@Everipedia',
    site: '@Everipedia',
  },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="debank-cloud-site-verification"
          content="bba105af03355b417ae9969b16131dea"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
        />
      </head>
      <body>
        <ColorMode />
        {children}
      </body>
    </html>
  )
}

export default RootLayout
