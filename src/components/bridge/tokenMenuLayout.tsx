import React from 'react'
import { TokenMenuLayoutType, TOKENS } from '@/types/bridge'
import Icon from '@chakra-ui/icon'
import {
  Flex,
  Text,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { FaChevronDown } from 'react-icons/fa'

const TokenMenuLayout = ({
  selectedTokenIcon,
  selectedToken,
  handlePathChange,
}: TokenMenuLayoutType) => {
  return (
    <Flex gap="2.5" align="center">
      <Text fontSize="sm" color="fadedText4" fontWeight="medium">
        Transfer From
      </Text>
      <Menu>
        <MenuButton
          as={Button}
          variant="outline"
          fontSize="sm"
          size="xs"
          fontWeight="medium"
          sx={{
            span: {
              display: 'flex',
              gap: '2',
              alignItems: 'center',
            },
          }}
        >
          {selectedTokenIcon}
          <Text fontSize="md" fontWeight="medium">
            {selectedToken?.label}
          </Text>
          <Icon fontSize="xs" as={FaChevronDown} />
        </MenuButton>
        <MenuList>
          {TOKENS.filter(tok => tok.id !== selectedToken?.id).map(tok => (
            <MenuItem key={tok.id} onClick={() => handlePathChange(tok.id)}>
              {tok.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  )
}

export default TokenMenuLayout
