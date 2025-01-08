import './global.css'
import { getLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

const DEFAULT_OG_IMAGE = 'https://iq.braindao.org/og_image.png'
const BASE_URL = 'https://iq.iqai.com'
const OPENGRAPH_URL = 'https://iq.iqai.com/dashboard'
const TWITTER_IMAGE_URL = 'https://iq.iqai.com/og_image.png'

export async function generateMetadata() {
  const t = await getTranslations('metadata')

  return {
    title: {
      default: t('defaultSeoTitle'),
      template: t('defaultSeoTitleTemplate'),
    },
    metadataBase: new URL(BASE_URL),
    description: t('defaultSeoDescription'),
    openGraph: {
      title: {
        default: t('defaultSeoTitle'),
        template: t('defaultSeoTitleTemplate'),
      },
      description: t('defaultSeoDescription'),
      url: OPENGRAPH_URL,
      siteName: 'IQ Dashboard',
      type: 'website',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@IQWiki',
      site: 'IQ GPT',
      images: [
        {
          url: TWITTER_IMAGE_URL,
          width: 300,
          height: 157,
          type: 'image/png',
        },
      ],
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta property="og:image" content="https://iq.iqai.com/og_image.png" />
        <meta name="image:type" content="png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="debank-cloud-site-verification"
          content="bba105af03355b417ae9969b16131dea"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
        />
      </head>
      <body>
        <div>{children}</div>
      </body>
    </html>
  )
}
