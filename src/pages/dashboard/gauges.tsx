import React, { memo } from 'react'
import { Flex } from '@chakra-ui/layout'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import GaugesVotesTable from '@/components/gauges/gaugesVotesTable'
import GaugesTable from '@/components/gauges/gaugesTable'
import HeadingCards from '@/components/gauges/headingCards'
import BrainyStaking from '@/components/gauges/brainyStaking'
import Mint from '@/components/gauges/mint'
import PageHeader from '@/components/dashboard/PageHeader'
import GaugesInitiator from '@/components/gauges/GaugesInitiator'

const TABS = ['Mint', 'Stake', 'Voting Allocation', 'Votes']
const Gauges: NextPage = () => {
  return (
    <>
      <GaugesInitiator />
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
        <PageHeader
          header="IQ Gauges"
          body="Track all gauges within our IQ platform."
        />
        <HeadingCards />
        <Flex direction="column" gap="1">
          <Tabs mt={26}>
            <TabList>
              {TABS.map((tab, index) => (
                <Tab
                  _selected={{
                    borderColor: 'brandLinkColor',
                    textColor: 'brandLinkColor',
                  }}
                  key={index}
                >
                  {tab}
                </Tab>
              ))}
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
                <GaugesVotesTable />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>
    </>
  )
}
export default memo(Gauges)
