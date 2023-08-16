import {
  Button,
  Menu,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
  Box,
  BoxProps,
  Image,
} from '@chakra-ui/react'
import React from 'react'
import { FaChevronDown } from 'react-icons/fa'

export const LanguageSwitch = (props: BoxProps) => {
  return (
    <Box {...props}>
      <Menu>
        <MenuButton
          as={Button}
          variant="outline"
          size="sm"
          sx={{
            span: {
              gap: '2',
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          <Image src="/usaFlag.png" objectFit="cover" boxSize="32px" alt="🇺🇸" />
          ENG
          <Icon as={FaChevronDown} fontSize="sm" />
        </MenuButton>
        <MenuList>
          <MenuItem gap="4">
            <Image
              src="/usaFlag.png"
              objectFit="cover"
              boxSize="32px"
              alt="🇺🇸"
            />
            ENG
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}
