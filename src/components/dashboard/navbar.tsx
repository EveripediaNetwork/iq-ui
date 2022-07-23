import {
  Button,
  Divider,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuGroup,
  Spacer,
  Box,
  FlexProps,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import {
  RiCloseFill,
  RiGasStationLine,
  RiMenuLine,
  RiNotificationLine,
  RiFileCopyLine,
  RiLogoutBoxLine,
  RiExternalLinkLine,

} from 'react-icons/ri'
import { FaChevronDown } from 'react-icons/fa'
import { useDashboardContext } from '@/components/dashboard/utils'
import { LanguageSwitch } from '@/components/dashboard/language-switch'
import { ColorModeToggle } from '@/components/dashboard/ColorModeToggle'
import { NETWORK_DATA } from '@/data/NetworkData'
import { NetworkType } from '@/types/NetworkType'
import WalletConnect from '../wallet/WalletConnect'
import { useConnect, useAccount } from 'wagmi'
import DisplayAvatar from '../elements/Avatar/Avatar'
import shortenAccount from '@/utils/shortenAccount'
import { useDisconnect } from 'wagmi'

export const Navbar = (props: FlexProps) => {
  const { sidebarDisclosure } = useDashboardContext()
  const [openWalletConnect, setOpenWalletConnect] = useState<boolean>(false)
  const NavIcon = sidebarDisclosure.isOpen ? RiCloseFill : RiMenuLine
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType>(
    NETWORK_DATA[0],
  )
  const { isConnected } = useConnect()
  const { data } = useAccount()
  const { disconnect } = useDisconnect()
  

  const handleNetworkSwitch = (newNetwork: NetworkType) => {
    setCurrentNetwork(newNetwork)
  }

  return (
    <>
      <Flex
        boxSize="full"
        align="center"
        gap="2.5"
        py="17px"
        px={{ md: '7', lg: '10' }}
        fontSize="sm"
        {...props}
      >
        <IconButton
          aria-label="Toggle Sidebar"
          variant="ghost"
          icon={<NavIcon />}
          fontSize="xl"
          size="sm"
          display={{ base: 'flex', lg: 'none' }}
          onClick={sidebarDisclosure.onToggle}
        />
        <Spacer />
        <IconButton
          aria-label="Notifications"
          variant="ghost"
          fontSize="2xl"
          icon={<RiNotificationLine />}
          size="sm"
        />
        <Divider orientation="vertical" />
        <Button size="sm" fontSize="sm" variant="outline" gap="2.5" px="2">
          <Icon as={RiGasStationLine} fontSize="xl" />
          33
        </Button>
        <LanguageSwitch display={{ base: 'none', md: 'inherit' }} />
        <Menu>
          <MenuButton
            as={Button}
            size="sm"
            fontWeight="400"
            variant="outline"
            leftIcon={<Icon as={currentNetwork.icon} fontSize="md" />}
            rightIcon={<FaChevronDown />}
          >
            <Text display={{ base: 'none', md: 'block' }} fontSize="sm">
              {currentNetwork.name}{' '}
            </Text>
          </MenuButton>
          <MenuList borderRadius="lg" w={250}>
            <MenuGroup fontSize="md" fontWeight="bold" title="Select Network ">
              {NETWORK_DATA.map((network, index) => (
                <Box px={3} key={index}>
                  <MenuItem
                    isDisabled={!network.isActive}
                    py={3}
                    my={3}
                    onClick={() => handleNetworkSwitch(network)}
                    rounded="lg"
                    border="solid 1px "
                    borderColor="divider"
                  >
                    <Icon mr={3} as={network.icon} fontSize="2xl" />
                    <Spacer />
                    <Text fontSize="sm" fontWeight="bold">
                      {network.name}
                    </Text>
                  </MenuItem>
                </Box>
              ))}
            </MenuGroup>
          </MenuList>
        </Menu>
        {!isConnected ? (
          <Button
            size="sm"
            onClick={() => setOpenWalletConnect(true)}
            fontSize="sm"
            px="4"
          >
            Connect Wallet
          </Button>
        ) : (
          <Menu>
            <MenuButton
              as={Button}
              size="md"
              fontWeight="400"
              variant="outline"
              leftIcon={<DisplayAvatar size={20} address={data?.address} />}
              rightIcon={<FaChevronDown />}
            >
              <Text display={{ base: 'none', md: 'block' }} fontSize="sm">
                {data?.address && shortenAccount(data.address)}
              </Text>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<RiFileCopyLine fontSize={20}/>} >
                <Text fontWeight="bold">
                  Copy Address
                </Text>
              </MenuItem>
              <MenuItem icon={<RiExternalLinkLine fontSize={20}/>}>
              <Text fontWeight="bold">
                  View on Etherscan 
                </Text>
              </MenuItem>
              <MenuItem onClick={()=>disconnect()} icon={<RiLogoutBoxLine fontSize={20}/>}>
                <Text fontWeight="bold">
                  Disconnect
                </Text>
              </MenuItem>
            </MenuList>
          </Menu>
        )}

        <ColorModeToggle display={{ base: 'none', md: 'inherit' }} />
      </Flex>
      <WalletConnect
        onClose={() => setOpenWalletConnect(false)}
        isOpen={openWalletConnect}
      />
    </>
  )
}
