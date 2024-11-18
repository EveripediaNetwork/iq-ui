'use client'

import React from 'react'
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react'
import { Provider as ReduxProviderClass } from 'react-redux'
import { Dict } from '@chakra-ui/utils'
import Fonts from '@/theme/Fonts'
import { createConfig, WagmiConfig } from 'wagmi'
import { connectors, publicClient, webSocketPublicClient } from '@/config/wagmi'
import { store } from '@/store/store'
import { DashboardLayout } from '@/components/dashboard/layout'
import chakraTheme from '@/theme'
import { CSPostHogProvider } from './PosthogProvider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const { ToastContainer } = createStandaloneToast()
const ReduxProvider = ReduxProviderClass as (props: Dict) => JSX.Element

const client = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ReduxProvider store={store}>
        <ChakraProvider resetCSS theme={chakraTheme}>
          <Fonts />
          <WagmiConfig config={client}>
            <CSPostHogProvider>
              <NuqsAdapter>
                <DashboardLayout>{children}</DashboardLayout>
              </NuqsAdapter>
            </CSPostHogProvider>
          </WagmiConfig>
        </ChakraProvider>
      </ReduxProvider>

      <ToastContainer />
    </>
  )
}

export default AppProviders
