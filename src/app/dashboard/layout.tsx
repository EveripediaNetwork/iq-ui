import React from 'react'
import { Metadata } from 'next'
import AppProviders from '@/components/client/AppProviders'

export const metadata: Metadata = {
  title: {
    default: 'BrainDAO | native DAO and treasury of the IQ Token',
    template: '%s | BrainDAO',
  },
  metadataBase: new URL('https://iqgpt.com'),
  description:
    'BrainDAO is the native DAO and treasury of the IQ Token which powers IQ.wiki',
  openGraph: {
    title: 'BrainDAO | native DAO and treasury of the IQ Token',
    description:
      'BrainDAO is the native DAO and treasury of the IQ Token which powers IQ.wiki',
    url: 'https://iq.braindao.org/dashboard',
    siteName: 'IQ Dashboard',
    type: 'website',
    images: [
      {
        url: 'https://iq.braindao.org/og_image.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@IQWiki',
    site: 'IQ GPT',
  },
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}

export default Layout
