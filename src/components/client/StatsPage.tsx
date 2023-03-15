'use client'

import { BraindaoLogo } from '@/components/braindao-logo'
import { useStatsData } from '@/utils/use-stats-data'
import {
  Divider,
  Flex,
  IconProps,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import * as Humanize from 'humanize-plus'
import { FraxFinance } from '@/components/icons/frax-finance'
import { PolygonFrax } from '@/components/icons/polygon-frax'
import { USDCIQ } from '@/components/icons/usdc-iq'
import { Twitter } from '@/components/icons/twitter'
import { Reddit } from '@/components/icons/reddit'
import { Ethereum } from '@/components/icons/ethereum'
import { Polygon } from '@/components/icons/polygon'
import { EOSLogo1 } from '@/components/icons/eos-logo-1'
import { Bsc } from '@/components/icons/bsc'
import { Dict } from '@chakra-ui/utils'
import { PageHeader } from '../dashboard/dashboardUtils'

type Stat = {
  label: string
  value?: number
  icon?: (props: IconProps) => JSX.Element
}

const showData = (value: Stat['value'], prefix?: string) => {
  return value !== undefined ? (
    // eslint-disable-next-line radix
    (prefix || '') + Humanize.formatNumber(value)
  ) : (
    <Spinner variant="primary" role="status" size="sm">
      <span>Loading...</span>
    </Spinner>
  )
}

const StatsPage = () => {
  const { data } = useStatsData()

  const generateArray = (prop: string) => [
    { label: 'Ethereum', value: data[prop]?.eth, icon: Ethereum },
    { label: 'EOS', value: data[prop]?.eos, icon: EOSLogo1 },
    { label: 'Polygon', value: data[prop]?.matic, icon: Polygon },
    { label: 'BSC', value: data[prop]?.bsc, icon: Bsc },
  ]

  const holders = generateArray('holders')
  const circulatingSupply = generateArray('volume')

  const hiiq = [
    {
      label: 'HiIQ Circulating Supply',
      value: data.hiiq?.volume,
      icon: BraindaoLogo,
    },
    { label: 'IQ Locked', value: data.hiiq?.locked, icon: BraindaoLogo },
    { label: 'HiIQ Holders', value: data.hiiq?.holders, icon: BraindaoLogo },
  ]

  const liquidity = [
    {
      label: 'LP liquidity Fraxswap',
      value: data.lp?.fraxSwap,
      icon: FraxFinance,
    },
    {
      label: 'LP liquidity QuickSwap USDC-IQ',
      value: data.lp?.quickSwap,
      icon: USDCIQ,
    },
    {
      label: 'LP liquidity FraxSwap Polygon',
      value: data.lp?.polygonSwap,
      icon: PolygonFrax,
    },
  ]
  const apps = [
    { label: 'IQ.Wiki articles', value: data.ep?.articles },
    { label: 'IQ.Wiki Onchain Edits', value: data.ep?.edits },
  ]

  const social = [
    {
      label: 'Twitter followers',
      value: data.social?.twitter,
      icon: Twitter,
    },
    { label: 'Reddit users', value: data.social?.reddit, icon: Reddit },
  ]

  const STATS: Record<string, { items: Stat[]; valuePrefix?: string }> = {
    Holders: { items: holders },
    'Circulating Supply': { items: circulatingSupply },
    HiIQ: { items: hiiq },
    'Onchain Liquidity': { items: liquidity, valuePrefix: '$' },
    Apps: { items: apps },
    Social: { items: social },
  } as const
  return (
    <>
      <Flex
        py={{ base: '5', lg: '6' }}
        direction="column"
        gap="6"
        mb={{ base: '20', md: '0' }}
      >
        <PageHeader
          headerText="IQ Stats"
          des="The numbers behind the IQ ecosystem."
        />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacingY="6" spacingX="30">
          {Object.entries(STATS).map(([group, val]) => (
            <Flex direction="column" key={group}>
              <Text color="brandText" fontSize="md" fontWeight="medium">
                {group}
              </Text>
              <Divider mt="1.5" mb="4" />
              <Stack spacing="6">
                {val.items.map((item, id) => (
                  <Flex key={id} align="center" gap="4">
                    {item.icon && (
                      <Flex alignItems="center" justifyContent="center">
                        <item.icon boxSize="6" />
                      </Flex>
                    )}
                    <Text
                      fontSize={{ base: 'sm', md: 'md' }}
                      fontWeight="medium"
                    >
                      {item.label}
                    </Text>
                    <Text
                      ml="auto"
                      fontSize={{ base: 'sm', md: 'md' }}
                      fontWeight="semibold"
                    >
                      {showData(item.value, val.valuePrefix)}
                    </Text>
                  </Flex>
                ))}
              </Stack>
            </Flex>
          ))}
        </SimpleGrid>
      </Flex>
    </>
  )
}

export default StatsPage
