import React, { memo, useEffect, useState } from 'react'
import { Flex, Heading, Text } from '@chakra-ui/layout'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import GaugesVotesTable from '@/components/gauges/gaugesVotesTable'
import GaugesTable from '@/components/gauges/gaugesTable'
import { useAppDispatch } from '@/store/hook'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { setGauges } from '@/store/slices/gauges-slice'
import config from '@/config'
import HeadingCards from '@/components/gauges/headingCards'
import { WEEKS } from '@/types/gauge'
import BrainyStaking from '@/components/gauges/brainyStaking'
import Mint from '@/components/gauges/mint'

const Gauges: NextPage = () => {
  const [selectedWeek] = useState<WEEKS>()
  const { gaugeName } = useGaugeCtrl()

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (gaugeName) {
      dispatch(
        setGauges({
          name: gaugeName,
          address: config.gaugeCtrlAddress,
          gaugeAddress: config.nftFarmAddress,
        }),
      )
    }
  }, [gaugeName, dispatch])

  return (
    <>
      <NextSeo
        title="Gauges Page"
        openGraph={{
          title: 'IQ Gauges',
          description: 'Vote for gauges with your weight to earn rewards',
        }}
      />
      <Flex
        py={{ base: '5', lg: '6' }}
        direction="column"
        gap="6"
        pt="2"
        pb="16"
      >
        <Flex direction="column" gap="1">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            IQ Gauges
          </Heading>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="fadedText4"
            fontWeight="medium"
          >
            Track all gauges within our IQ platform.
          </Text>
        </Flex>
        <HeadingCards />
        <Flex direction="column" gap="1">
          <Tabs colorScheme="brand" mt={26}>
            <TabList>
              <Tab>Mint</Tab>
              <Tab>Stake</Tab>
              <Tab>Voting Allocation</Tab>
              <Tab>Votes</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Mint />
              </TabPanel>
              <TabPanel>
                <BrainyStaking />
              </TabPanel>
              <TabPanel>
                <GaugesTable />
              </TabPanel>
              <TabPanel>
                <GaugesVotesTable selectedWeek={selectedWeek as WEEKS} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>
    </>
  )
}

export default memo(Gauges)
