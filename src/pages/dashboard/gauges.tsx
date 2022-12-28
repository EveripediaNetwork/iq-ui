import React, { memo, useEffect, useState } from 'react'
import { Flex, Heading, Text } from '@chakra-ui/layout'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import {
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import GaugesVotesTable from '@/components/gauges/gaugesVotesTable'
import GaugesTable from '@/components/gauges/gaugesTable'
import { useAppDispatch } from '@/store/hook'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { setGauges } from '@/store/slices/gauges-slice'
import config from '@/config'
import VotingControls from '@/components/gauges/votingControls'
import HeadingCards from '@/components/gauges/headingCards'
import GaugesVotesDistribution from '@/components/gauges/gaugesVotesDistribution'
import { WEEKS } from '@/types/gauge'
import Mint from '@/components/gauges/mint'
import BrainyStaking from '@/components/gauges/brainyStaking'

const Gauges: NextPage = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
  const [selectedWeek, setSelectedWeek] = useState<WEEKS>()
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
          <HeadingCards />
          {selectedTabIndex === 3 ? (
            <Flex mt="25px" justifyContent="end" direction="row">
              <Select
                w="150px"
                onChange={event => setSelectedWeek(event.target.value as WEEKS)}
              >
                <option value={WEEKS.THIS_WEEK}>This Week</option>
                <option value={WEEKS.LAST_WEEK}>Last Week</option>
              </Select>
            </Flex>
          ) : null}
          <Tabs colorScheme="brand" onChange={setSelectedTabIndex} mt={46}>
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
                <br />
                <GaugesVotesDistribution />
              </TabPanel>
            </TabPanels>
          </Tabs>
          {selectedTabIndex === 2 ? <VotingControls /> : null}
        </Flex>
      </Flex>
    </>
  )
}

export default memo(Gauges)
