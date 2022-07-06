import React, { StrictMode } from 'react'
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import Fonts from '@/theme/Fonts'
import chakraTheme from '../theme'
import { createClient, WagmiConfig } from 'wagmi'
import { connectors, provider } from '@/config/wagmi'

const { ToastContainer } = createStandaloneToast()

type CreateClientArgs = NonNullable<Parameters<typeof createClient>[number]>
type CreateClientConnectors = CreateClientArgs['connectors']
const createClientConnectors = connectors as CreateClientConnectors

const client = createClient({
  autoConnect: true,
  connectors: createClientConnectors,
  provider,
})

const App = (props: AppProps) => {
  const { Component, pageProps } = props

  return (
    <StrictMode>
      <ChakraProvider resetCSS theme={chakraTheme}>
        <Fonts />
        <WagmiConfig client={client}>
           <Component {...pageProps} />
        </WagmiConfig>
      </ChakraProvider>
      <ToastContainer />
    </StrictMode>
  )
}

export default App
