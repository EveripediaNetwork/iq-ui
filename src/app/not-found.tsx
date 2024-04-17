'use client'

import ColorMode from '@/components/chakra/ColorMode'
import ErrorPage from '@/components/client/404'
import { ChakraProvider } from '@chakra-ui/react'
import chakraTheme from '@/theme'

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <ChakraProvider resetCSS theme={chakraTheme}>
          <ColorMode />
          <ErrorPage />
        </ChakraProvider>
      </body>
    </html>
  )
}
