import { TOKEN_KEYS, TOKENS, PIE_CHART_COLORS } from '@/data/treasury-data'
import { TreasuryTokenType } from '@/types/TreasuryTokenType'
import { formatValue } from '@/utils/LockOverviewUtils'
import * as Humanize from 'humanize-plus'
import {
  useBreakpointValue,
  TableContainer,
  Table,
  Thead,
  Td,
  Tr,
  Icon,
  SkeletonText,
  Box,
  useColorMode,
  Flex,
  Text,
  Th,
  Tbody,
} from '@chakra-ui/react'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import {
  SortAndSumTokensValue,
  calculateYield,
  getTreasuryDetails,
} from '@/utils/treasury-utils'
import PageHeader from './PageHeader'
import { ChartDataType, OnPieEnter } from '@/types/chartType'
import Chart from '../elements/PieChart/Chart'
import { useLockOverview } from '@/hooks/useLockOverview'
import { useGetIqPriceQuery } from '@/services/iqPrice'
import config from '@/config'
import Image from 'next/image'
import {
  useGetFraxETHSummaryQuery,
  useGetGraphDataQuery,
} from '@/services/treasury/restApi'

export const TreasuryGraphTable = ({
  setTreasuryValue,
}: {
  setTreasuryValue: (value: number) => void
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const { userTotalIQLocked, totalHiiqSupply } = useLockOverview(
    config.treasuryHiIQAddress,
  )

  const { data: fraxEthSummary } = useGetFraxETHSummaryQuery()
  const { data: fraxAprData } = useGetGraphDataQuery('frax_lending')

  const { data } = useGetIqPriceQuery('IQ')
  const rate = data?.response?.[0]?.quote?.USD?.price || 0.0
  const [tokenData, setTokenData] = useState<TreasuryTokenType[]>([])
  const [tokenDataToShow, setTokenDataToShow] = useState<TreasuryTokenType[]>(
    [],
  )
  const [pieData, setPieData] = useState<ChartDataType[]>([])
  const [accountValue, setAccountValue] = useState<number>(0)
  const { colorMode } = useColorMode()
  const isTokenFetched = useRef(false)

  const onPieEnter = useCallback<OnPieEnter>(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )

  const boxSize = useBreakpointValue({
    base: { cx: 300, cy: 300 },
    md: { cx: 519, cy: 519 },
    lg: { cx: 460, cy: 450 },
    '2xl': { cx: 380, cy: 400 },
  })

  const radius = useBreakpointValue({
    base: { cx: 100, cy: 140 },
    md: { cx: 120, cy: 210 },
    lg: { cx: 120, cy: 190 },
    '2xl': { cx: 100, cy: 150 },
  })
  const spacing = useBreakpointValue({
    base: { cx: 150, cy: 140 },
    md: { cx: 230, cy: 240 },
    lg: { cx: 250, cy: 210 },
    '2xl': { cx: 200, cy: 210 },
  })

  const formatPieData = (data: TreasuryTokenType[], platformValue: number) => {
    const result = data?.map((tok) => ({
      name: TOKENS[tok?.id]?.name,
      value: (tok?.raw_dollar / platformValue) * 100,
      amount: tok?.raw_dollar,
    }))
    setPieData(result)
  }

  const getTokens = useCallback(async () => {
    const treasuryTokens = await getTreasuryDetails()
    const updatedTreasuryTokens = [
      ...treasuryTokens,
      {
        id: 'HiIQ',
        token: userTotalIQLocked,
        raw_dollar: userTotalIQLocked * rate,
        contractAddress: config.treasuryHiIQAddress,
      },
    ]
    const { sortedTreasuryDetails, totalAccountValue } = SortAndSumTokensValue(
      updatedTreasuryTokens,
    )
    const treasuryValuePlusYield = sortedTreasuryDetails.map((token) => ({
      ...token,
      yield: calculateYield(
        token,
        totalHiiqSupply,
        fraxAprData,
        fraxEthSummary,
      ),
    }))

    setAccountValue(totalAccountValue)
    setTreasuryValue(totalAccountValue)
    formatPieData(treasuryValuePlusYield, totalAccountValue)
    setTokenData(treasuryValuePlusYield)
    setTokenDataToShow(treasuryValuePlusYield)
  }, [])

  useEffect(() => {
    if (!isTokenFetched.current) {
      isTokenFetched.current = true
      getTokens()
    }
  }, [rate])

  return (
    <>
      <PageHeader
        header={`Tokens ($${formatValue(accountValue)})`}
        externalLink="https://debank.com/profile/0x56398b89d53e8731bca8c1b06886cfb14bd6b654"
        tooltipLabel="DeBank- View Treasury Portfolio"
      />
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        mt="4"
        mb="16"
        gap={{ base: 2, '2xl': 16 }}
      >
        <TableContainer
          border="solid 1px"
          borderColor="divider"
          rounded="lg"
          fontSize="sm"
          overflowY="scroll"
          maxH="550px"
        >
          <Table
            w={{
              base: 'full',
              lg: tokenData.length > 0 ? 'full' : 600,
              '2xl': 630,
            }}
            layout="auto"
          >
            <Thead
              border="none"
              bg="cardBg"
              position="sticky"
              top={0}
              zIndex="docked"
            >
              <Tr>
                {TOKEN_KEYS.map((key, i, arr) => (
                  <Th
                    whiteSpace="nowrap"
                    key={key}
                    fontWeight="medium"
                    textAlign={i === arr.length - 1 ? 'center' : 'initial'}
                    fontSize={{ base: '10' }}           
                  >
                    {key}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {tokenDataToShow.length > 0
                ? tokenDataToShow.map((token, i) => {
                    return (
                      <Tr key={`${token?.id}-${i}`} fontWeight="medium">
                        <Td fontSize={{ base: '8', md: 'sm' }}>
                          <Flex align="center" minW={'max-content'} gap="4px">
                            {TOKENS[token?.id]?.icon ? (
                              <Icon as={TOKENS[token.id].icon} boxSize={7} />
                            ) : TOKENS[token?.id]?.image ? (
                              <Image
                                src={TOKENS[token.id].image as string}
                                alt="token image"
                                width={30}
                                height={30}
                              />
                            ) : token?.logo ? (
                              <Image
                                src={token?.logo}
                                width={30}
                                height={30}
                                alt="token logo"
                              />
                            ) : (
                              <Image
                                src="/images/tokens/unknown-logo.png"
                                width={30}
                                height={30}
                                alt="token logo"
                              />
                            )}
                            <Text noOfLines={1} whiteSpace="normal">
                              {TOKENS[token?.id]?.name ?? token?.id}
                            </Text>
                          </Flex>
                        </Td>
                        <Td  fontSize={{ base: '8', md: 'sm' }}>
                          {typeof token?.token === 'number'
                            ? Humanize.compactInteger(token.token, 1)
                            : token.token.map((t) => (
                                <div key={t.symbol}>
                                  <span>{`${formatValue(t?.amount)} ${
                                    t?.symbol
                                  }`}</span>
                                  <br />
                                </div>
                              ))}
                        </Td>
                        <Td textAlign="center"  fontSize={{ base: '8', md: 'sm' }}>
                          {`$${formatValue(token?.raw_dollar)} `}
                          <span style={{ fontSize: 'smaller' }}>
                            (
                            {Humanize.formatNumber(
                              (token?.raw_dollar / accountValue) * 100,
                              2,
                            )}
                            %)
                          </span>
                        </Td>
                      </Tr>
                    )
                  })
                : [1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                    <Tr key={index} fontWeight="medium">
                      <Td>
                        <SkeletonText noOfLines={1} />
                      </Td>
                      <Td>
                        <SkeletonText noOfLines={1} />
                      </Td>
                      <Td textAlign="center">
                        <SkeletonText noOfLines={1} />
                      </Td>
                    </Tr>
                  ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Box
          display="flex"
          mt={{ base: 6, lg: -2 }}
          justifyContent="center"
          alignItems="center"
          pl={{ md: 10, lg: 0 }}
        >
          <Chart
            boxSize={boxSize}
            spacing={spacing}
            onPieEnter={onPieEnter}
            radius={radius}
            chartData={pieData}
            activeIndex={activeIndex}
            colorMode={colorMode}
            CHART_COLORS={PIE_CHART_COLORS}
            isTreasuryPage={true}
          />
        </Box>
      </Flex>
    </>
  )
}
