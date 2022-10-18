import React, { useState } from 'react'
import { useAppSelector } from '@/store/hook'
import { Gauge } from '@/types/gauge'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react'

const GaugesTable = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const gauges: Gauge[] = useAppSelector(state => state.gauges.gauges)

  return (
    <TableContainer>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Address</Th>
            <Th>Gauge Address</Th>
          </Tr>
        </Thead>
        <Tbody>
          {gauges !== undefined &&
            gauges.map((g: Gauge, index: number) => (
              <Tr
                onClick={() => setSelectedIndex(index)}
                backgroundColor={selectedIndex === index ? 'pink' : 'white'}
                _hover={{ backgroundColor: 'pink', cursor: 'pointer' }}
              >
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

export default GaugesTable
