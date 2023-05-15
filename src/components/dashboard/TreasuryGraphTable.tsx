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
  Button,
  Spacer,
  TableCaption,
} from '@chakra-ui/react'
import React, { useCallback, useState, useEffect } from 'react'
import { getCurrentPageData, getTreasuryDetails } from '@/utils/treasury-utils'
import { ChartDataType, OnPieEnter } from '@/types/chartType'
import Chart from '../elements/PieChart/Chart'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const DATA_SIZE_PER_PAGE = 6
export const TreasuryGraphTable = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [tokenData, setTokenData] = useState<TreasuryTokenType[]>([])
  const [tokenDataToShow, setTokenDataToShow] = useState<TreasuryTokenType[]>(
    [],
  )
  const [pieData, setPieData] = useState<ChartDataType[]>([])
  const [accountValue, setAccountValue] = useState<number>(0)
  const { colorMode } = useColorMode()
  const [currentPage, setCurrentPage] = useState(1)

  const onPieEnter = useCallback<OnPieEnter>(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )

  const boxSize = useBreakpointValue({
    base: { cx: 429, cy: 429 },
    md: { cx: 519, cy: 519 },
    lg: { cx: 500, cy: 450 },
    '2xl': { cx: 380, cy: 400 },
  })

  const radius = useBreakpointValue({
    base: { cx: 80, cy: 130 },
    md: { cx: 110, cy: 180 },
    lg: { cx: 100, cy: 170 },
    '2xl': { cx: 100, cy: 150 },
  })
  const spacing = useBreakpointValue({
    base: { cx: 205, cy: 160 },
    md: { cx: 230, cy: 240 },
    lg: { cx: 250, cy: 210 },
    '2xl': { cx: 210, cy: 210 },
  })

  const formatPieData = (data: TreasuryTokenType[], platformValue: number) => {
    const result = data?.map((tok) => ({
      name: TOKENS[tok.id].name,
      value: (tok.raw_dollar / platformValue) * 100,
      amount: tok.raw_dollar,
    }))
    setPieData(result)
  }

  useEffect(() => {
    const getTokens = async () => {
      const { totalAccountValue, sortedTreasuryDetails } =
        await getTreasuryDetails()
      setAccountValue(totalAccountValue)
      formatPieData(sortedTreasuryDetails, totalAccountValue)
      setTokenData(sortedTreasuryDetails)
      setTokenDataToShow(getCurrentPageData(currentPage, sortedTreasuryDetails))
    }
    getTokens()
  }, [])

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      setTokenDataToShow(getCurrentPageData(newPage, tokenData))
    }
  }

  const handleNext = () => {
    const totalPages = Math.ceil(tokenData?.length / DATA_SIZE_PER_PAGE)
    if (currentPage < totalPages) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      setTokenDataToShow(getCurrentPageData(newPage, tokenData))
    }
  }

  return (
    <>
      <Text fontWeight="bold" fontSize="2xl">
        Tokens (${formatValue(accountValue)})
      </Text>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        mt="8"
        gap={{ base: 10, '2xl': 18 }}
      >
        <Box overflowX="auto">
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
                          : token.token.map((t) => (
                              <>
                                <span>{`${formatValue(t.amount)} ${
                                  t.symbol
                                }`}</span>
                                <br />
                              </>
                            ))}
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
                    </Tr>
                  ))}
              {tokenDataToShow.length > 0 && (
                <TableCaption mt={0}>
                  <Flex w="100%">
                    <Box>
                      <Button
                        variant="outline"
                        leftIcon={<FaArrowLeft />}
                        onClick={handlePrevious}
                        rounded="md"
                        isDisabled={currentPage === 1}
                      >
                        <Text fontSize="sm">Previous</Text>
                      </Button>
                    </Box>
                    <Spacer />
                    <Box>
                      <Button
                        variant="outline"
                        rightIcon={<FaArrowRight />}
                        onClick={handleNext}
                        rounded="md"
                        isDisabled={
                          Math.ceil(tokenData?.length / DATA_SIZE_PER_PAGE) ===
                          currentPage
                        }
                      >
                        <Text fontSize="sm">Next</Text>
                      </Button>
                    </Box>
                  </Flex>
                </TableCaption>
              )}
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
