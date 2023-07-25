'use client'

import { BraindaoLogo } from '@/components/braindao-logo'
import { EmptyState } from '@/components/illustrations/empty-state'
import {
  Flex,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  LinkBox,
  Box,
  Skeleton,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import shortenAccount from '@/utils/shortenAccount'
import Link from '@/components/elements/LinkElements/Link'
import LinkOverlay from '@/components/elements/LinkElements/LinkOverlay'
import { VoteQl } from '@/data/VotingData'
import PageHeader from '../dashboard/PageHeader'

const Loader = () => {
  return (
    <Box
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
      mt={5}
    >
      <Flex alignItems="center" fontSize="sm" gap="1" py={2}>
        <Skeleton
          h={{ xl: '6', base: '4' }}
          w={{ xl: '237px', base: '20' }}
          borderRadius="full"
        />
        <Skeleton
          h={{ xl: '6', base: '4' }}
          w={{ xl: '207px', base: '20' }}
          borderRadius="full"
          display={{ base: 'none', md: 'block' }}
          ml="auto"
        />
      </Flex>
      <Skeleton h={{ xl: '8', base: '4' }} w="full" borderRadius="full" />
      <Skeleton h={{ xl: '20', base: '20' }} borderRadius="md" />
    </Box>
  )
}

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

const VotingPage = () => {
  const [proposals, setProposals] = useState<any[]>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true)
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')
      const res = await fetch('https://hub.snapshot.org/graphql', {
        method: 'POST',
        headers: myHeaders,
        body: VoteQl,
      })
      const { data } = await res.json()
      setProposals(data.proposals)
      setIsLoading(false)
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
    if (isLoading) return [0, 1, 2].map((i) => <Loader key={i} />)
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
    proposals?.filter((p) => p.state === 'active'),
    true,
  )
  const oldVotes = renderVotes(
    proposals?.filter((p) => p.state === 'closed' && p.scores.length > 1),
  )
  return (
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
              Old Votes
            </Tab>
            <Tab
              color="fadedText4"
              _selected={{ color: 'brandText', borderColor: 'current' }}
              fontWeight="medium"
            >
              Active votes
            </Tab>
          </TabList>
          <TabPanels mt="4">
            <TabPanel p="0" w={{ base: 'full', lg: 'inherit' }}>
              {oldVotes}
            </TabPanel>
            <TabPanel p="0" w={{ base: 'full', lg: 'inherit' }}>
              {activeVotes}
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
          The IQ token is fully governed by BrainDAO’s community of IQ stakers.
          Stakers can vote on all governance proposals and create their own
          proposals.
        </p>
      </Flex>
    </Flex>
  )
}

export default VotingPage
