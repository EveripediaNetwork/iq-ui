import { BraindaoLogo } from '@/components/braindao-logo'
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
import { UniswapEllipse } from '@/components/icons/uniswap-ellipse'
import { Twitter } from '@/components/icons/twitter'
import { Reddit } from '@/components/icons/reddit'
import { Ethereum } from '@/components/icons/ethereum'
import { Polygon } from '@/components/icons/polygon'
import { EOSLogo1 } from '@/components/icons/eos-logo-1'
import { Bsc } from '@/components/icons/bsc'
import { NextSeo } from 'next-seo'

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
    <Spinner variant="primary" role="status" size="sm">
      <span>Loading...</span>
    </Spinner>
  )
}

const Stats: NextPage = () => {
  const { data } = useStatsData()
  const holders = [
    { label: 'Ethereum', value: data.holders?.eth, icon: Ethereum },
    { label: 'EOS', value: data.holders?.eos, icon: EOSLogo1 },
    { label: 'Polygon', value: data.holders?.matic, icon: Polygon },
    { label: 'BSC', value: data.holders?.bsc, icon: Bsc },
  ]

  const circulatingSupply = [
    { label: 'Ethereum', value: data.volume?.eth, icon: Ethereum },
    { label: 'EOS', value: data.volume?.eos, icon: EOSLogo1 },
    { label: 'Polygon', value: data.volume?.matic, icon: Polygon },
    { label: 'BSC', value: data.volume?.bsc, icon: Bsc },
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
    {
      label: 'LP liquidity Uniswap v2',
      value: data.lp?.fraxswap,
      icon: UniswapEllipse,
    },
    {
      label: 'LP liquidity SushiSwap',
      value: data.lp?.sushiswap,
      icon: UniswapEllipse,
    },
    { label: 'LP liquidity QuickSwap', value: data.lp?.quickswap },
  ]
  const apps = [
    { label: 'Everipedia articles', value: data.ep?.articles },
    { label: 'Everipedia Onchain Edits', value: data.ep?.edits },
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
      <NextSeo
        title="Stats Page"
        openGraph={{
          title: 'IQ Stats',
          description: 'Stay on top of everything happening in the IQ world.',
        }}
      />
      <Flex
        py={{ base: '5', lg: '6' }}
        direction="column"
        gap="6"
        mb={{ base: '20', md: '0' }}
      >
        <Flex direction="column" gap="1">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            IQ Stats
          </Heading>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="fadedText4"
            fontWeight="medium"
          >
            Stay on top of everything happening in the IQ world.
          </Text>
        </Flex>
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
                    {item.icon && <item.icon boxSize="6" />}
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

export default Stats
