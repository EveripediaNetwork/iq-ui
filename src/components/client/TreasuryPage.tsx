'use client'

import { TREASURIES } from '@/data/treasury-data'
import { TreasuryTokenType } from '@/types/TreasuryTokenType'
import { getTreasuryDetails } from '@/utils/treasury-utils'
import {
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Box,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React, { useEffect, useState, useCallback } from 'react'
import { Sector } from 'recharts'
import type { PieProps } from 'recharts'
import { formatValue } from '@/utils/LockOverviewUtils'
import Link from '@/components/elements/LinkElements/Link'
import { TreasuryGraphTable } from '../dashboard/TreasuryGraphTable'

type PieActiveShape = PieProps['activeShape']
type OnPieEnter = NonNullable<PieProps['onMouseEnter']>

const renderActiveShape: PieActiveShape = props => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props
  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        fontSize="18"
        textAnchor="middle"
        fill={fill}
        fontWeight="bold"
      >
        {payload.name} {`(${(percent * 100).toFixed(1)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  )
}

const TreasuryPage: NextPage = () => {
  const [tokenData, setTokenData] = useState<TreasuryTokenType[]>([])
  const [accountValue, setAccountValue] = useState<number>(0)

  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = useCallback<OnPieEnter>(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )

  useEffect(() => {
    const getTokens = async () => {
      const { totalAccountValue, sortedTreasuryDetails } =
        await getTreasuryDetails()
      setAccountValue(totalAccountValue)
      setTokenData(sortedTreasuryDetails)
    }
    getTokens()
  }, [])

  return (
    <>
      <Flex direction="column" gap="6" py={{ base: '5', lg: '6' }}>
        <Flex direction="column" gap="1">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            <Box as="span">
              <Link
                href="https://etherscan.io/address/0x56398b89d53e8731bca8c1b06886cfb14bd6b654"
                isExternal
              >
                BrainDAO.eth
              </Link>
            </Box>
            <Box as="span"> Treasury</Box>
          </Heading>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="fadedText4"
            fontWeight="medium"
          >
            See all the cryptocurrencies and NFTs held in BrainDAO’s diversified
            treasury.
          </Text>
        </Flex>
      </Flex>
      <Text fontWeight="bold" fontSize="2xl">
        Tokens (${formatValue(accountValue)})
      </Text>
      <TreasuryGraphTable
        tokenData={tokenData}
        accountValue={accountValue}
        activeIndex={activeIndex}
        renderActiveShape={renderActiveShape}
        onPieEnter={onPieEnter}
      />
      <SimpleGrid
        mt={{ base: '0', lg: '8' }}
        mb={{ base: '24', lg: '10' }}
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={{ md: '21px', lg: '25px' }}
        spacingY="43px"
      >
        {TREASURIES.map((treasury, i) => (
          <Flex
            direction="column"
            key={i}
            width={{ base: '430.32px', md: '341.91px', lg: '375.17px' }}
            maxW="full"
            cursor="pointer"
            onClick={() =>
              treasury.href && window.open(`${treasury.href}`, '_blank')
            }
            display={{
              base: 'block',
            }}
            overflow="hidden"
          >
            <Image
              src={treasury.image}
              loading="lazy"
              width="full"
              height={{ base: '411px', md: '328.23px', lg: '367px' }}
              borderTopRightRadius="8"
              borderTopLeftRadius="8"
              objectFit="cover"
            />
            <Stack
              bg="linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.024) 100%)"
              backdropFilter="blur(87.3043px)"
              px={{ base: '2.5', lg: '3' }}
              pb={{ base: '4', md: '2', lg: '2' }}
              transform="matrix(1, 0, 0, 1, 0, 0)"
              roundedBottom="lg"
              mt="-2"
              borderBottom="1px solid"
              borderRight="1px solid"
              borderLeft="1px solid"
              borderColor="divider"
            >
              <Text fontWeight="bold" fontSize="2xl">
                {treasury.title}
              </Text>
              <Text fontWeight="medium" fontSize="lg">
                {treasury.body}
              </Text>
            </Stack>
          </Flex>
        ))}
      </SimpleGrid>
    </>
  )
}

export default TreasuryPage
