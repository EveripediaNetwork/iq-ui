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
  Image,
  Text,
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
import { useIQRate } from '@/hooks/useRate'
import config from '@/config'

export const TreasuryGraphTable = ({
  setTreasuryValue,
}: {
  setTreasuryValue: (value: number) => void
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const { userTotalIQLocked, totalHiiqSupply } = useLockOverview(
    config.treasuryHiIQAddress,
  )
  const { rate } = useIQRate()
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
    const { sortedTreasuryDetails, totalAccountValue } =
      await SortAndSumTokensValue(updatedTreasuryTokens)
    const treasuryValuePlusYield = sortedTreasuryDetails.map(async (token) => ({
      ...token,
      yield: await calculateYield(token, totalHiiqSupply),
    }))
    const resolvedTreasuryValuePlusYield = await Promise.all(
      treasuryValuePlusYield,
    )
    setAccountValue(totalAccountValue)
    setTreasuryValue(totalAccountValue)
    formatPieData(resolvedTreasuryValuePlusYield, totalAccountValue)
    setTokenData(resolvedTreasuryValuePlusYield)
    setTokenDataToShow(resolvedTreasuryValuePlusYield)
  }, [])

  useEffect(() => {
    if(!isTokenFetched.current) {
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
          >
            <Thead
              border="none"
              bg="cardBg"
              position="sticky"
              top={0}
              zIndex="docked"
            >
              {TOKEN_KEYS.map((key, i, arr) => (
                <Td
                  whiteSpace="nowrap"
                  key={key}
                  fontWeight="medium"
                  textAlign={i === arr.length - 1 ? 'center' : 'initial'}
                >
                  {key}
                </Td>
              ))}
            </Thead>
            {tokenDataToShow.length > 0
              ? tokenDataToShow.map((token, i) => (
                  <Tr key={i} fontWeight="medium">
                    <Td>
                      <Flex align="center" gap="4px">
                        {token?.logo ? (
                          <Image src={token.logo} boxSize={7} />
                        ) : TOKENS[token?.id]?.icon ? (
                          <Icon as={TOKENS[token.id].icon} boxSize={7} />
                        ) : (
                          <Image src={TOKENS[token?.id]?.image} width="30px" />
                        )}
                        <Text
                          noOfLines={2}
                          whiteSpace="normal"
                          maxW={20}
                          style={{ overflowWrap: 'normal' }}
                        >
                          {TOKENS[token?.id]?.name}
                        </Text>
                      </Flex>
                    </Td>
                    <Td>
                      {typeof token?.token === 'number'
                        ? Humanize.compactInteger(token.token, 1)
                        : token.token.map((t) => (
                            <>
                              <span>{`${formatValue(t?.amount)} ${
                                t?.symbol
                              }`}</span>
                              <br />
                            </>
                          ))}
                    </Td>
                    <Td textAlign="center">
                      {token?.yield
                        ? `${Humanize.formatNumber(token.yield, 2)}%`
                        : '-'}
                    </Td>
                    <Td textAlign="center">
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
                ))
              : [1, 2, 3, 4, 5, 6].map((_, index) => (
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
                    <Td textAlign="center">
                      <SkeletonText noOfLines={1} />
                    </Td>
                  </Tr>
                ))}
          </Table>
        </TableContainer>
        <Box
          display="flex"
          mt={{ lg: -2 }}
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
