'use client'

import React from 'react'
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react'
import { Provider as ReduxProviderClass } from 'react-redux'
import { Dict } from '@chakra-ui/utils'
import Fonts from '@/theme/Fonts'
import { createConfig, WagmiConfig } from 'wagmi'
import { connectors, publicClient, webSocketPublicClient } from '@/config/wagmi'
import { store } from '@/store/store'
import { UALProviderSwitch, WalletProvider } from '@/context/eosWalletContext'
import { DashboardLayout } from '@/components/dashboard/layout'
import GoogleAnalyticsScripts from '@/components/SEO/GoogleAnalyticsScripts'
import chakraTheme from '@/theme'
import { Metadata } from 'next'

const { ToastContainer } = createStandaloneToast()
const ReduxProvider = ReduxProviderClass as (props: Dict) => JSX.Element

const client = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export const metadata: Metadata = {
  title: {
    default: 'BrainDAO | native DAO and treasury of the IQ Token',
    template: '%s | BrainDAO',
  },
  description:
    'BrainDAO is the native DAO and treasury of the IQ Token which powers IQ.wiki',
  openGraph: {
    title: 'BrainDAO | native DAO and treasury of the IQ Token',
    description:
      'BrainDAO is the native DAO and treasury of the IQ Token which powers IQ.wiki',
    url: 'https://iq.braindao.org',
    siteName: 'IQ Dashboard',
    images: [
      {
        url: 'https://iq.braindao.org/og_image.png',
        alt: 'BrainDAO | native DAO and treasury of the IQ Token',
      },
    ],
  },
  twitter: {
    title: 'BrainDAO | native DAO and treasury of the IQ Token',
    description:
      'BrainDAO is the native DAO and treasury of the IQ Token which powers IQ.wiki',
    site: '@Everipedia',
    creator: '@Everipedia',
    images: [
      {
        url: 'https://iq.braindao.org/og_image.png',
        alt: 'BrainDAO | native DAO and treasury of the IQ Token',
      },
    ],
    card: 'summary_large_image',
  },
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <ReduxProvider store={store}>
          <ChakraProvider resetCSS theme={chakraTheme}>
            <Fonts />
            <WagmiConfig config={client}>
              <GoogleAnalyticsScripts />
              <UALProviderSwitch>
                <WalletProvider>
                  <DashboardLayout>{children}</DashboardLayout>
                </WalletProvider>
              </UALProviderSwitch>
            </WagmiConfig>
          </ChakraProvider>
        </ReduxProvider>
        <ToastContainer />
      </body>
    </html>
  )
}

export default Layout
