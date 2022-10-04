import React, { StrictMode } from 'react'
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react'
import { Provider as ReduxProviderClass } from 'react-redux'
import type { AppProps } from 'next/app'
import { Dict } from '@chakra-ui/utils'
import Fonts from '@/theme/Fonts'
import { createClient, WagmiConfig } from 'wagmi'
import { connectors, provider } from '@/config/wagmi'
import { store } from '@/store/store'
import { UALProviderSwitch, WalletProvider } from '@/context/eosWalletContext'
import { DashboardLayout } from '@/components/dashboard/layout'
import chakraTheme from '../theme'
import SEOHeader from '@/components/SEO/Default'

const { ToastContainer } = createStandaloneToast()
const ReduxProvider = ReduxProviderClass as unknown as (
  props: Dict,
) => JSX.Element

type CreateClientArgs = NonNullable<Parameters<typeof createClient>[number]>
type CreateClientConnectors = CreateClientArgs['connectors']
const createClientConnectors = connectors as CreateClientConnectors

const client = createClient({
  autoConnect: true,
  connectors: createClientConnectors,
  provider,
})

const App = (props: AppProps) => {
  const { Component, pageProps, router } = props

  return (
    <StrictMode>
      <SEOHeader router={router}/>
      <ReduxProvider store={store}>
        <ChakraProvider resetCSS theme={chakraTheme}>
          <Fonts />
          <WagmiConfig client={client}>
            <UALProviderSwitch>
              <WalletProvider>
                <DashboardLayout>
                  <Component {...pageProps} />
                </DashboardLayout>
              </WalletProvider>
            </UALProviderSwitch>
          </WagmiConfig>
        </ChakraProvider>
      </ReduxProvider>
      <ToastContainer />
    </StrictMode>
  )
}

export default App
