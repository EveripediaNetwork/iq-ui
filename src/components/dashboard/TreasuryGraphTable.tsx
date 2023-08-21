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
  Tooltip,
  chakra,
} from '@chakra-ui/react'
import Link from '../elements/LinkElements/Link'
import React, { useCallback, useState, useEffect } from 'react'
import {
  SortAndSumTokensValue,
  calculateYield,
  getTreasuryDetails,
} from '@/utils/treasury-utils'

import { ChartDataType, OnPieEnter } from '@/types/chartType'
import Chart from '../elements/PieChart/Chart'
import { useLockOverview } from '@/hooks/useLockOverview'
import { useIQRate } from '@/hooks/useRate'
import config from '@/config'
import { ExternalLinkIcon } from '@chakra-ui/icons'

export const TreasuryGraphTable = ({
  setTreasuryValue,
  hasExternalLink,
}: {
  setTreasuryValue: (value: number) => void
  hasExternalLink?: boolean
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

  const onPieEnter = useCallback<OnPieEnter>(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )

  const boxSize = useBreakpointValue({
    base: { cx: 300, cy: 300 },
    md: { cx: 519, cy: 519 },
    lg: { cx: 500, cy: 450 },
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
    '2xl': { cx: 210, cy: 210 },
  })

  const formatPieData = (data: TreasuryTokenType[], platformValue: number) => {
    const result = data?.map(tok => ({
      name: TOKENS[tok.id].name,
      value: (tok.raw_dollar / platformValue) * 100,
      amount: tok.raw_dollar,
    }))
    setPieData(result)
  }

  useEffect(() => {
    const getTokens = async () => {
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
      const treasuryValuePlusYield = sortedTreasuryDetails.map(async token => ({
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
    }
    getTokens()
  }, [rate])

  return (
    <>
      <Flex gap="1">
        <Text fontWeight="bold" fontSize="2xl">
          Tokens (${formatValue(accountValue)})
        </Text>
        {hasExternalLink && (
          <Tooltip
            label="DeBank- View Treasury Portfolio"
            placement="right"
            hasArrow
            bg="black"
            color="white"
            p="12px"
            borderRadius="12px"
          >
            <chakra.span>
              <Link
                href="https://debank.com/profile/0x56398b89d53e8731bca8c1b06886cfb14bd6b654"
                isExternal
                color="fadedText4"
              >
                <ExternalLinkIcon
                  fontSize="16px"
                  w="18px"
                  h="18px"
                  fontWeight="light"
                  mx="2px"
                  mb="2"
                  cursor="pointer"
                />
              </Link>
            </chakra.span>
          </Tooltip>
        )}
      </Flex>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        my="8"
        gap={{ base: 10, '2xl': 18 }}
      >
        <Box overflowX="auto" maxH="550px">
          <TableContainer border="solid 1px" borderColor="divider" rounded="lg">
            <Table
              w={{
                base: 'full',
                lg: tokenData.length > 0 ? 'full' : 600,
                '2xl': 630,
              }}
            >
              <Thead border="none" bg="cardBg">
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
                        <Flex align="center" gap="18px">
                          {TOKENS[token.id].icon ? (
                            <Icon as={TOKENS[token.id].icon} boxSize={7} />
                          ) : (
                            <Image src={TOKENS[token.id].image} width="30px" />
                          )}
                          <Text fontSize="sm">{TOKENS[token.id].name}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        {typeof token.token === 'number'
                          ? Humanize.formatNumber(token.token, 2)
                          : token.token.map(t => (
                              <>
                                <span>{`${formatValue(t.amount)} ${
                                  t.symbol
                                }`}</span>
                                <br />
                              </>
                            ))}
                      </Td>
                      <Td textAlign="center">
                        {token.yield
                          ? `${Humanize.formatNumber(token.yield, 2)}%`
                          : '-'}
                      </Td>
                      <Td textAlign="center">
                        ${formatValue(token.raw_dollar)} (
                        {Humanize.formatNumber(
                          (token.raw_dollar / accountValue) * 100,
                          2,
                        )}
                        %)
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
        </Box>
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
          />
        </Box>
      </Flex>
    </>
  )
}
