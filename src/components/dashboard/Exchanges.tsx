import { logEvent } from '@/utils/googleAnalytics'
import { Divider, Flex, Text } from '@chakra-ui/layout'
import { IconButton } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import BinanceIcon from '../icons/binance'
import { OneInch } from '../icons/1inch'
import { Upbit } from '../icons/Upbit'
import { FraxFinance } from '../icons/frax-finance'
import ArrowIcon from '../icons/arrow'

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
      <Flex align={'center'} gap={2}>
        <Text color="brandText" fontSize="14px">
          Exchanges
        </Text>
        <ArrowIcon />
      </Flex>
      <Flex alignItems="center" justifyContent="center" mt={2}>
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
        <Link
          href="https://app.1inch.io/#/1/simple/swap/USDT/IQ"
          target="_blank"
          onClick={() =>
            logEvent({
              category: 'Home',
              action: 'Click',
              label: '1inch',
              value: 1,
            })
          }
        >
          <IconButton
            variant="outline"
            fontSize="xx-large"
            isRound
            border="none"
            icon={<OneInch w={'33px'} h={'33px'} />}
            aria-label="One Inch"
          />
        </Link>
        <Divider
          orientation="vertical"
          color={'gray.200'}
          _dark={{ color: 'whiteAlpha.400' }}
          mx={4}
        />
        <Link
          target="_blank"
          href="https://upbit.com/exchange?code=CRIX.UPBIT.KRW-IQ"
          onClick={() =>
            logEvent({
              category: 'Home',
              action: 'Click',
              label: 'upbit',
              value: 1,
            })
          }
        >
          <IconButton
            variant="outline"
            fontSize="xx-large"
            isRound
            border="none"
            icon={<Upbit w={'33px'} h={'33px'} />}
            aria-label="Upbit"
          />
        </Link>
        <Divider
          orientation="vertical"
          color={'gray.200'}
          _dark={{ color: 'whiteAlpha.400' }}
          mx={4}
        />
        <Link
          href="https://frax.finance/"
          target="_blank"
          onClick={() =>
            logEvent({
              category: 'Home',
              action: 'Click',
              label: 'Binance',
              value: 1,
            })
          }
        >
          <IconButton
            variant="outline"
            fontSize="xx-large"
            isRound
            border="none"
            icon={<FraxFinance w={'33px'} h={'33px'} />}
            aria-label="Frax"
          />
        </Link>
      </Flex>
    </Flex>
  )
}

export default Exchanges
