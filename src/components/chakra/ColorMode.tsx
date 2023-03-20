'use client'

import { ColorModeScript } from '@chakra-ui/system'
import React from 'react'
import chakraTheme from '@/theme'

const ColorMode = () => {
  return (
    <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode} />
  )
}

export default ColorMode
