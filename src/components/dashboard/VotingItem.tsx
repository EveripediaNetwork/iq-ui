import shortenAccount from '@/utils/shortenAccount'
import { LinkBox, Flex, Text } from '@chakra-ui/react'
import LinkOverlay from '@/components/elements/LinkElements/LinkOverlay'
import Link from '@/components/elements/LinkElements/Link'
import React from 'react'
import { BraindaoLogo } from '../braindao-logo'
import { VotingItemProps } from '@/types/voteType'

export const VotingItem = (props: VotingItemProps) => {
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
