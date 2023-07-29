import { IconButton, IconButtonProps, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { RiMoonFill, RiSunFill } from 'react-icons/ri'

export const ColorModeToggle = (props: Omit<IconButtonProps, 'aria-label'>) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const ColorModeIcon = colorMode === 'light' ? RiMoonFill : RiSunFill

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
