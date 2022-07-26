import { BraindaoLogo } from '@/components/braindao-logo'
import { DashboardLayout } from '@/components/dashboard/layout'
import { useStatsData } from '@/utils/use-stats-data'
import {
  Divider,
  Flex,
  Heading,
  IconProps,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React from 'react'
import * as Humanize from 'humanize-plus'

type Stat = {
  label: string
  value?: number
  icon?: (props: IconProps) => JSX.Element
}

const showData = (value: Stat['value'], prefix?: string) => {
  return value !== undefined ? (
    // eslint-disable-next-line radix
    (prefix || '') + Humanize.intComma(value)
  ) : (
    <Spinner animation="border" variant="primary" role="status" size="sm">
      <span>Loading...</span>
    </Spinner>
  )
}

const Stats: NextPage = () => {
  const { data } = useStatsData()
  const holders = [
    { label: 'EOS', value: data.holders?.eos },
    { label: 'Ethereum', value: data.holders?.eth },
    { label: 'Polygon', value: data.holders?.matic },
    { label: 'BSC', value: data.holders?.bsc },
  ]

  const circulatingSupply = [
    { label: 'EOS', value: data.volume?.eos },
    { label: 'Ethereum', value: data.volume?.eth },
    { label: 'Polygon', value: data.volume?.matic },
    { label: 'BSC', value: data.volume?.bsc },
  ]

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
    { label: 'LP liquidity Uniswap v2', value: data.lp?.uniswap },
    { label: 'LP liquidity SushiSwap', value: data.lp?.sushiswap },
    { label: 'LP liquidity QuickSwap', value: data.lp?.quickswap },
  ]
  const apps = [
    { label: 'PredIQt markets', value: data.prediqt?.markets },
    { label: 'Everipedia articles', value: data.ep?.articles },
    { label: 'Everipedia Onchain Edits', value: data.ep?.edits },
  ]

  const social = [
    { label: 'Reddit users', value: data.social?.reddit },
    { label: 'Twitter followers', value: data.social?.twitter },
  ]

  const STATS: Record<string, { items: Stat[]; valuePrefix?: string }> = {
    Holders: { items: holders },
    'Circulating Supply': { items: circulatingSupply },
    HiIQ: { items: hiiq },
    Liquidity: { items: liquidity, valuePrefix: '$' },
    Apps: { items: apps },
    Social: { items: social },
  } as const
  return (
    <DashboardLayout>
      <Flex direction="column" gap="6" pt="8">
        <Flex direction="column" gap="2">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            IQ Stats
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="fadedText">
            Stay on top of everything happening in the IQ world.
          </Text>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacingY="6" spacingX="30">
          {Object.entries(STATS).map(([group, val]) => (
            <Flex direction="column" key={group}>
              <Text color="brandText">{group}</Text>
              <Divider mt="1.5" mb="4" />
              <Stack spacing="6">
                {val.items.map((item, id) => (
                  <Flex key={id} align="center" gap="4">
                    {item.icon && <item.icon boxSize="6" />}
                    <Text fontSize={{ base: 'sm', md: 'md' }}>
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
    </DashboardLayout>
  )
}

export default Stats
