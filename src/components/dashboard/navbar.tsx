import {
  Button,
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
  Spinner,
} from '@chakra-ui/react'
import React, { useState, memo } from 'react'
import { RiCloseFill, RiGasStationLine, RiMenuLine } from 'react-icons/ri'
import { FaChevronDown } from 'react-icons/fa'
import { useDashboardContext } from '@/components/dashboard/utils'
import { LanguageSwitch } from '@/components/dashboard/language-switch'
import { ColorModeToggle } from '@/components/dashboard/ColorModeToggle'
import { NETWORK_DATA } from '@/data/NetworkData'
import { NetworkType } from '@/types/NetworkType'
import { useAccount } from 'wagmi'
import { useGetGasPriceQuery } from '@/services/gasPrice'
import WalletConnect from '../wallet/WalletConnect'
import ProfileSubMenu from './ProfileSubMenu'
import { IQButton } from './IQButton'
import { useTranslations } from 'next-intl'

const Navbar = (props: FlexProps) => {
  const { sidebarDisclosure } = useDashboardContext()
  const [openWalletConnect, setOpenWalletConnect] = useState<boolean>(false)
  const NavIcon = sidebarDisclosure.isOpen ? RiCloseFill : RiMenuLine
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType>(
    NETWORK_DATA[0],
  )
  const { isConnected } = useAccount()
  const t = useTranslations('navbar')

  const handleNetworkSwitch = (newNetwork: NetworkType) => {
    setCurrentNetwork(newNetwork)
  }

  const { data, isLoading, error } = useGetGasPriceQuery()
  const gasPrice = data?.response

  return (
    <>
      <Flex
        boxSize="full"
        align="center"
        gap={{ base: 1, sm: 2.5 }}
        py="17px"
        px={{ lg: '4' }}
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
        <Box display="inherit" fontSize="sm" fontWeight="medium" gap="2" px="2">
          <Icon as={RiGasStationLine} fontSize="xl" />
          {error && (
            <Box fontSize={{ base: 'xs', md: 'inherit' }}>{t('error')}</Box>
          )}
          {isLoading && <Spinner size="xs" color="brandText" />}
          {gasPrice && (
            <Box fontSize={{ base: 'xs', md: 'inherit' }}>{gasPrice}</Box>
          )}
        </Box>
        <IQButton display={{ base: 'none', md: 'inherit' }} />
        <LanguageSwitch display={{ base: 'none', md: 'inherit' }} />
        <Menu offset={[110, 30]}>
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
          <MenuList borderRadius="lg" w={250} boxShadow="2xl">
            <MenuGroup
              fontSize="md"
              fontWeight="medium"
              title={t('selectNetwork')}
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
            {t('connectWallet')}
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
