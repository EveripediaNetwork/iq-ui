import React, { useEffect, useState } from 'react'
import { Flex, Heading, Text } from '@chakra-ui/layout'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import GaugesVotingTable from '@/components/gauges/gaugesVotesTable'
import GaugesTable from '@/components/gauges/gaugesTable'
import { useAppDispatch } from '@/store/hook'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { setGauges } from '@/store/slices/gauges-slice'
import config from '@/config'
import VotingControls from '@/components/gauges/votingControls'
import HeadingCards from '@/components/gauges/headingCards'

const Gauges: NextPage = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
  const { gaugeName } = useGaugeCtrl()

  const dispatch = useAppDispatch()
  // const currentGauge: Gauge = useAppSelector(state => state.gauges.currentGauge)

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
  }, [gaugeName])

  console.log(gaugeName)

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
          <HeadingCards />
          <Tabs onChange={setSelectedTabIndex} mt={46}>
            <TabList>
              <Tab>Voting Allocation</Tab>
              <Tab>Votes</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <GaugesTable />
              </TabPanel>
              <TabPanel>
                <GaugesVotingTable />
              </TabPanel>
            </TabPanels>
          </Tabs>
          {selectedTabIndex === 0 ? <VotingControls /> : null}
        </Flex>
      </Flex>
    </>
  )
}

export default Gauges
