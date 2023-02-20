import { BraindaoLogo } from '@/components/braindao-logo'
import { EmptyState } from '@/components/illustrations/empty-state'
import { NextSeo } from 'next-seo'
import {
  Flex,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  LinkBox,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import shortenAccount from '@/utils/shortenAccount'
import Link from '@/components/elements/LinkElements/Link'
import LinkOverlay from '@/components/elements/LinkElements/LinkOverlay'
import PageHeader from '@/components/dashboard/PageHeader'

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
      w="full"
      bg="lightCard"
      rounded="lg"
      flexDirection="column"
      gap="4"
      border="solid 1px"
      borderColor="divider"
    >
      <Flex alignItems="center" fontSize="sm" gap="1">
        <BraindaoLogo width={6} height={6} />
        <Text ml="1" fontWeight="medium">
          Created by{' '}
        </Text>{' '}
        <Link
          href={`https://snapshot.org/#/profile/${item.author}`}
          isExternal
          color="brandText"
          maxW="100px"
          noOfLines={1}
          fontWeight="medium"
        >
          {shortenAccount(item.author)}
        </Link>
        <Text
          display={{ base: 'none', md: 'block' }}
          ml="auto"
          fontWeight="medium"
        >
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
      <Text fontSize="sm" noOfLines={4} fontWeight="medium">
        {item.body}
      </Text>
      <Text fontSize="sm" display={{ md: 'none' }} fontWeight="medium">
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
    <Flex
      direction="column"
      gap="10"
      textAlign="center"
      align="center"
      mt="16"
      ml="auto"
      w={{ base: 'full', lg: 'full' }}
    >
      <EmptyState />
      <Text maxW="80" color="tooltipColor" fontWeight="medium">
        There are no active votings at the moment, Votes in progress will appear
        here as they happen.
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
  const oldVotes = renderVotes(
    proposals?.filter(p => p.state === 'closed' && p.scores.length > 1),
  )

  return (
    <>
      <NextSeo
        title="Voting Page"
        description="Follow votes and all related information."
        openGraph={{
          title: 'IQ Votes',
          description: 'Follow votes and all related information.',
        }}
      />
      <Flex direction={{ base: 'column', lg: 'row' }}>
        <Flex
          pr={{ lg: 8 }}
          flex={1}
          direction="column"
          gap="8"
          pb="4.375em"
          border="solid 1px transparent"
          minH="calc(100vh - 70px)"
          borderRightColor={{ lg: 'divider' }}
          py={{ base: '5', lg: '6' }}
        >
          <PageHeader
            header="IQ Voting"
            body="Follow votes and all related information."
          />
          <Tabs colorScheme="brand">
            <TabList borderColor="transparent">
              <Tab
                color="fadedText4"
                _selected={{ color: 'brandText', borderColor: 'current' }}
                fontWeight="medium"
              >
                Active votes
              </Tab>
              <Tab
                color="fadedText4"
                _selected={{ color: 'brandText', borderColor: 'current' }}
                fontWeight="medium"
              >
                Old Votes
              </Tab>
            </TabList>

            <TabPanels mt="4">
              <TabPanel p="0" w={{ base: 'full', lg: 'inherit' }}>
                {activeVotes}
              </TabPanel>
              <TabPanel p="0" w={{ base: 'full', lg: 'inherit' }}>
                {oldVotes}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
        <Flex
          direction="column"
          gap="4"
          border="solid 1px transparent"
          borderTopColor={{ base: 'divider', lg: 'transparent' }}
          py={{ base: '7', lg: '8' }}
          px={{ base: '2', md: '8' }}
          fontSize="xs"
          color="fadedText4"
          textAlign={{ base: 'center', lg: 'left' }}
          maxW={{ lg: '25.875em' }}
          minW="18.75em"
        >
          <p>
            The IQ token is fully governed by BrainDAO’s community of IQ
            stakers. Stakers can vote on all governance proposals and create
            their own proposals.
          </p>
        </Flex>
      </Flex>
    </>
  )
}

export default Voting
