import { DashboardLayout } from '@/components/dashboard/layout'
import { PIE_CHART_COLORS, TOKENS, TOKEN_KEYS } from '@/data/treasury-data'
import { fetchTokens, transformTokensData } from '@/utils/treasury-utils'
import {
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Table,
  Td,
  Text,
  Thead,
  Tr,
  chakra,
  Wrap,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, TooltipProps } from 'recharts'
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${payload[0].name} : $${payload[0].payload.amount}`}</p>
        <p className="intro">{label}</p>
      </div>
    )
  }

  return null
}

const Treasury: NextPage = () => {
  const [tokenData, setTokenData] =
    useState<ReturnType<typeof transformTokensData>>()

  useEffect(() => {
    const res = fetchTokens()
    Promise.resolve(res).then(idsData => {
      setTokenData(() => transformTokensData(idsData))
    })
  }, [])

  const pieChartData = tokenData
    ? Object.values(tokenData).map(tok => ({
        name: TOKENS.find(k => k.id === tok?.id)?.name,
        value: tok?.raw_dollar,
        amount: tok?.dollar_amount,
      }))
    : []

  return (
    <DashboardLayout>
      <Flex direction="column" gap="6" pt="8">
        <Flex direction="column" gap="1">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            IQ Treasury
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="fadedText">
            See all our NFT and Tokens collections
          </Text>
        </Flex>
      </Flex>
      <SimpleGrid
        mt="6"
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={{ md: '21px', lg: '25px' }}
        spacingY="43px"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Flex
            direction="column"
            key={i}
            width={{ base: '430.32px', md: '341.91px', lg: '375.17px' }}
            maxW="full"
          >
            <Image
              src="https://figma.com/file/wosuJaHeV318k1ON82CZpo/image/41a91aa29c98388443d8bce56ce8cf421ec4ff9d?fuid=943374801318148991"
              loading="lazy"
              width="auto"
              height="auto"
            />
            <Stack
              bg="linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.024) 100%)"
              backdropFilter="blur(87.3043px)"
              px={{ base: '2.5', lg: '3' }}
              pt={{ base: '3', md: '2.5', lg: '4' }}
              pb={{ base: '4', md: '2', lg: '6' }}
              transform="matrix(1, 0, 0, 1, 0, 0)"
              roundedBottom="lg"
              shadow="md"
              mt="-8"
            >
              <Text fontWeight="bold" fontSize="3xl">
                Bored Ape
              </Text>
              <Text fontWeight="medium" fontSize="lg">
                BAYC #9665
              </Text>
            </Stack>
          </Flex>
        ))}
      </SimpleGrid>
      <Text fontWeight="bold" fontSize="2xl" mt="10">
        Tokens
      </Text>
      <Wrap direction={{ base: 'column', md: 'row' }} mt="6" gap="40px">
        <chakra.div overflowX="auto">
          <Table border="solid 1px" borderColor="divider">
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
            {TOKENS.map((token, i) => (
              <Tr key={i}>
                <Td
                  whiteSpace="nowrap"
                  sx={{
                    '& > *': {
                      display: 'inline-block',
                      my: 'auto',
                    },
                  }}
                >
                  <token.icon boxSize="6" />
                  <chakra.span ml="4">{token.name}</chakra.span>
                </Td>
                <Td>
                  {tokenData?.[token.id]?.tokens} {token.name}
                </Td>
                <Td textAlign="center">
                  ${tokenData?.[token.id]?.dollar_amount} (
                  {tokenData?.[token.id]?.percentage}%)
                </Td>
              </Tr>
            ))}
          </Table>
        </chakra.div>
        <chakra.div
          flex="auto"
          w="max"
          mx="auto"
          sx={{
            '.pie-cell': {
              stroke: 'transparent',
            },
            '& svg, & .recharts-wrapper': {
              boxSize: 'full !important',
            },
          }}
        >
          <PieChart width={200} height={200}>
            <Pie
              data={pieChartData}
              cx={200}
              cy={200}
              labelLine={false}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                  className="pie-cell"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </chakra.div>
      </Wrap>
    </DashboardLayout>
  )
}

export default Treasury
