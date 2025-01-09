import { Divider, Flex, Link as ChakraLink, Text } from '@chakra-ui/layout'
import { IconButton } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import BinanceIcon from '../icons/binance'
import { OneInch } from '../icons/1inch'
import { Upbit } from '../icons/Upbit'
import ArrowIcon from '../icons/arrow'
import { Fraxswap } from '../icons/fraxswap'
import { useTranslations } from 'next-intl'

interface IconButtonProps {
  href: string
  logEventLabel: string
  icon: React.ReactElement
  ariaLabel: string
}

const ExchangeLink: React.FC<IconButtonProps> = ({
  href,
  logEventLabel,
  icon,
  ariaLabel,
}) => {
  return (
    <Link
      href={href}
      target="_blank"
      data-ph-capture-attribute-exchange_link_click={logEventLabel}
    >
      <IconButton
        variant="outline"
        fontSize="xx-large"
        isRound
        border="none"
        icon={icon}
        aria-label={ariaLabel}
        minW={0}
      />
    </Link>
  )
}

const Exchanges = () => {
  const t = useTranslations('tokenData')

  return (
    <Flex
      direction={{ base: 'row', md: 'column' }}
      align={{ base: 'center', md: 'inherit' }}
      gap="14px"
      px={{ base: '12px', md: '16px' }}
      py={'14px'}
      rounded="lg"
      border="solid 1px "
      borderColor="divider"
      justify={'space-between'}
    >
      <ChakraLink
        href="/dashboard/swap"
        display={'flex'}
        alignItems={'center'}
        gap={2}
        role="group"
      >
        <Text
          color="brandText"
          fontSize="14px"
          _groupHover={{ textDecoration: 'underline' }}
        >
          {t('exchanges')}
        </Text>
        <ArrowIcon />
      </ChakraLink>
      <Flex alignItems="center" justifyContent="center">
        <ExchangeLink
          href="https://app.frax.finance/staking/fraxswap-v2-frax-iq"
          logEventLabel="Frax"
          icon={
            <Fraxswap
              w={{ base: '24px', md: '33px' }}
              h={{ base: '24px', md: '33px' }}
            />
          }
          ariaLabel="Frax"
        />
        <Divider
          orientation="vertical"
          color={'gray.200'}
          _dark={{ color: 'whiteAlpha.400' }}
          mx={{ base: 3, md: 4, lg: 3, xl: 3, '2xl': 4 }}
          height={'40px'}
        />
        <ExchangeLink
          href="https://www.binance.com/en/trade/IQ_USDT?theme=dark&type=spot"
          logEventLabel="Binance"
          icon={
            <BinanceIcon
              w={{ base: '24px', md: '33px' }}
              h={{ base: '24px', md: '33px' }}
            />
          }
          ariaLabel="binance"
        />
        <Divider
          orientation="vertical"
          color={'gray.200'}
          _dark={{ color: 'whiteAlpha.400' }}
          mx={{ base: 3, md: 4, lg: 3, xl: 3, '2xl': 4 }}
          height={'40px'}
        />
        <ExchangeLink
          href="https://app.1inch.io/#/1/simple/swap/USDT/IQ"
          logEventLabel="1inch"
          icon={
            <OneInch
              w={{ base: '24px', md: '33px' }}
              h={{ base: '24px', md: '33px' }}
            />
          }
          ariaLabel="One Inch"
        />
        <Divider
          orientation="vertical"
          color={'gray.200'}
          _dark={{ color: 'whiteAlpha.400' }}
          mx={{ base: 3, md: 4, lg: 3, xl: 3, '2xl': 4 }}
          height={'40px'}
        />
        <ExchangeLink
          href="https://upbit.com/exchange?code=CRIX.UPBIT.KRW-IQ"
          logEventLabel="upbit"
          icon={
            <Upbit
              w={{ base: '24px', md: '33px' }}
              h={{ base: '24px', md: '33px' }}
            />
          }
          ariaLabel="Upbit"
        />
      </Flex>
    </Flex>
  )
}

export default Exchanges
