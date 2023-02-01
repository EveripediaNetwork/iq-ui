import React, { memo, useEffect, useState } from 'react'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Flex,
  Text,
  Link,
  Grid,
  GridItem,
  Th,
} from '@chakra-ui/react'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import shortenAccount from '@/utils/shortenAccount'
import { setVotes } from '@/store/slices/gauges-slice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { Vote, WEEKS } from '@/types/gauge'
import GaugesVotesDistribution from './gaugesVotesDistribution'

type GaugesVotesTableType = {
  selectedWeek: WEEKS
}

const GaugesVotesTable = ({ selectedWeek }: GaugesVotesTableType) => {
  const { getNextVotingRoundRaw, events } = useGaugeCtrl()
  const [timeTotal, setTimeTotal] = useState<number>()
  const [, setLoaded] = useState(true)
  const dispatch = useAppDispatch()
  const votes: Vote[] = useAppSelector(state => state.gauges.votes)
  // console.log(votes)
  useEffect(() => {
    const waitForTheEvents = async () => {
      setLoaded(false)
      dispatch(setVotes([]))
      const startBlock = selectedWeek === WEEKS.LAST_WEEK ? 7863919 : 8039320
      const endBlock = selectedWeek === WEEKS.LAST_WEEK ? 8039320 : 8124853
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
    <Grid mt={7} templateColumns="repeat(6, 1fr)" gap={4}>
      <GridItem colSpan={{ base: 6, md: 3, lg: 3 }}>
        <TableContainer border="solid 1px" borderColor="divider" rounded="lg">
          <Table>
            <Thead border="none" bg="cardBg">
              <Tr>
                <Th whiteSpace="nowrap" fontWeight="medium" textAlign="initial">
                  Name
                </Th>
                <Th whiteSpace="nowrap" fontWeight="medium" textAlign="initial">
                  Guage
                </Th>
                <Th whiteSpace="nowrap" fontWeight="medium" textAlign="initial">
                  Weight
                </Th>
              </Tr>
            </Thead>
            {votes
              ? votes.map((v: any, idx: number) => (
                  <Tr key={idx}>
                    <Td>
                      <Flex align="center" gap="18px" fontWeight="medium">
                        <Link
                          href={`https://etherscan.io/address/${v.address}`}
                          isExternal
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          Brainies
                        </Link>
                      </Flex>
                    </Td>
                    <Td>
                      <Text fontSize="sm">
                        {shortenAccount(v.gaugeAddress)}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{v.weight}</Text>
                    </Td>
                  </Tr>
                ))
              : null}
          </Table>
        </TableContainer>
      </GridItem>
      <GridItem colSpan={{ base: 6, md: 3, lg: 3 }}>
        <GaugesVotesDistribution />
      </GridItem>
    </Grid>
  )
}

export default memo(GaugesVotesTable)
