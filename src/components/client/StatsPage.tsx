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
import { PolygonFrax } from '@/components/icons/polygon-frax'
import { USDCIQ } from '@/components/icons/usdc-iq'
import { Twitter } from '@/components/icons/twitter'
import { Reddit } from '@/components/icons/reddit'
import { Ethereum } from '@/components/icons/ethereum'
import { Polygon } from '@/components/icons/polygon'
import { EOSLogo1 } from '@/components/icons/eos-logo-1'
import { Bsc } from '@/components/icons/bsc'
import { SushiSwap } from '../icons/sushiswap'
import PageHeader from '../dashboard/PageHeader'
import { Fraxswap } from '../icons/fraxswap'

type Stat = {
  label: string
  value?: number
  icon?: (props: IconProps) => JSX.Element
}

const ShowData = ({
  value,
  prefix,
  isFetched,
}: {
  value: number | undefined
  prefix?: string
  isFetched?: boolean
}) => {
  if (value === undefined && !isFetched) {
    return (
      <Spinner variant="primary" role="status" size="sm">
        <span>Loading...</span>
      </Spinner>
    )
  }
  return value ? (prefix || '') + Humanize.formatNumber(value) : '-'
}

const StatsPage = () => {
  const { data, isFetched } = useStatsData()

  const generateArray = (prop: string) => [
    {
      label: 'HiIQ',
      value: data[prop]?.hiiq,
      icon: BraindaoLogo,
    },
    { label: 'Ethereum', value: data[prop]?.eth, icon: Ethereum },
    { label: 'EOS', value: data[prop]?.eos, icon: EOSLogo1 },
    { label: 'Polygon', value: data[prop]?.matic, icon: Polygon },
    { label: 'BSC', value: data[prop]?.bsc, icon: Bsc },
  ]

  const holders = generateArray('holders')
  const circulatingSupply = generateArray('volume')

  const generateArray2 = (
    label: string[],
    prop: string,
    valueProp: string[],
    icons: Array<(props: IconProps) => JSX.Element>,
  ) =>
    label?.map((l, index) => ({
      label: l,
      value: data[prop]?.[`${valueProp[index]}`],
      icon: icons[index],
    }))

  const liquidity = generateArray2(
    [
      'LP liquidity Fraxswap',
      'LP Liquidity Sushiswap',
      'LP liquidity FraxSwap Polygon',
      'LP liquidity QuickSwap USDC-IQ',
    ],
    'lp',
    ['fraxSwap', 'sushiSwap', 'polygonSwap', 'quickSwap'],
    [Fraxswap, SushiSwap, PolygonFrax, USDCIQ],
  )

  const IQ = generateArray2(
    ['IQ Market Cap', 'IQ Locked', 'IQ Volume (24h)'],
    'Iq',
    ['mcap', 'locked', 'volume'],
    [BraindaoLogo, BraindaoLogo, BraindaoLogo],
  )

  const apps = [
    { label: 'IQ.wiki Articles', value: data.ep?.articles },
    { label: 'IQ.wiki Onchain Edits', value: data.ep?.edits },
  ]

  const social = [
    {
      label: 'Twitter Followers',
      value: data.social?.twitter,
      icon: Twitter,
    },
    { label: 'Reddit Users', value: data.social?.reddit, icon: Reddit },
  ]

  const STATS: Record<
    string,
    { items: Stat[]; valuePrefix?: string; omitPrefix?: string }
  > = {
    IQ: { items: IQ, valuePrefix: '$', omitPrefix: 'IQ Locked' },
    'Onchain Liquidity': { items: liquidity, valuePrefix: '$' },
    'Circulating Supply': { items: circulatingSupply },
    Holders: { items: holders },
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
          header="IQ Stats"
          body="The numbers behind the IQ ecosystem."
        />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacingY="6" spacingX="30">
          {Object.entries(STATS).map(([group, val]) => {
            return (
              <Flex direction="column" key={group}>
                <Text color="brandText" fontSize="md" fontWeight="medium">
                  {group}
                </Text>
                <Divider mt="1.5" mb="4" />
                <Stack spacing="6">
                  {val.items.map((item, id) => {
                    let valuePrefix
                    if (item.label !== val.omitPrefix) {
                      valuePrefix = val.valuePrefix
                    }

                    const isFailedToFetchData = item.value === 0
                    return (
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
                          {isFailedToFetchData ? (
                            '-'
                          ) : (
                            <ShowData
                              value={item.value || 0}
                              prefix={valuePrefix}
                              isFetched={isFetched}
                            />
                          )}
                        </Text>
                      </Flex>
                    )
                  })}
                </Stack>{' '}
              </Flex>
            )
          })}
        </SimpleGrid>
      </Flex>
    </>
  )
}

export default StatsPage
