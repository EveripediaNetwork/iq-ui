import { IQLogo } from '@/components/iq-logo'
import StakeCard from '@/components/cards/StakeCard'
import { Arbitrium } from '@/components/icons/arbitrium'
import { Ethereum } from '@/components/icons/ethereum'
import { Fraxswap } from '@/components/icons/fraxswap'
import { FXSLogo } from '@/components/icons/fxs-logo'
import { Olympus } from '@/components/icons/olympus'
import { UniswapEllipse } from '@/components/icons/uniswap-ellipse'
import {
  Flex,
  SimpleGrid,
  Table,
  chakra,
  Thead,
  Tr,
  Th,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import React from 'react'
import { NextSeo } from 'next-seo'
import { useTable, useSortBy } from 'react-table'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Dict } from '@chakra-ui/utils'
import { SortDown } from '@/components/icons/sort-down'
import { SortUp } from '@/components/icons/sort-up'
import Link from '@/components/elements/LinkElements/Link'
import PageHeader from '@/components/dashboard/PageHeader'

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

const stakings = [
  {
    name: 'Olympus Pro Frax Bond',
    icon: Olympus,
    link: 'https://everipedia.com',
    status: 'LIVE',
    chain: { label: 'Arbitrum', icon: Arbitrium },

    gauge: null,
    reward_tokens: [{ label: 'IQ', icon: IQLogo }],
    tvl: 'Varies',
    apr: { Base: 'Varies', Max: 'Varies' },
  },
  {
    name: 'Fraxswap FRAX/IQ',
    icon: Fraxswap,
    link: 'https://everipedia.com',
    status: 'LIVE',
    chain: { label: 'Ethereum', icon: Ethereum },
    gauge: 'YES',
    reward_tokens: [
      { label: 'IQ', icon: IQLogo },
      { label: 'FXS', icon: FXSLogo },
    ],
    tvl: '$2.19M',
    apr: { Base: '55.5%', Max: '227.5%' },
  },
  {
    name: 'Fraxswap FRAX/IQ',
    icon: UniswapEllipse,
    link: 'https://everipedia.com',
    status: 'OFF',
    chain: { label: 'Ethereum', icon: Ethereum },
    gauge: null,
    reward_tokens: [
      { label: 'IQ', icon: IQLogo },
      { label: 'FXS', icon: FXSLogo },
    ],
    tvl: '$0.06M',
    apr: null,
  },
]
const bStyles = {
  borderLeft: 'solid 1px',
  borderColor: 'divider2',
}
const UNSORTED_COLUMNS = ['reward_tokens']

const Staking: NextPage = () => {
  const tableColumns = React.useMemo(
    () => TABLE_KEYS.map((k) => ({ Header: k.label, accessor: k.id })),
    [],
  )

  const data: Dict[] = React.useMemo(
    () =>
      stakings.map((rec) => ({
        name: (
          <Flex align="center" gap="1.5">
            {rec.icon && <rec.icon boxSize="5" />}
            <Link href={rec.link} isExternal>
              {rec.name}
              <ExternalLinkIcon ml="1.5" mt="-2" color="brandText" />
            </Link>
          </Flex>
        ),
        status: (
          <chakra.span color={rec.status === 'LIVE' ? 'brand.800' : ''}>
            {rec.status}
          </chakra.span>
        ),
        chain: (
          <Flex align="center" gap="1">
            {rec.chain.icon && <rec.chain.icon boxSize="6" />}
            <span>{rec.chain.label}</span>{' '}
          </Flex>
        ),
        gauge: <chakra.span color="brand.800">{rec.gauge || '-'}</chakra.span>,
        reward_tokens: (
          <Flex gap="6">
            {rec.reward_tokens.map((token) => (
              <Flex align="center" gap="1" key={token.label}>
                {token.icon && <token.icon boxSize="6" />}
                <span>{token.label}</span>{' '}
              </Flex>
            ))}
          </Flex>
        ),
        tvl: <chakra.span>{rec.tvl || '-'}</chakra.span>,
        apr: (
          <Flex align="center" justifyContent="space-evenly" gap="5">
            <span>{rec.apr?.Base || '-'}</span> |
            <span>{rec.apr?.Max || '-'}</span>
          </Flex>
        ),
      })),
    [],
  )

  const { getTableProps, headerGroups } = useTable(
    { columns: tableColumns, data },
    useSortBy,
  )

  return (
    <>
      <NextSeo
        title="Staking Page"
        openGraph={{
          title: 'IQ Staking',
          description: 'Earn IQ token rewards and NFT raffles.',
        }}
      />
      <Flex py={{ base: '5', lg: '6' }} direction="column" gap="6">
        <PageHeader
          header="Staking"
          body="Earn IQ token rewards and NFT raffles"
        />
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
        bg="cardBg2"
      >
        <StakeCard title="Annual percentage rate" value="44.18%" />

        <StakeCard title="IQ Price" value="$0.0046" {...bStyles} />
        <StakeCard
          title="Total volume locked"
          value="409,581,181 IQ"
          {...{ lg: bStyles }}
        />
        <StakeCard title="Estimated Holders" value="164,025" {...bStyles} />
      </SimpleGrid>

      <chakra.div
        overflowX="auto"
        border="solid 1px"
        borderColor="divider2"
        rounded="lg"
        mt="16"
        fontSize="sm"
      >
        <Table fontWeight="semibold" {...getTableProps()}>
          <Thead border="none" bg="cardBg2">
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: Dict) => (
                  <Th
                    border="none"
                    whiteSpace="nowrap"
                    py="5"
                    textTransform="none"
                    fontSize="sm"
                    fontWeight="semibold"
                    color="tooltipColor"
                    {...(!UNSORTED_COLUMNS.includes(column.id) &&
                      column.getHeaderProps(column.getSortByToggleProps()))}
                  >
                    <Flex align="center">
                      {column.render('Header')}
                      {!UNSORTED_COLUMNS.includes(column.id) && (
                        <chakra.span pl="1">
                          <SortDown
                            color={column.isSortedDesc ? 'white' : ''}
                          />
                          <SortUp
                            color={
                              column.isSortedDesc || !column.isSorted
                                ? ''
                                : 'white'
                            }
                          />
                        </chakra.span>
                      )}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          {/* <Tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <Tr whiteSpace="nowrap" {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <Td fontSize="sm" border="none" {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              )
            })}
          </Tbody> */}
        </Table>
      </chakra.div>
    </>
  )
}

export default Staking
