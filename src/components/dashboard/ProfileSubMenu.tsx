import React from 'react'
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import {
  RiFileCopyLine,
  RiLogoutBoxLine,
  RiExternalLinkLine,
} from 'react-icons/ri'
import shortenAccount from '@/utils/shortenAccount'
import DisplayAvatar from '@/components/elements/Avatar/Avatar'
import { useAccount, useDisconnect } from 'wagmi'
import { FaChevronDown } from 'react-icons/fa'

const ProfileSubMenu = () => {
  const { data } = useAccount()
  const { disconnect } = useDisconnect()
  const logout = () => {
      disconnect()
  }
  return (
    <Menu>
      <MenuButton
        as={Button}
        size="md"
        fontWeight="400"
        variant="outline"
        leftIcon={<DisplayAvatar size={20} address={data?.address} />}
        rightIcon={<FaChevronDown />}
      >
        <Text fontSize="sm">
          {data?.address && shortenAccount(data.address)}
        </Text>
      </MenuButton>
      <MenuList>
        <MenuItem color="dimmedText" icon={<RiFileCopyLine fontSize={20} />}>
          <Text fontWeight="bold">Copy Address</Text>
        </MenuItem>
        <MenuItem
          color="dimmedText"
          icon={<RiExternalLinkLine fontSize={20} />}
        >
          <Text fontWeight="bold">View on Etherscan</Text>
        </MenuItem>
        <MenuItem
          color="dimmedText"
          onClick={logout}
          icon={<RiLogoutBoxLine fontSize={20} />}
        >
          <Text fontWeight="bold">Disconnect</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default ProfileSubMenu
