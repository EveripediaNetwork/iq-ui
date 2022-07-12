import {
  chakra,
  Button,
  Menu,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
  Box,
  BoxProps,
} from '@chakra-ui/react'
import React from 'react'
import { FaChevronDown } from 'react-icons/fa'

export const LanguageSwitch = (props: BoxProps) => {
  return (
    <Box {...props}>
      <Menu>
        <MenuButton
          as={Button}
          variant="ghost"
          size="sm"
          sx={{
            span: {
              gap: '2',
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          <chakra.span fontSize="2xl">🇺🇸</chakra.span>
          ENG
          <Icon as={FaChevronDown} fontSize="sm" />
        </MenuButton>
        <MenuList>
          <MenuItem gap="4">
            <chakra.span fontSize="2xl">🇺🇸</chakra.span>
            ENG
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}
