import ErrorPage from '@/components/client/404'

import { Metadata } from 'next'

const notFoundTitle = 'Opps! Page Not Found'
const notFoundMessage =
  "Sorry, but the page you're looking for doesn't exist. Don't worry, we'll help you find your way back."

export const metadata: Metadata = {
  title: notFoundTitle,
  description: notFoundMessage,
  metadataBase: new URL('https://iq.braindao.org/dashboard'),
  openGraph: {
    title: notFoundTitle,
    description: notFoundMessage,
    type: 'website',
    siteName: 'IQ Dashboard',
  },
  twitter: {
    title: notFoundTitle,
    description: notFoundMessage,
    images: 'https://iq.braindao.org/og_image.png',
    card: 'summary_large_image',
    creator: '@IQWiki',
    site: 'IQ Dashbaord',
  },
}

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <ErrorPage />
      </body>
    </html>
  )
}
