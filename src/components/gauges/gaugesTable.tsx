import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { Gauge } from '@/types/gauge'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Flex,
  Link,
  Grid,
  GridItem,
  Th,
} from '@chakra-ui/react'
import { setCurrentGauge } from '@/store/slices/gauges-slice'
import VotingControls from './votingControls'

const GaugesTable = () => {
  const [, setSelectedIndex] = useState(0)
  const gauges: Gauge[] = useAppSelector(state => state.gauges.gauges)
  const dispatch = useAppDispatch()

  const handleSetSelectedGauge = (index: number) => {
    setSelectedIndex(index)
    dispatch(setCurrentGauge(gauges[index]))
  }

  return (
    <Grid mt={7} templateColumns="repeat(6, 1fr)" gap={4}>
      <GridItem colSpan={{ base: 6, md: 3, lg: 2 }}>
        <TableContainer border="solid 1px" borderColor="divider" rounded="lg">
          <Table>
            <Thead border="none" bg="cardBg">
              <Tr>
                <Th whiteSpace="nowrap" fontWeight="medium" textAlign="initial">
                  Name
                </Th>
                <Th whiteSpace="nowrap" fontWeight="medium" textAlign="initial">
                  Weight
                </Th>
              </Tr>
            </Thead>
            {gauges !== undefined &&
              gauges.map((g: Gauge, i) => (
                <>
                  <Tr
                    key={i}
                    onClick={() => handleSetSelectedGauge(i)}
                    fontWeight="medium"
                    cursor="pointer"
                  >
                    <Td>
                      <Flex align="center" fontWeight="medium">
                        <Link
                          href={`https://etherscan.io/address/${g.address}`}
                          isExternal
                          fontSize="sm"
                          fontWeight="medium"
                          color="brandText"
                        >
                          {g.name}
                        </Link>
                      </Flex>
                    </Td>
                    <Td>22</Td>
                  </Tr>
                  <Tr h="10">
                    <Td />
                    <Td />
                  </Tr>
                  <Tr h="10">
                    <Td />
                    <Td />
                  </Tr>
                </>
              ))}
          </Table>
        </TableContainer>
      </GridItem>
      <GridItem colSpan={{ base: 6, md: 3, lg: 3 }}>
        <VotingControls />
      </GridItem>
    </Grid>
  )
}

export default GaugesTable
