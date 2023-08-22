'use client'

import React, { lazy } from 'react'
import { Flex } from '@chakra-ui/layout'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import HeadingCards from '@/components/gauges/headingCards'
import PageHeader from '@/components/dashboard/PageHeader'
import GaugesInitiator from '@/components/gauges/GaugesInitiator'
import { NextPage } from 'next'

const TABS = ['Mint', 'Stake', 'Voting Allocation', 'Votes']
const Mint = lazy(() => import('@/components/gauges/mint'))
const BrainyStaking = lazy(() => import('@/components/gauges/brainyStaking'))
const GaugesTable = lazy(() => import('@/components/gauges/gaugesTable'))
const GaugesVotesTable = lazy(
  () => import('@/components/gauges/gaugesVotesTable'),
)

const Gauges: NextPage = () => {
  return (
    <>
      <GaugesInitiator />
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
          hasExternalLink={false}
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
export default Gauges
