import { useColorMode } from '@chakra-ui/react'
import { type ReactNode, useEffect } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorMode } = useColorMode()

  useEffect(() => {
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [colorMode])

  return children
}