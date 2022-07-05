import React, { StrictMode } from 'react'
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import Fonts from '@/theme/Fonts'
import chakraTheme from '../theme'

const { ToastContainer } = createStandaloneToast()

const App = (props: AppProps) => {
  const { Component, pageProps } = props

  return (
    <StrictMode>
        <ChakraProvider resetCSS theme={chakraTheme}>
          <Fonts />
          <Component {...pageProps} />
        </ChakraProvider>
      <ToastContainer />
    </StrictMode>
  )
}

export default App
