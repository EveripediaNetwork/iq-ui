'use client'

import { TREASURIES } from '@/data/treasury-data'
import {
  Flex,
  Heading,
  Stack,
  Text,
  Box,
  Grid,
  GridItem,
  useRadioGroup,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import Image from 'next/image'
import React, { useState } from 'react'
import Link from '@/components/elements/LinkElements/Link'
import { TreasuryGraphTable } from '../dashboard/TreasuryGraphTable'
import { NftCarousel } from '../elements/Carousel/Carousel'
import GraphComponent from '../dashboard/GraphComponent'
import { CUSTOM_GRAPH_PERIODS, StakeGraphPeriod } from '@/data/dashboard-data'
import { getDateRange } from '@/utils/dashboard-utils'
import { useGetTreasuryValueQuery } from '@/services/treasury'
import GraphPeriodButton from '../dashboard/GraphPeriodButton'
import { EmblaOptionsType } from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const TreasuryPage: NextPage = () => {
  const OPTIONS: EmblaOptionsType = { loop: true }
  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: StakeGraphPeriod['30DAYS'],
  })
  const { startDate, endDate } = getDateRange(value as string)
  const { data } = useGetTreasuryValueQuery({ startDate, endDate })
  const [treasuryValue, setTreasuryValue] = useState<number>()
  const treasuryGraphData = data?.map((dt) => ({
    amt: parseFloat(dt.totalValue),
    name: new Date(dt.created).toISOString().slice(0, 10),
  }))
  //replace last data point with current treasury value for consistency
  if (treasuryValue && treasuryGraphData) {
    treasuryGraphData[treasuryGraphData.length - 1] = {
      amt: treasuryValue,
      name: treasuryGraphData[treasuryGraphData.length - 1]?.name,
    }
  }

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


      <TreasuryGraphTable
        setTreasuryValue={(tValue: number) => setTreasuryValue(tValue)}
      />


      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(12, 1fr)' }}
        gap={10}
        mb={{ base: 20, lg: 4 }}
        w="full"
      >
        <GridItem colSpan={{ base: 10, md: 12, lg: 8 }}>
          <Box w="full">
            <GraphComponent
              graphData={treasuryGraphData}
              graphCurrentValue={treasuryValue}
              graphTitle="Total Token Value"
              getRootProps={getRootProps}
              areaGraph={false}
              height={200}
              isTreasuryPage={true}
            >
              {CUSTOM_GRAPH_PERIODS.map((btn) => {
                return (
                  <GraphPeriodButton
                    key={btn.period}
                    label={btn.label}
                    isDisabled={
                      btn.period === StakeGraphPeriod['1Y'] ||
                      btn.period === StakeGraphPeriod.ALL
                    }
                    {...getRadioProps({ value: btn.period })}
                  />
                )
              })}
            </GraphComponent>
          </Box>
        </GridItem>


        <GridItem colSpan={{ base: 10, md: 12, lg: 4 }}>
          <Box
            border="1px solid"
            borderColor="divider"
            rounded="lg"
            pt={5}
            pb={10}
            px={10}
          >
            <NftCarousel
              data={TREASURIES}
              options={OPTIONS}
              plugins={[Autoplay()]}
              item={(treasury) => (
                <Box
                  maxH={{ base: '700px', md: '650px', lg: '350px' }}
                  key={treasury.id}
                  flex="0 0 auto"
                  // minW="0"
                  onClick={() =>
                    treasury.href && window.open(`${treasury.href}`, '_blank')
                  }
                  display={{
                    base: 'block',
                  }}
                  overflow="hidden"
                >
                  <Flex
                    direction="column"
                    w="100%"
                    maxW="full"
                    cursor="pointer"
                    px={{ md: 2, lg: 0 }}
                  >
                    <Box
                      position="relative"
                      width={{ base: '500px', md: '300px', lg: '302px' }}
                      height={{ base: '400px', md: '300px', lg: '300px' }}
                      borderTopRightRadius="8"
                      borderTopLeftRadius="8"
                      overflow="hidden"
                    >
                      <Image
                        src={treasury.image}
                        alt={treasury.title as string}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="top"
                      />
                    </Box>
                    <Stack
                      bg="linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.024) 100%)"
                      backdropFilter="blur(87.3043px)"
                      px={{ base: '2.5', lg: '3' }}
                      pb={{ base: '4', md: '2', lg: '2' }}
                      transform="matrix(1, 0, 0, 1, 0, 0)"
                      roundedBottom="lg"
                      mt="-8"
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
                </Box>
              )}
            />
          </Box>
        </GridItem> 
      </Grid> 
    </>
  )
}

export default TreasuryPage
