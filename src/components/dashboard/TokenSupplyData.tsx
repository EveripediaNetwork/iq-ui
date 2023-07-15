import { Flex, Stack, Divider, Skeleton, Text } from '@chakra-ui/react'
import React from 'react'
import * as Humanize from 'humanize-plus'

export const TextHeader = ({
  text,
  value,
}: {
  text: string
  value: number
}) => {
  return (
    <Stack align="center" spacing="4">
      <Text
        color="dimmedText"
        fontSize={{ base: 'xs', md: 'inherit' }}
        fontWeight="medium"
      >
        {text}
      </Text>
      {value !== null ? (
        <>
          <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="medium">
            {Humanize.formatNumber(value, 2)}&nbsp;
          </Text>
        </>
      ) : (
        <Stack>
          <Skeleton
            h={{ xl: '6', base: '4' }}
            w={{ xl: '32', base: '20' }}
            borderRadius="full"
          />
        </Stack>
      )}
    </Stack>
  )
}

const TokenSupplyData = ({
  tvl,
  totalHiiqSupply,
  mt = '0',
  minH = '380px',
  statOneTitle,
  statTwoTitle
}: {
  tvl: number
  totalHiiqSupply: number
  mt?: string
  minH?: string
  statOneTitle: string
  statTwoTitle: string
}) => {
  return (
    <Flex
      direction={{ base: 'column', md: 'row', lg: 'column' }}
      gap="10"
      py="12"
      px={{ base: 4, md: 14, lg: 0 }}
      mt={{ base: '5', xl: mt }}
      rounded="lg"
      border="solid 1px "
      borderColor="divider"
      align="center"
      justify="space-evenly"
      minH={minH}
    >
      <TextHeader text={statOneTitle} value={tvl} />
      <Divider
        w="30"
        borderColor="divider"
        display={{ base: 'none', lg: 'inherit' }}
      />
      <Divider
        borderColor="divider"
        orientation="vertical"
        display={{ lg: 'none' }}
      />
      <Divider
        borderColor="divider"
        orientation="horizontal"
        display={{ md: 'none' }}
      />
      <TextHeader text={statTwoTitle} value={totalHiiqSupply} />
    </Flex>
  )
}

export default TokenSupplyData
