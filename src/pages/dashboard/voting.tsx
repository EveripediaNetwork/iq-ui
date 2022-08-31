import { BraindaoLogo } from '@/components/braindao-logo'
import { DashboardLayout } from '@/components/dashboard/layout'
import { EmptyState } from '@/components/illustrations/empty-state'
import {
  Flex,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'

const graphql = JSON.stringify({
  query: `
  query Proposals {
    proposals(where: {space_in: ["everipediaiq.eth"], state: "all", author_in: []}, orderBy: "created", orderDirection: desc) {
      id
      ipfs
      title
      body
      start
      end
      state
      author
      created
      choices
      space {
        id
        name
        members
        avatar
        symbol
      }
      scores_state
      scores_total
      scores
      votes
      quorum
      symbol
    }
  }
  `,
  variables: {},
})

type VotingItemProps = {
  item: {
    id: string
    title: string
    body: string
    author: string
    end: number
  }
  active?: boolean
}
const VotingItem = (props: VotingItemProps) => {
  const { item, active } = props
  const date = new Date(item.end * 1000)

  const formattedDate = `${new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))} at ${new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
  }).format(new Date(date))}`

  return (
    <LinkBox
      display="flex"
      p="3"
      flex="auto"
      w={{ base: 'full', lg: 'lg' }}
      bg="lightCard"
      rounded="lg"
      flexDirection="column"
      gap="4"
      border="solid 1px"
      borderColor="divider"
    >
      <Flex fontSize="sm" gap="1">
        <BraindaoLogo w="25px" h="21px" />
        <Text ml="3">Created by </Text>{' '}
        <Text color="brandText" maxW="100px" noOfLines={1}>
          {item.author}
        </Text>
        <Text display={{ base: 'none', md: 'block' }} ml="auto">
          <b>{active ? 'Ends' : 'Ended'}:</b> {formattedDate}
        </Text>
      </Flex>
      <LinkOverlay
        fontWeight="bold"
        fontSize={{ base: 'xl', md: '2xl' }}
        href={`https://snapshot.everipedia.com/#/proposal/${item.id}`}
        target="_blank"
      >
        {item.title}
      </LinkOverlay>
      <Text fontSize="sm" noOfLines={4}>
        {item.body}
      </Text>
      <Text fontSize="sm" display={{ md: 'none' }}>
        <b>{active ? 'Ends' : 'Ended'}:</b> {formattedDate}
      </Text>
    </LinkBox>
  )
}

const Voting: NextPage = () => {
  const [proposals, setProposals] = useState<any[]>()

  useEffect(() => {
    const fetchSpaces = async () => {
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')
      const res = await fetch('https://hub.snapshot.org/graphql', {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
      })
      const { data } = await res.json()
      setProposals(data.proposals)
    }

    fetchSpaces()
  }, [])

  const emptyState = (
    <Flex direction="column" gap="10" textAlign="center" align="center" mt="16">
      <EmptyState />
      <Text maxW="80">
        There are no active votings at the moment, Votes in progress will appear
        here when they are happening.
      </Text>
    </Flex>
  )

  const renderVotes = (votes: any[] | undefined, active?: boolean) => {
    if (!votes?.length) return emptyState
    return (
      <>
        <Flex gap="8" direction="column" align="center" flex="auto">
          {votes?.map((vote, i) => (
            <VotingItem key={i} item={vote} active={active} />
          ))}
        </Flex>
      </>
    )
  }

  const activeVotes = renderVotes(
    proposals?.filter(p => p.state === 'active'),
    true,
  )
  const oldVotes = renderVotes(proposals?.filter(p => p.state === 'closed'))

  return (
    <DashboardLayout squeeze>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        px={{ base: '6', md: '7', lg: '10' }}
        py={{ base: '5', lg: '0' }}
        pb="16"
      >
        <Flex
          pt="8"
          pr={{ lg: 8 }}
          flex="auto"
          direction="column"
          gap="8"
          pb="4.375em"
          border="solid 1px transparent"
          borderRightColor={{ lg: 'divider' }}
        >
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
              <Tab
                color="dimmedText2"
                _selected={{ color: 'brandText', borderColor: 'current' }}
              >
                Active votes
              </Tab>
              <Tab
                color="dimmedText2"
                _selected={{ color: 'brandText', borderColor: 'current' }}
              >
                Old Votes
              </Tab>
            </TabList>

            <TabPanels mt="4">
              <TabPanel p="0">{activeVotes}</TabPanel>
              <TabPanel p="0">{oldVotes}</TabPanel>
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
          px={{ base: '2', md: '12' }}
          pr={{ lg: 1 }}
          h={{ base: 'full', lg: '100vh' }}
          fontSize="sm"
          textAlign={{ base: 'center', lg: 'left' }}
          maxW={{ lg: '25.875em' }}
          minW="18.75em"
          pb="16"
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
