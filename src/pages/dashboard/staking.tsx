import { DashboardLayout } from '@/components/dashboard/layout'
import {
  Flex,
  Heading,
  Text,
  SimpleGrid,
  FlexProps,
  Table,
  Td,
  Tr,
  Thead,
  chakra,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React from 'react'

type StakeCardProps = {
  title: string
  value: string
} & FlexProps
const StakeCard = (props: StakeCardProps) => {
  const { title, value } = props
  return (
    <Flex
      direction="column"
      gap="6px"
      align="center"
      px="13px"
      py="7px"
      {...props}
    >
      <Text fontSize="xs" color="grayText" textAlign="center">
        {title}
      </Text>
      <Text fontWeight="semibold">{value}</Text>
    </Flex>
  )
}

const TABLE_KEYS = [
  {
    label: 'Name',
    id: 'name',
  },
  {
    label: 'Status',
    id: 'status',
  },
  {
    label: 'Chain',
    id: 'chain',
  },
  {
    label: 'Gauge',
    id: 'gauge',
  },
  {
    label: 'Reward tokens',
    id: 'reward_tokens',
  },
  {
    label: 'TVL',
    id: 'tvl',
  },
  {
    label: 'APR (Base/Max)',
    id: 'apr',
  },
]

const SAMPLE_RECORD = {
  name: 'Olympus Pro Frax Bond',
  status: 'LIVE',
  chain: 'Arbitrum',
  gauge: 'YES',
  reward_tokens: ['IQ', 'FXS'],
  tvl: 'Varies',
  apr: '55.5%',
}
const SAMPLE_RECORD2 = {
  name: 'Olympus Pro Frax Bond',
  status: 'OFF',
  chain: 'Arbitrum',
  gauge: null,
  reward_tokens: ['IQ', 'FXS'],
  tvl: 'Varies',
  apr: '55.5%',
}

const sampleRecords = [
  SAMPLE_RECORD2,
  ...Array.from({ length: 2 }).map(() => SAMPLE_RECORD),
]

const Staking: NextPage = () => {
  const bStyles = {
    borderLeft: 'solid 1px',
    borderColor: 'divider2',
  }
  return (
    <DashboardLayout>
      <Flex direction="column" gap="6" pt="8">
        <Flex direction="column" gap="2">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            Staking
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="fadedText">
            Earn IQ token rewards and NFT raffles
          </Text>
        </Flex>
      </Flex>
      <SimpleGrid
        columns={{ base: 2, md: 4 }}
        px={{ base: '8', md: '2' }}
        py="3"
        mt="7"
        spacingY="13px"
        border="solid 1px"
        borderColor="divider"
        rounded="lg"
        bg="divider"
      >
        <StakeCard title="Total volume locked" value="409,581,181 IQ" />
        <StakeCard title="Estimated Holders" value="164,025" {...bStyles} />
        <StakeCard
          title="IQ Price"
          value="$0.0046"
          {...bStyles}
          borderLeftWidth={{ base: '0', md: '1px' }}
        />
        <StakeCard title="Annual percentage rate" value="44.18%" {...bStyles} />
      </SimpleGrid>

      <chakra.div
        overflowX="auto"
        border="solid 1px"
        borderColor="divider2"
        rounded="lg"
        mt="16"
        fontSize="sm"
      >
        <Table>
          <Thead border="none" bg="divider">
            {TABLE_KEYS.map(th => (
              <Td key={th.id} border="none" whiteSpace="nowrap">
                {th.label}
              </Td>
            ))}
          </Thead>
          {sampleRecords.map((rec, id) => (
            <Tr key={id} whiteSpace="nowrap"> 
              <Td fontSize="sm" border="none" >
                {rec.name}
              </Td>
              <Td
                fontSize="sm"
                border="none"
                color={rec.status === 'LIVE' ? 'brand.600' : ''}
                fontWeight="semibold"
              >
                {rec.status}
              </Td>
              <Td fontSize="sm" border="none">
                {rec.chain}
              </Td>
              <Td
                fontSize="sm"
                border="none"
                color="brand.600"
                fontWeight="semibold"
              >
                {rec.gauge || '-'}
              </Td>
              <Td fontSize="sm" border="none" display="flex" gap="2">
                {rec.reward_tokens.map(token => (
                  <span>{token}</span>
                ))}
              </Td>
              <Td fontSize="sm" border="none">
                {rec.tvl}
              </Td>
              <Td fontSize="sm" border="none">
                {rec.apr}
              </Td>
            </Tr>
          ))}
        </Table>
      </chakra.div>
    </DashboardLayout>
  )
}

export default Staking
