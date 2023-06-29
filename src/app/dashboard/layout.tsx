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

const { ToastContainer } = createStandaloneToast()
const ReduxProvider = ReduxProviderClass as (props: Dict) => JSX.Element

const client = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

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
