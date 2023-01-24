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
  Box,
  Link
} from '@chakra-ui/react'
import { setCurrentGauge } from '@/store/slices/gauges-slice'
import VotingControls from './votingControls'
import shortenAccount from '@/utils/shortenAccount'
import DisplayAvatar from '../elements/Avatar/Avatar'

const GaugesTable = () => {
  const [, setSelectedIndex] = useState(0)
  const gauges: Gauge[] = useAppSelector(state => state.gauges.gauges)
  const dispatch = useAppDispatch()

  const handleSetSelectedGauge = (index: number) => {
    setSelectedIndex(index)
    dispatch(setCurrentGauge(gauges[index]))
  }

  return (
    <Box>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        mt="8"
        gap={{ base: 10, '2xl': 18 }}
      >
        <Box w="full" overflowX="auto">
          <TableContainer border="solid 1px" borderColor="divider" rounded="lg">
            <Table
              w={{
                lg: 'full',
                '2xl': 630,
              }}
            >
              <Thead border="none" bg="cardBg">
                <Td whiteSpace="nowrap" fontWeight="medium" textAlign="initial">
                  Name
                </Td>
                <Td whiteSpace="nowrap" fontWeight="medium" textAlign="initial">
                  Address
                </Td>
                <Td whiteSpace="nowrap" fontWeight="medium" textAlign="initial">
                  Gauge Address
                </Td>
              </Thead>
              {gauges !== undefined &&
                gauges.map((g: Gauge, i) => (
                  <Tr
                    key={i}
                    onClick={() => handleSetSelectedGauge(i)}
                    fontWeight="medium"
                  >
                    <Td>{g.name}</Td>
                    <Td>
                    <Flex align="center" gap="18px" fontWeight="medium">
                          <DisplayAvatar address={g.address} />
                          <Link
                            href={`https://etherscan.io/address/${g.address}`}
                            isExternal
                            fontSize="sm"
                            fontWeight="medium"
                          >
                            {shortenAccount(g.address)}
                          </Link>
                        </Flex>
                      </Td>
                    <Td>{g.gaugeAddress}</Td>
                  </Tr>
                ))}
            </Table>
          </TableContainer>
        </Box>
      </Flex>
      <Box mt={8}>
        <VotingControls />
      </Box>
    </Box>
  )
}

export default GaugesTable
