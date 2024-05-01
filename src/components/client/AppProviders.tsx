'use client'

import React from 'react'
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react'
import { Provider as ReduxProviderClass } from 'react-redux'
import { Dict } from '@chakra-ui/utils'
import Fonts from '@/theme/Fonts'
import { wagmiConfig } from '@/config/wagmi'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from '@/store/store'
import { UALProviderSwitch, WalletProvider } from '@/context/eosWalletContext'
import { DashboardLayout } from '@/components/dashboard/layout'
import GoogleAnalyticsScripts from '@/components/SEO/GoogleAnalyticsScripts'
import chakraTheme from '@/theme'

const { ToastContainer } = createStandaloneToast()
const ReduxProvider = ReduxProviderClass as (props: Dict) => JSX.Element
const queryClient = new QueryClient()

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ReduxProvider store={store}>
        <ChakraProvider resetCSS theme={chakraTheme}>
          <Fonts />
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <GoogleAnalyticsScripts />
              <UALProviderSwitch>
                <WalletProvider>
                  <DashboardLayout>{children}</DashboardLayout>
                </WalletProvider>
              </UALProviderSwitch>
            </QueryClientProvider>
          </WagmiProvider>
        </ChakraProvider>
      </ReduxProvider>
      <ToastContainer />
    </>
  )
}

export default AppProviders
