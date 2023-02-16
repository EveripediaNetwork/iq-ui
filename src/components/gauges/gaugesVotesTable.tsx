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
import { Gauge, Vote, WEEKS } from '@/types/gauge'
import { useAccount } from 'wagmi'
import { checkDateIsBetweenDateRange } from '@/utils/gauges.util'
import GaugesVotesDistribution from './gaugesVotesDistribution'

const GaugesVotesTable = () => {
  const { getNextVotingRoundRaw, events } = useGaugeCtrl()
  const { address, isDisconnected } = useAccount()
  const [timeTotal, setTimeTotal] = useState<number>()
  const [filteredVotes, setFilteredVotes] = useState<Vote[]>([])
  const dispatch = useAppDispatch()
  const [filter, setFilter] = useState(WEEKS.LAST_WEEK)
  const votes: Vote[] = useAppSelector(
    (state: { gauges: { votes: any } }) => state.gauges.votes,
  )

  const gauges: Gauge[] = useAppSelector(state => state.gauges.gauges)

  const getGaugeName = (gaugeAddr: string) => {
    const gauge = gauges?.find(g => g.gaugeAddress === gaugeAddr)
    return gauge?.name
  }

  useEffect(() => {
    const waitForTheEvents = async () => {
      const eventsResult = await events()
      if (eventsResult) {
        const filteredEventsResult = eventsResult?.filter((obj: Vote) => {
          return checkDateIsBetweenDateRange(obj.voteDate, WEEKS.LAST_WEEK)
        })
        setFilteredVotes(filteredEventsResult)
        dispatch(setVotes(eventsResult))
      }
    }
    if (timeTotal && votes.length < 1) waitForTheEvents()
  }, [timeTotal, votes])

  useEffect(() => {
    setTimeTotal(getNextVotingRoundRaw())
  }, [])

  const filterEventByDate = (day: WEEKS) => {
    const filteredEventsResult = votes?.filter((obj: Vote) => {
      return checkDateIsBetweenDateRange(obj.voteDate, day)
    })
    setFilteredVotes(filteredEventsResult)
    setFilter(day)
  }

  const handleFilter = (date: WEEKS) => {
    if (date === WEEKS.THIS_WEEK || date === WEEKS.LAST_WEEK) {
      filterEventByDate(date)
      return
    }
    const filteredEventsResult = votes?.filter((obj: any) => {
      return obj.user === address
    })
    setFilteredVotes(filteredEventsResult)
    setFilter(date)
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
            {filteredVotes.map((v: Vote) => (
              <Tr key={v.gaugeAddress}>
                <Td>
                  <Flex align="center" gap="18px" fontWeight="medium">
                    <Link
                      href={`https://etherscan.io/address/${v.user}`}
                      isExternal
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      {getGaugeName(v.gaugeAddress)}
                    </Link>
                  </Flex>
                </Td>
                <Td>
                  <Text fontSize="sm">{shortenAccount(v.gaugeAddress)}</Text>
                </Td>
                <Td>
                  <Text fontSize="sm">{v.weight}</Text>
                </Td>
              </Tr>
            ))}
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
              onChange={event => handleFilter(event.target.value as WEEKS)}
              maxW={{ base: 'full', md: '160px' }}
              defaultValue={filter}
            >
              <option disabled={isDisconnected} value="MY_WEIGHT">
                My Weight
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
