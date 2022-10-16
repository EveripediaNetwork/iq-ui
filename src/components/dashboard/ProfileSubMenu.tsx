import React, { useEffect, useState } from 'react'
import {
  Button,
  Divider,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  chakra,
  IconProps,
  useClipboard,
  FlexProps,
  ComponentWithAs,
  Icon,
} from '@chakra-ui/react'
import {
  RiLogoutBoxLine,
  RiExternalLinkLine,
  RiFileCopyLine,
} from 'react-icons/ri'
import shortenAccount from '@/utils/shortenAccount'
import DisplayAvatar from '@/components/elements/Avatar/Avatar'
import { useAccount, useDisconnect } from 'wagmi'
import { FaChevronDown } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'
import { BraindaoLogo } from '@/components/braindao-logo'
import { useFetchWalletBalance } from '@/components/wallet/use-fetch-wallet-balance'
import { fetchRateAndCalculateTotalBalance } from '@/utils/fetch-wallet-balance'
import {
  getTokenValue,
  useHiIQBalance,
} from '@/components/wallet/use-hiiiq-balance'
import { TokenDetailsType } from '@/components/wallet/types'
import { tokenDetails } from '@/components/wallet/wallet-data'
import { shortenBalance } from '@/utils/dashboard-utils'
import { CheckIcon } from '@chakra-ui/icons'

type SubMenuItemProps = {
  label: string
  action?: () => void
  icon: IconType | ComponentWithAs<'svg'>
} & FlexProps

const SubMenuItem = (props: SubMenuItemProps) => {
  const { icon, label, action, ...rest } = props
  return (
    <Flex
      align="center"
      color="fadedText4"
      onClick={action}
      px="6"
      py="2.5"
      gap="2"
      cursor="pointer"
      {...rest}
    >
      <Icon as={icon} boxSize="6" />
      <Text fontWeight="bold">{label}</Text>
    </Flex>
  )
}

type TokenItemProps = {
  symbol?: string
  icon: (props: IconProps) => JSX.Element
  amount: number
  tokensArray: TokenDetailsType[] | null
}

const TokenItem = (props: TokenItemProps) => {
  const { icon, symbol, amount, tokensArray } = props
  if (!tokensArray) return null
  return (
    <Flex align="center" px="13px" py="3.5" gap="2.5" w="full">
      <Icon as={icon} boxSize="6" />
      <Text fontWeight="bold">{symbol}</Text>
      <Flex
        ml="auto"
        direction="column"
        align="space-between"
        textAlign="right"
      >
        <Text fontWeight="bold">{shortenBalance(amount)}</Text>
        <Text fontWeight="bold" fontSize="sm" color="fadedText5">
          ${shortenBalance(getTokenValue(tokensArray, symbol))}
        </Text>
      </Flex>
    </Flex>
  )
}

const ProfileSubMenu = () => {
  const { address, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const logout = () => {
    disconnect()
  }

  const { userBalance } = useFetchWalletBalance(address)

  const [balanceBreakdown, setBalanceBreakdown] = useState<
    TokenDetailsType[] | null
  >(null)

  const { hiiq } = useHiIQBalance(address)

  const hiIQData = {
    formatted: `${hiiq?.hiiqBalance}`,
    symbol: `${hiiq?.symbol}`,
    tokensArray: { price: hiiq?.totalUsdBalance ?? 0, token: 'HiIQ' },
  }

  useEffect(() => {
    if (userBalance) {
      fetchRateAndCalculateTotalBalance(userBalance).then(result => {
        setBalanceBreakdown(result)
      })
    }
  }, [userBalance])

  const { hasCopied, onCopy: copyAddress } = useClipboard(address as string)

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button
          size="md"
          fontWeight="500"
          variant="outline"
          leftIcon={
            <DisplayAvatar
              svgProps={{ rounded: 'full' }}
              size={20}
              address={address}
            />
          }
          rightIcon={<FaChevronDown />}
        >
          <Text fontSize="sm" fontWeight="medium">
            {address && shortenAccount(address)}
          </Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        pt="5"
        pb="6"
        bg="bodyBg"
        w="355px"
        mr={{ md: '13', lg: '16' }}
        boxShadow="2xl"
      >
        <chakra.div mx="6">
          <Text fontWeight="bold">My Wallet</Text>
          <Flex mt="3" align="center" gap="2.5">
            <chakra.div pos="relative">
              <DisplayAvatar
                svgProps={{ rounded: 'full' }}
                size={40}
                address={address}
              />
              <chakra.div
                boxSize="4"
                bg="green.500"
                pos="absolute"
                bottom="-1"
                rounded="full"
                right="1"
                border="solid 4px"
                borderColor="bodyBg"
              />
            </chakra.div>
            <Flex direction="column" align="space-between">
              <Text fontWeight="bold" maxW="110px" noOfLines={1}>
                {address}
              </Text>
              <Text color="dimmedText" fontWeight="semibold">
                {connector?.name}
              </Text>
            </Flex>
          </Flex>
          <Flex mb="9" mt="4.5" rounded="md" bg="lightCard" direction="column">
            {balanceBreakdown &&
              userBalance &&
              userBalance.length !== 0 &&
              userBalance?.map((details, key) => {
                if (!details?.data?.symbol) return null
                return (
                  <TokenItem
                    key={key}
                    symbol={details?.data?.symbol}
                    icon={tokenDetails[details?.data?.symbol]?.logo}
                    amount={Number(details?.data?.formatted)}
                    tokensArray={balanceBreakdown}
                  />
                )
              })}

            {hiiq && userBalance && userBalance.length !== 0 && (
              <TokenItem
                symbol={hiIQData?.symbol}
                icon={BraindaoLogo}
                amount={Number(hiiq?.hiiqBalance)}
                tokensArray={[hiIQData?.tokensArray]}
              />
            )}
          </Flex>
        </chakra.div>
        <Divider mb="6" />
        <SubMenuItem
          label="Copy Address"
          action={copyAddress}
          icon={RiFileCopyLine}
          {...(hasCopied && {
            color: 'green',
            icon: CheckIcon,
          })}
        />
        <SubMenuItem
          label="View on Etherscan"
          action={() =>
            window.open(`https://etherscan.io/address/${address}`, '_blank')
          }
          icon={RiExternalLinkLine}
        />
        <SubMenuItem
          label="Disconnect"
          action={logout}
          icon={RiLogoutBoxLine}
        />
      </PopoverContent>
    </Popover>
  )
}

export default React.memo(ProfileSubMenu)
