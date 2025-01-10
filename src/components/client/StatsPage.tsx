'use client'

import { IQLogo } from '@/components/iq-logo'
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
import { useTranslations } from 'next-intl'

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

  const t = useTranslations('stats')

  const generateArray = (prop: string): Stat[] => [
    {
      label: 'HiIQ',
      value: data[prop]?.hiiq,
      icon: IQLogo,
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
      t('labels.lpLiquidityFraxswap'),
      t('labels.lpLiquiditySushiswap'),
      t('labels.lpLiquidityFraxSwapPolygon'),
      t('labels.lpLiquidityQuickSwap'),
    ],
    'lp',
    ['fraxSwap', 'sushiSwap', 'polygonSwap', 'quickSwap'],
    [Fraxswap, SushiSwap, PolygonFrax, USDCIQ],
  )

  const IQ = generateArray2(
    [t('labels.iqMarketCap'), t('labels.iqLocked'), t('labels.iqVolume')],
    'Iq',
    ['mcap', 'locked', 'volume'],
    [IQLogo, IQLogo, IQLogo],
  )

  const apps = [
    { label: t('labels.iqWikiArticles'), value: data.ep?.articles },
    { label: t('labels.iqWikiEdits'), value: data.ep?.edits },
  ]

  const social: Stat[] = [
    {
      label: t('labels.twitterFollowers'),
      value: data.social?.twitter,
      icon: Twitter,
    },
    {
      label: t('labels.redditUsers'),
      value: data.social?.reddit,
      icon: Reddit,
    },
  ]

  const STATS: Record<
    string,
    { items: Stat[]; valuePrefix?: string; omitPrefix?: string }
  > = {
    iq: { items: IQ, valuePrefix: '$', omitPrefix: 'IQ Locked' },
    onchainLiquidity: { items: liquidity, valuePrefix: '$' },
    circulatingSupply: { items: circulatingSupply },
    holders: { items: holders },
    apps: { items: apps },
    social: { items: social },
  } as const
  return (
    <>
      <Flex
        py={{ base: '5', lg: '6' }}
        direction="column"
        gap="6"
        mb={{ base: '20', md: '0' }}
      >
        <PageHeader header={t('header')} body={t('description')} />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacingY="6" spacingX="30">
          {Object.entries(STATS).map(([group, val]) => {
            return (
              <Flex direction="column" key={group}>
                <Text color="brandText" fontSize="md" fontWeight="medium">
                  {t(`categories.${group}`)}
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
                          {isFailedToFetchData
                            ? '-'
                            : showData(item.value, valuePrefix)}
                        </Text>
                      </Flex>
                    )
                  })}
                </Stack>
              </Flex>
            )
          })}
        </SimpleGrid>
      </Flex>
    </>
  )
}

export default StatsPage
