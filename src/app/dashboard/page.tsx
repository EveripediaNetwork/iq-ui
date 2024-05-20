'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import type { NextPage } from 'next'
import {
  Flex,
  Heading,
  Stack,
  Text,
  useRadioGroup
} from '@chakra-ui/react'
import { useGetIqPriceQuery } from '@/services/iqPrice' // note
import { BraindaoLogo3 } from '@/components/braindao-logo-3'
import { Dict } from '@chakra-ui/utils'
import {
  GraphPeriod,
  StakeGraphPeriod,
} from '@/data/dashboard-data'
import {
  SortAndSumTokensValue,
  getTreasuryDetails,
} from '@/utils/treasury-utils'
import {
  fetchTokenData,
  fetchPrices,
  getDateRange,
  renderPercentChange,
  sanitizePrices,
} from '@/utils/dashboard-utils'
import { useLockOverview } from '@/hooks/useLockOverview'
import Link from '@/components/elements/LinkElements/Link'
import TokenData from '@/components/dashboard/TokenData'
import config from '@/config'
import { useGetStakeValueQuery } from '@/services/stake'
import { useGetTreasuryValueQuery } from '@/services/treasury'
import { DashboardGraphData } from '@/components/dashboard/GraphDetails'

const Home: NextPage = () => {
  const [treasuryValue, setTreasuryValue] = useState<number>()
  const [prices, setPrices] = useState<Dict<Dict<number>[]> | null>(null)
  const [marketData, setMarketData] = useState<Dict | null>(null)
  // const [holders, setHolders] = useState<ChartDataType[]>([])
  // const [colorData, setColorData] = useState<ChartConstantNonTreasury>({})
  // const [activeIndex, setActiveIndex] = useState(0)

  const { value, getRadioProps } = useRadioGroup({
    defaultValue: GraphPeriod.MONTH,
  })

  const {
    value: stakeValue,
    getRadioProps: getStakeRadioProps,
    getRootProps: getStakeRootProps,
  } = useRadioGroup({
    defaultValue: StakeGraphPeriod['30DAYS'],
  })

  // start
  const { startDate, endDate } = getDateRange(stakeValue as string)

  const { data: treasuryData } = useGetTreasuryValueQuery({
    startDate,
    endDate,
  })

  const { data: stakeData } = useGetStakeValueQuery({
    startDate,
    endDate,
  })

  const treasuryGraphData = treasuryData?.map((dt) => ({
    amt: parseFloat(dt.totalValue),
    name: new Date(dt.created).toISOString().slice(0, 10),
  }))

  const { userTotalIQLocked } = useLockOverview(
    config.treasuryHiIQAddress,
  )

  

  const { data: iqData } = useGetIqPriceQuery('IQ')
  const rate = iqData?.response?.data?.[0]?.quote?.USD?.price || 0.0

  const priceChange = {
    [GraphPeriod.DAY]: marketData?.percent_change_24h,
    [GraphPeriod.WEEK]: marketData?.percent_change_7d,
    [GraphPeriod.MONTH]: marketData?.percent_change_30d,
    [GraphPeriod.YEAR]: marketData?.percent_change_1y,
  }

  const percentChange = priceChange?.[value as GraphPeriod]
  const isFetchedData = useRef(false)


  // const { getRadioProps: getTokenRadioProps, getRootProps: getTokenRootProps } =
  //   useRadioGroup({
  //     defaultValue: StakeGraphPeriod['30DAYS'],
  //   })

  if (treasuryValue && treasuryGraphData) {
    treasuryGraphData[treasuryGraphData.length - 1] = {
      amt: treasuryValue,
      name: treasuryGraphData[treasuryGraphData.length - 1]?.name,
    }
  }

  // Fetches treasury value from the treasury details
  
  // const getTreasuryValue = useCallback(async () => {
  //   const treasuryTokens = await getTreasuryDetails()
  //   const updatedTreasuryTokens = [
  //     ...treasuryTokens,
  //     {
  //       id: 'HiIQ',
  //       token: userTotalIQLocked,
  //       raw_dollar: userTotalIQLocked * rate,
  //       contractAddress: config.treasuryHiIQAddress,
  //     },
  //   ]

  //   const { totalAccountValue } = await SortAndSumTokensValue(
  //     updatedTreasuryTokens,
  //   )
  //   setTreasuryValue(totalAccountValue)
  // }, [])

  // useEffect(() => {
  //   if (!isTokenFetched.current) {
  //     isTokenFetched.current = true
  //     getTreasuryValue()
  //   }
  // }, [rate])

  
  const isTokenFetched = useRef(false)

  useEffect(() => {
    if (!isFetchedData.current) {
      isFetchedData.current = true
      const prices = fetchPrices()
      const IQTokenData = fetchTokenData('IQ')
      Promise.resolve(prices).then(([day, week, month, year]) => {
        setPrices({
          [GraphPeriod.DAY]: sanitizePrices(day.prices),
          [GraphPeriod.WEEK]: sanitizePrices(week.prices),
          [GraphPeriod.MONTH]: sanitizePrices(month.prices),
          [GraphPeriod.YEAR]: sanitizePrices(year.prices),
        })
      })

      Promise.resolve(IQTokenData).then((data) => {
        setMarketData(data)
      })
    }
  }, [])

  const renderIQPercentChange = () => {
    return renderPercentChange(percentChange)?.[0]
  }

  return (
    <Stack
      h="full"
      mb="4.375em"
      py={{ base: '5', lg: '6' }}
      spacing={{ base: 7, md: 5, lg: 6 }}
    > 

   
      <Flex
        gap={{ lg: '15' }}
        p={{ base: 4, md: 7 }}
        bg="cardBg"
        border="solid 1px"
        borderColor="divider"
        h="fit-content"
        rounded="lg"
        align={{ base: 'start', lg: 'center' }}
        direction={{ base: 'column', lg: 'row' }}
      >
        <Stack order={{ base: 1, lg: 0 }}>
          <Heading
            textAlign={{ base: 'center', lg: 'left' }}
            fontSize={{ base: 'xl', lg: '2xl' }}
          >
            Welcome to the IQ Dashboard
          </Heading>
          <Text
            textAlign={{ base: 'center', lg: 'left' }}
            fontSize={{ base: 'sm', lg: 'md' }}
            fontWeight="medium"
          >
            The{' '}
            <Link href="https://iq.wiki/wiki/iq" isExternal>
              IQ token
            </Link>{' '}
            is a multichain token that powers the BrainDAO ecosystem of dapps.
            You can stake your tokens, bridge them across blockchains, vote on
            governance proposals, and more all through the IQ Dashboard.
          </Text>
        </Stack>

        <BraindaoLogo3
          mx={{ base: 'auto', lg: 'none' }}
          h={{ base: '72px', lg: '8.125em' }}
          w={{ base: '72px', lg: '154px' }}
        />
      </Flex>
      
      
      <TokenData marketData={marketData} />

      <DashboardGraphData/>

    </Stack>
  )
}
export default Home
