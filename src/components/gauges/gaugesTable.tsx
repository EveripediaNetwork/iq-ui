import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { Gauge, Vote } from '@/types/gauge'
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
  Box,
  Text,
  Checkbox,
} from '@chakra-ui/react'
import { setCurrentGauge } from '@/store/slices/gauges-slice'
import { useAccount } from 'wagmi'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import VotingControls from './votingControls'

const GaugesTable = () => {
  const [, setSelectedIndex] = useState(0)
  const { address } = useAccount()
  const gauges: Gauge[] = useAppSelector((state) => state.gauges.gauges)
  const votes: Vote[] = useAppSelector(
    (state: { gauges: { votes: any } }) => state.gauges.votes,
  )
  const currentGauge = useSelector(
    (state: RootState) => state.gauges.currentGauge,
  )
  const dispatch = useAppDispatch()

  const handleSetSelectedGauge = (index: number) => {
    setSelectedIndex(index)
    dispatch(setCurrentGauge(gauges[index]))
  }

  const getUserWeight = (
    gaugeAddress: string | undefined,
    userAddress: string | undefined,
  ) => {
    const vote = votes?.find(
      (v) => v.gaugeAddress === gaugeAddress && v.user === userAddress,
    )
    return vote ? vote.weight / 100 : 0
  }

  return (
    <Flex gap="4" mt={7} w={{ base: 'full', lg: '90%' }} flexDirection="column">
      <VotingControls
        currentWeight={getUserWeight(currentGauge?.gaugeAddress, address)}
      />
      <Grid mt={4} templateColumns="repeat(6, 1fr)" gap={4}>
        <GridItem colSpan={{ base: 6, md: 3, lg: 2 }}>
          <TableContainer border="solid 1px" borderColor="divider" rounded="lg">
            <Table>
              <Thead border="none" bg="cardBg">
                <Tr>
                  <Th whiteSpace="nowrap" fontWeight="bold" textAlign="initial">
                    <Text color="text1"> Name</Text>
                  </Th>
                  <Th whiteSpace="nowrap" fontWeight="bold" textAlign="initial">
                    <Text color="text1">Weight</Text>
                  </Th>
                </Tr>
              </Thead>
              {gauges?.map((g: Gauge, i) => (
                  <>
                    <Tr
                      key={i}
                      onClick={() => handleSetSelectedGauge(i)}
                      fontWeight="medium"
                      cursor="pointer"
                    >
                      <Td>
                        <Flex align="center" fontWeight="medium">
                          <Checkbox
                            isChecked={
                              currentGauge?.gaugeAddress === g.gaugeAddress
                            }
                            size="sm"
                            colorScheme="pink"
                            mr={3}
                          />
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
                      <Td>{getUserWeight(g.gaugeAddress, address)}%</Td>
                    </Tr>
                  </>
                ))}
            </Table>
          </TableContainer>
        </GridItem>
        <GridItem colSpan={{ base: 6, md: 3, lg: 3 }} mt={{ base: 6, md: 0 }}>
          <Box border="solid 1px" borderColor="divider" rounded="lg" mb={6}>
            <Box roundedTop="lg" bg="cardBg" py="2" px="2">
              <Text ml="2">Voting Details</Text>
            </Box>
            <Text
              fontSize="sm"
              px={{ base: 4, lg: 8 }}
              textAlign="center"
              my={15}
              fontWeight="thin"
            >
              Before voting, ensure to Select the gauge you want to allocate
              weights to.
            </Text>
          </Box>
        </GridItem>
      </Grid>
    </Flex>
  )
}

export default GaugesTable
