import React, { memo, useEffect, useState } from 'react'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Flex,
  Box,
  Text,
  Link,
} from '@chakra-ui/react'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import shortenAccount from '@/utils/shortenAccount'
import { setVotes } from '@/store/slices/gauges-slice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { Vote, WEEKS } from '@/types/gauge'
import GaugesVotesDistribution from './gaugesVotesDistribution'
import DisplayAvatar from '../elements/Avatar/Avatar'

type GaugesVotesTableType = {
  selectedWeek: WEEKS
}

const GaugesVotesTable = ({ selectedWeek }: GaugesVotesTableType) => {
  const { getNextVotingRoundRaw, events } = useGaugeCtrl()
  const [timeTotal, setTimeTotal] = useState<number>()
  const [, setLoaded] = useState(true)
  const dispatch = useAppDispatch()
  const votes: Vote[] = useAppSelector(state => state.gauges.votes)
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
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      mt="8"
      gap={{ base: 10, '2xl': 18 }}
    >
      <Box overflowX="auto">
        <TableContainer border="solid 1px" borderColor="divider" rounded="lg">
          <Table
            w={{
              lg: 630,
            }}
          >
            <Thead border="none" bg="cardBg">
              <Td whiteSpace="nowrap" fontWeight="medium">
                Users
              </Td>
              <Td whiteSpace="nowrap" fontWeight="medium">
                Vote Date
              </Td>
              <Td whiteSpace="nowrap" fontWeight="medium">
                Guage
              </Td>
              <Td whiteSpace="nowrap" fontWeight="medium">
                Weight
              </Td>
            </Thead>

            {votes
              ? votes.map((v: any, idx: number) => (
                  <Tr key={idx}>
                    <Td>
                      <Flex align="center" gap="18px" fontWeight="medium">
                        <DisplayAvatar address={v.address} />
                        <Link
                          href={`https://etherscan.io/address/${v.address}`}
                          isExternal
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          {shortenAccount(v.user)}
                        </Link>
                      </Flex>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{v.voteDate}</Text>
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
      </Box>
      <Box
        display="flex"
        mt={{ lg: -2 }}
        justifyContent="center"
        alignItems="center"
      >
        <GaugesVotesDistribution />
      </Box>
    </Flex>
  )
}

export default memo(GaugesVotesTable)
