import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
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
import { setCurrentGauge } from '@/store/slices/gauges-slice'

const GaugesTable = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const gauges: Gauge[] = useAppSelector(state => state.gauges.gauges)
  const dispatch = useAppDispatch()

  const handleSetSelectedGauge = (index: number) => {
    setSelectedIndex(index)
    dispatch(setCurrentGauge(gauges[index]))
  }

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
                onClick={() => handleSetSelectedGauge(index)}
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
