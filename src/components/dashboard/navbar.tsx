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
import React, { useEffect, useState, useRef, memo } from 'react'
import {
  RiCloseFill,
  RiGasStationLine,
  RiMenuLine,
  RiNotificationLine,
} from 'react-icons/ri'
import { FaChevronDown } from 'react-icons/fa'
import { useDashboardContext } from '@/components/dashboard/utils'
import { LanguageSwitch } from '@/components/dashboard/language-switch'
import { ColorModeToggle } from '@/components/dashboard/ColorModeToggle'
import { NETWORK_DATA } from '@/data/NetworkData'
import { NetworkType } from '@/types/NetworkType'
import { useAccount } from 'wagmi'
import { ethGasPrice } from '@/utils/dashboard-utils'
import { Dict } from '@chakra-ui/utils'
import WalletConnect from '../wallet/WalletConnect'
import ProfileSubMenu from './ProfileSubMenu'

const Navbar = (props: FlexProps) => {
  const { sidebarDisclosure } = useDashboardContext()
  const [openWalletConnect, setOpenWalletConnect] = useState<boolean>(false)
  const NavIcon = sidebarDisclosure.isOpen ? RiCloseFill : RiMenuLine
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType>(
    NETWORK_DATA[0],
  )
  const [ethGas, setEthGas] = useState<Dict | null>(null)
  const { isConnected } = useAccount()
  const isfetchedGas = useRef(false)

  const handleNetworkSwitch = (newNetwork: NetworkType) => {
    setCurrentNetwork(newNetwork)
  }

  useEffect(() => {
    if (!isfetchedGas.current) {
      isfetchedGas.current = true
      const fetchGasPrice = async () => {
        const data = await ethGasPrice()
        setEthGas(data)
      }
      fetchGasPrice()
    }
  }, [])

  return (
    <>
      <Flex
        boxSize="full"
        align="center"
        gap="2.5"
        py="17px"
        px={{ md: '7', lg: '4' }}
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
        <LanguageSwitch display={{ base: 'none', md: 'inherit' }} />
        <Button
          display={{ base: 'none', md: 'inherit' }}
          size="sm"
          fontSize="sm"
          fontWeight="medium"
          variant="outline"
          gap="2"
          px="2"
        >
          <Icon as={RiGasStationLine} fontSize="xl" />
          {ethGas?.speeds && ethGas.speeds[1].maxFeePerGas.toFixed(2)}
        </Button>
        <Menu>
          <MenuButton
            as={Button}
            size="sm"
            fontWeight="500"
            variant="outline"
            leftIcon={<Icon as={currentNetwork.icon} fontSize="md" />}
            rightIcon={<FaChevronDown />}
          >
            <Text
              display={{ base: 'none', md: 'block' }}
              fontSize="sm"
              fontWeight="medium"
            >
              {currentNetwork.name}{' '}
            </Text>
          </MenuButton>
          <MenuList borderRadius="lg" w={250}>
            <MenuGroup
              fontSize="md"
              fontWeight="medium"
              title="Select Network "
            >
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
                    <Text fontSize="sm" fontWeight="medium">
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
            fontWeight="medium"
          >
            Connect Wallet
          </Button>
        ) : (
          <ProfileSubMenu />
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

export default memo(Navbar)
