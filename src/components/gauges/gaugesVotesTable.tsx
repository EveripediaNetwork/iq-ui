import React, { memo, useEffect, useState } from 'react'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
  Skeleton,
} from '@chakra-ui/react'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import shortenAccount from '@/utils/shortenAccount'
import { setVotes } from '@/store/slices/gauges-slice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { Vote, WEEKS } from '@/types/gauge'
// import {
//   LAST_WEEK_BLOCK_TIMESTAMPS,
//   THIS_WEEK_BLOCK_TIMESTAMPS,
// } from '@/data/GaugesConstants'
// import { getNearestBlock } from '@/utils/getNearestBlock'

type GaugesVotesTableType = {
  selectedWeek: WEEKS
}

const GaugesVotesTable = ({ selectedWeek }: GaugesVotesTableType) => {
  const { getNextVotingRoundRaw, events } = useGaugeCtrl()
  const [timeTotal, setTimeTotal] = useState<number>()
  const [loaded, setLoaded] = useState(true)
  const dispatch = useAppDispatch()
  const votes: Vote[] = useAppSelector(state => state.gauges.votes)

  useEffect(() => {
    const waitForTheEvents = async () => {
      setLoaded(false)

      dispatch(setVotes([]))

      // const { startBlockTimestamp, endBlockTimestamp } =
      //   selectedWeek === WEEKS.LAST_WEEK
      //     ? LAST_WEEK_BLOCK_TIMESTAMPS(Number(timeTotal))
      //     : THIS_WEEK_BLOCK_TIMESTAMPS(Number(timeTotal))

      // const startBlock = await getNearestBlock(startBlockTimestamp)
      // const endBlock = await getNearestBlock(endBlockTimestamp)

      const startBlock = selectedWeek === WEEKS.LAST_WEEK ? 7863919 : 8039320
      const endBlock = selectedWeek === WEEKS.LAST_WEEK ? 8039320 : 8105598
      const eventsResult = await events(startBlock, endBlock)
      if (eventsResult) dispatch(setVotes(eventsResult))

      setLoaded(true)
    }

    if (timeTotal) waitForTheEvents()
  }, [timeTotal, selectedWeek])

  useEffect(() => {
    setTimeTotal(getNextVotingRoundRaw())
  }, [])

  return (
    <Skeleton isLoaded={loaded}>
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
    </Skeleton>
  )
}

export default memo(GaugesVotesTable)
