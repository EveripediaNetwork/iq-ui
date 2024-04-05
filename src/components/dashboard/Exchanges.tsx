import { logEvent } from '@/utils/googleAnalytics'
import { Divider, Flex, Link as ChakraLink } from '@chakra-ui/layout'
import { IconButton } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import BinanceIcon from '../icons/binance'
import { OneInch } from '../icons/1inch'
import { Upbit } from '../icons/Upbit'
import ArrowIcon from '../icons/arrow'
import { Fraxswap } from '../icons/fraxswap'

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
      onClick={() =>
        logEvent({
          category: 'Dashboard',
          action: 'Click',
          label: `${logEventLabel}`,
          value: 1,
        })
      }
    >
      <IconButton
        variant="outline"
        fontSize="xx-large"
        isRound
        border="none"
        icon={icon}
        aria-label={ariaLabel}
      />
    </Link>
  )
}

const Exchanges = () => {
  return (
    <Flex
      direction={{ base: 'row', md: 'column' }}
      align={{ base: 'center', md: 'inherit' }}
      gap="14px"
      px="16px"
      py="14px"
      rounded="lg"
      border="solid 1px "
      borderColor="divider"
    >
      <Flex align={'center'} gap={2} role="group">
        <ChakraLink
          href="/dashboard/swap"
          color="brandText"
          fontSize="14px"
          _groupHover={{ textDecoration: 'underline' }}
        >
          Exchanges
        </ChakraLink>
        <ArrowIcon />
      </Flex>
      <Flex alignItems="center" justifyContent="center" mt={2}>
        <ExchangeLink
          href="https://frax.finance/"
          logEventLabel="Frax"
          icon={<Fraxswap w={'33px'} h={'33px'} />}
          ariaLabel="Frax"
        />
        <Divider
          orientation="vertical"
          color={'gray.200'}
          _dark={{ color: 'whiteAlpha.400' }}
          mx={4}
        />
        <ExchangeLink
          href="https://www.binance.com/en/trade/IQ_USDT?theme=dark&type=spot"
          logEventLabel="Binance"
          icon={<BinanceIcon w={'33px'} h={'33px'} />}
          ariaLabel="binance"
        />
        <Divider
          orientation="vertical"
          color={'gray.200'}
          _dark={{ color: 'whiteAlpha.400' }}
          mx={4}
        />
        <ExchangeLink
          href="https://app.1inch.io/#/1/simple/swap/USDT/IQ"
          logEventLabel="1inch"
          icon={<OneInch w={'33px'} h={'33px'} />}
          ariaLabel="One Inch"
        />
        <Divider
          orientation="vertical"
          color={'gray.200'}
          _dark={{ color: 'whiteAlpha.400' }}
          mx={4}
        />
        <ExchangeLink
          href="https://upbit.com/exchange?code=CRIX.UPBIT.KRW-IQ"
          logEventLabel="upbit"
          icon={<Upbit w={'33px'} h={'33px'} />}
          ariaLabel="Upbit"
        />
      </Flex>
    </Flex>
  )
}

export default Exchanges
