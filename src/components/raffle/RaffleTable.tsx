import shortenAccount from '@/utils/shortenAccount'
import { Table, Thead, Tr, Th, Tbody, Td, Link, Flex } from '@chakra-ui/react'
import React from 'react'
import { Raffle } from '@/types/raffle'
import DisplayAvatar from '../elements/Avatar/Avatar'

const RaffleTable = ({
  filteredDetails,
  isShortened,
}: {
  filteredDetails: Raffle['details']
  isShortened: boolean | undefined
}) => {
  return (
    <Table fontWeight="semibold">
      <Thead border="none" bg="cardBg2">
        <Tr>
          {['Address', 'No of raffles won'].map((column) => (
            <Th
              border="none"
              whiteSpace="nowrap"
              py="5"
              textTransform="none"
              fontSize={{ base: 'xs', md: 'sm' }}
              color="grayText4"
              textAlign={column.includes('raffles') ? 'center' : 'left'}
              key={column}
            >
              {column}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {filteredDetails.map((r) => (
          <Tr whiteSpace="nowrap" key={r.address}>
            <Td fontSize="sm" color="tooltipColor" border="none">
              <Flex align="center" gap="18px" fontWeight="medium">
                <DisplayAvatar address={r.address} />
                <Link
                  href={`https://etherscan.io/address/${r.address}`}
                  isExternal
                  fontSize="sm"
                  fontWeight="medium"
                >
                  {!isShortened ? r.address : shortenAccount(r.address)}
                </Link>
              </Flex>
            </Td>
            <Td
              fontSize="sm"
              color="grayText3"
              textAlign="center"
              border="none"
            >
              {r.qty}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default RaffleTable
