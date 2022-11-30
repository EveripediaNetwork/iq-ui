import React, { memo, useEffect, useState } from 'react'
// import { useAppSelector } from '@/store/hook'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
} from '@chakra-ui/react'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'

const GaugesVotesTable = () => {
  // const gauges = useAppSelector(state => state.gauges.gauges)
  const { events } = useGaugeCtrl()
  const [votes, setVotes] = useState<any>()

  useEffect(() => {
    const waitForTheEvents = async () => {
      setVotes(await events())
    }

    waitForTheEvents()
  }, [events])

  return (
    <TableContainer>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>User</Th>
            <Th>Vote Date</Th>
            <Th>Gauge</Th>
          </Tr>
        </Thead>
        <Tbody>
          {votes ? votes.map((v: any, idx: number) => (
            <Tr key={idx}>
              <Td>{v.user}</Td>
              <Td>{v.voteDate.toString()}</Td>
              <Td>{v.gaugeAddress}</Td>
            </Tr>
          )) : null}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default memo(GaugesVotesTable)
