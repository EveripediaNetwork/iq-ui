import React from 'react'
import { useAppSelector } from '@/store/hook'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
} from '@chakra-ui/react'

const GaugesVotesTable = () => {
  const gauges = useAppSelector(state => state.gauges.gauges)

  return (
    <TableContainer>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Address</Th>
            <Th>Weight</Th>
          </Tr>
        </Thead>
        <Tbody>
          {gauges.map(g => (
            <Tr>
              <Td>{g.name}</Td>
              <Td>{g.address}</Td>
              <Td>{g.gaugeAddress}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default GaugesVotesTable
