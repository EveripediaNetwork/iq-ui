import { IconButton, IconButtonProps, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'

export const ColorModeToggle = (props: Omit<IconButtonProps, 'aria-label'>) => {
  const { colorMode, toggleColorMode } = useColorMode()

  const ColorModeIcon = colorMode === 'light' ? FaMoon : FaSun

  return (
    <>
      <IconButton
        aria-label="Color mode"
        icon={<ColorModeIcon />}
        onClick={toggleColorMode}
        variant="outline"
        size="sm"
        {...props}
      />
    </>
  )
}
