import { Flex, Stack, Divider, Skeleton, Text } from '@chakra-ui/react'
import React from 'react'
import * as Humanize from 'humanize-plus'

const TokenSupplyData = ({
  tvl,
  totalHiiqSupply,
}: {
  tvl: number
  totalHiiqSupply: number
}) => {
  return (
    <Flex
      direction={{ base: 'column', md: 'row', lg: 'column' }}
      gap="10"
      py="12"
      px={{ base: 4, md: 14, lg: 0 }}
      mt={{ base: '5', xl: '0' }}
      rounded="lg"
      border="solid 1px "
      borderColor="divider"
      align="center"
      justify="space-evenly"
    >
      <Stack align="center" spacing="4">
        <Text
          color="dimmedText"
          fontSize={{ base: 'xs', md: 'inherit' }}
          fontWeight="medium"
        >
          Total IQ Locked
        </Text>
        {tvl !== null ? (
          <>
            <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="medium">
              {Humanize.formatNumber(tvl, 2)}&nbsp;
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
      <Stack align="center" spacing="4">
        <Text color="dimmedText" fontSize={{ base: 'xs', md: 'inherit' }}>
          Total HiIQ
        </Text>
        {totalHiiqSupply !== null ? (
          <>
            <Text fontSize={{ base: 'md', md: '2xl' }} fontWeight="medium">
              {Humanize.formatNumber(totalHiiqSupply, 2)}&nbsp;
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
    </Flex>
  )
}

export default TokenSupplyData
