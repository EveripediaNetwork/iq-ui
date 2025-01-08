import 'regenerator-runtime/runtime'
import React from 'react'
import { Metadata } from 'next'
import AppProviders from '@/components/client/AppProviders'
import ColorMode from '@/components/chakra/ColorMode'
import './global.css'
import { getLocale, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'

export const metadata: Metadata = {
  title: {
    default: 'IQ | native DAO and treasury of the IQ Token',
    template: '%s | IQ',
  },
  metadataBase: new URL('https://iq.iqai.com/'),
  description:
    'IQ is the native DAO and treasury of the IQ Token which powers IQ.wiki',
  openGraph: {
    title: 'IQ | native DAO and treasury of the IQ Token',
    description:
      'IQ is the native DAO and treasury of the IQ Token which powers IQ.wiki',
    url: 'https://iq.iqai.com/dashboard',
    siteName: 'IQ Dashboard',
    type: 'website',
    images: [
      {
        url: 'https://iq.iqai.com/og_image.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@IQWiki',
    site: 'IQ GPT',
  },
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const locale = await getLocale()

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta property="og:image" content="https://iq.iqai.com/og_image.png" />
        <meta name="image:type" content="png" />
        <meta
          property="twitter:image"
          content="https://iq.iqai.com/og_image.png"
        />
        <meta name="twitter:image:type" content="png" />
        <meta name="twitter:image:width" content="300px" />
        <meta name="twitter:image:height" content="157px" />
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
        <NextIntlClientProvider messages={messages}>
          <ColorMode />
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
