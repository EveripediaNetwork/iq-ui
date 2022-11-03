import React, { StrictMode, useEffect } from 'react'
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
import SEOHeader from '@/components/SEO/Default'
import chakraTheme from '../theme'
import { pageView } from '@/utils/googleAnalytics'

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
  useEffect(() => {
    const handleRouteChange = (url: URL) => pageView(url)
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  return (
    <StrictMode>
      <SEOHeader router={router} />
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
