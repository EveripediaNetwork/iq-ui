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
  Select,
} from '@chakra-ui/react'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import shortenAccount from '@/utils/shortenAccount'
import { setVotes } from '@/store/slices/gauges-slice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { Vote, WEEKS } from '@/types/gauge'
import { useAccount } from 'wagmi'
import GaugesVotesDistribution from './gaugesVotesDistribution'

type GaugesVotesTableType = {
  selectedWeek: WEEKS
}

const GaugesVotesTable = ({ selectedWeek }: GaugesVotesTableType) => {
  const { getNextVotingRoundRaw, events } = useGaugeCtrl()
  const { address, isDisconnected } = useAccount()
  const [timeTotal, setTimeTotal] = useState<number>()
  const [week, setWeek] = useState<WEEKS | string>('myWeight')
  const [, setLoaded] = useState(true)
  const dispatch = useAppDispatch()
  const votes: Vote[] = useAppSelector(
    (state: { gauges: { votes: any } }) => state.gauges.votes,
  )
  useEffect(() => {
    const waitForTheEvents = async () => {
      setLoaded(false)
      dispatch(setVotes([]))
      const startBlock = week === WEEKS.LAST_WEEK ? 7863919 : 8039320
      const endBlock = week === WEEKS.LAST_WEEK ? 8039320 : 8135720
      const eventsResult = await events(startBlock, endBlock)
      const filteredEventsResult = eventsResult?.filter((obj: any) => {
        return obj.user === address
      })
      if (eventsResult) {
        if (week !== 'myWeight') {
          dispatch(setVotes(eventsResult))
        }
        dispatch(setVotes(filteredEventsResult))
      }
      setLoaded(true)
    }

    if (timeTotal) waitForTheEvents()
  }, [timeTotal, selectedWeek, week])

  useEffect(() => {
    setTimeTotal(getNextVotingRoundRaw())
  }, [])

  const handleFilterWeights = async (value: WEEKS) => {
    setWeek(value)
  }

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
                          href={`https://etherscan.io/address/${v.user}`}
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
        <Flex direction="column" w={{ base: '100%' }}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justifyContent="flex-end"
            w="100%"
          >
            <Select
              onChange={event =>
                handleFilterWeights(event.target.value as WEEKS)
              }
              maxW={{ base: 'full', md: '160px' }}
            >
              <option disabled={isDisconnected} value="myWeight">
                My weight
              </option>
              <option value={WEEKS.LAST_WEEK}>Protocol (Now)</option>
              <option value={WEEKS.THIS_WEEK}>Protocol (Future)</option>
            </Select>
          </Flex>

          <GaugesVotesDistribution />
        </Flex>
      </GridItem>
    </Grid>
  )
}

export default memo(GaugesVotesTable)
