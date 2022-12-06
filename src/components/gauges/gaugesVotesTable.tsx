import React, { memo, useEffect } from 'react'
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
import shortenAccount from '@/utils/shortenAccount'
import { setVotes } from '@/store/slices/gauges-slice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { Vote } from '@/types/gauge'

const GaugesVotesTable = () => {
  const { events } = useGaugeCtrl()
  const dispatch = useAppDispatch()
  const votes: Vote[] = useAppSelector(state => state.gauges.votes)

  useEffect(() => {
    const waitForTheEvents = async () => {
      const eventsResult = await events()
      if (eventsResult)
        dispatch(setVotes(eventsResult))
    }

    waitForTheEvents()
  }, [])

  return (
    <TableContainer>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>User</Th>
            <Th>Vote Date</Th>
            <Th>Gauge</Th>
            <Th>Weight</Th>
          </Tr>
        </Thead>
        <Tbody>
          {votes
            ? votes.map((v: any, idx: number) => (
              <Tr key={idx}>
                <Td>{shortenAccount(v.user)}</Td>
                <Td>{v.voteDate}</Td>
                <Td>{shortenAccount(v.gaugeAddress)}</Td>
                <Td>{v.weight}</Td>
              </Tr>
            ))
            : null}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default memo(GaugesVotesTable)
