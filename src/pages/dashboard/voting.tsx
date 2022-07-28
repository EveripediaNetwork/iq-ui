import { BraindaoLogo } from '@/components/braindao-logo'
import { DashboardLayout } from '@/components/dashboard/layout'
import {
  Flex,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React from 'react'

const VotingItem = () => {
  return (
    <Flex
      p="3"
      flex="auto"
      w="full"
      bg="lightCard"
      rounded="lg"
      direction="column"
      gap="4"
      border="solid 1px"
      borderColor="divider"
    >
      <Flex fontSize="sm" gap="1">
        <BraindaoLogo w="25px" h="21px" />
        <Text ml="3">Created by </Text>{' '}
        <Text color="brandText"> Everipedia Team</Text>
        <Text display={{ base: 'none', md: 'block' }} ml="auto">
          <b>Ended:</b> MM/DD/YYYY at 5 PM
        </Text>
      </Flex>
      <Heading fontSize={{ base: 'xl', md: '2xl' }}>
        IQIP-7: Creating an IQ Locking Event on a Major Centralized Exchange
      </Heading>
      <Text fontSize="sm">
        The IQ token is a multichain token that powers the Everipedia ecosystem
        of dapps and features. IQ token is a DeFi token that can be staked for
        hiIQ to earn rewards + yields. You can bridge your token from all chains
        IQ circulares on, using our bridge UI, and lots more.
      </Text>
      <Text fontSize="sm" display={{ md: 'none' }}>
        <b>Ended:</b> MM/DD/YYYY at 5 PM
      </Text>
    </Flex>
  )
}

const Voting: NextPage = () => {
  const votes = (
    <>
      <Flex gap="8" direction="column" align="center" flex="auto">
        {Array.from({ length: 2 }).map((_, i) => (
          <VotingItem key={i} />
        ))}
      </Flex>
    </>
  )
  return (
    <DashboardLayout squeeze>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap="6"
        px={{ base: '6', md: '7', lg: '10' }}
        h="full"
        overflow="auto"
      >
        <Flex pt="8" flex="auto" direction="column" gap="8">
          <Flex direction="column" gap="2">
            <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
              IQ Voting
            </Heading>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="fadedText">
              Follow the votes and stay on top of the whole IQ world.
            </Text>
          </Flex>
          <Tabs colorScheme="brand">
            <TabList borderColor="transparent">
              <Tab>Active votes</Tab>
              <Tab>Old Votes</Tab>
            </TabList>

            <TabPanels mt="4">
              <TabPanel p="0">{votes}</TabPanel>
              <TabPanel p="0">{votes}</TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>

        <Flex
          direction="column"
          gap="4"
          pt="8"
          alignSelf={{ base: 'center', lg: 'start' }}
          border="solid 1px transparent"
          borderTopColor={{ base: 'divider', lg: 'transparent' }}
          borderLeftColor={{ lg: 'divider' }}
          px={{ base: '2', md: '12' }}
          pr={{ lg: 1 }}
          h="full"
          fontSize="xs"
          textAlign={{ base: 'center', lg: 'left' }}
          maxW={{ lg: '23.875em' }}
          minW="18.75em"
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque, et
            condimentum convallis ligula gravida at. Morbi nulla sed vel leo.
            Venenatis massa nisl vitae morbi tincidunt libero. Morbi enim
            placerat in malesuada id nisl ultrices id. Get involved in the IQ
            Ecosystem and swap the IQ token easily across different exchange
            platforms.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque, et
            condimentum convallis ligula gravida at. Morbi nulla sed vel leo.
            Venenatis massa nisl vitae morbi tincidunt libero. Morbi enim
            placerat in malesuada id nisl ultrices id. Get involved in the IQ
            Ecosystem and swap the IQ token easily across different exchange
            platforms.
          </p>
        </Flex>
      </Flex>
    </DashboardLayout>
  )
}

export default Voting
