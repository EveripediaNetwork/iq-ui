import React from 'react'
import { Flex } from '@chakra-ui/react'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { getUnusedWeight } from '@/utils/gauges.util'
import { useRewardsDistributor } from '@/hooks/useRewardsDistributor'
import { useAppSelector } from '@/store/hook'
import { Gauge } from '@/types/gauge'
import config from '@/config'
import { useAccount } from 'wagmi'
import { useBrainy } from '@/hooks/useBrainy'
import { BRAINIES_MAX_SUPPLY } from '@/data/GaugesConstants'
import StakeCard from '../cards/StakeCard'

const bStyles = {
  // borderLeft: 'solid 1px',
  // borderColor: 'divider2',
  minWidth: '212px',
}

const HeadingCards = () => {
  const currentGauge: Gauge | undefined = useAppSelector(
    state => state.gauges.currentGauge,
  )
  const { isConnected } = useAccount()
  const { totalSupply } = useBrainy()
  const { userVotingPower, nextVotingRound } = useGaugeCtrl()
  const { weeklyReward } = useRewardsDistributor({
    gaugeAddress:
      currentGauge !== undefined
        ? currentGauge.gaugeAddress
        : config.nftFarmAddress,
  })

  return (
    <Flex
      // columns={{ base: 2, md: 4 }}
      px={{ base: '8', md: '2' }}
      py="3"
      mt="1"
      // spacingY="13px"
      justifyContent="space-evenly"
      border="solid 1px"
      flexWrap="wrap"
      alignItems="center"
      borderColor="divider"
      // minChildWidth="212px"
      // templateColumns="repeat(5, minmax(0, 1fr))"
      rounded="lg"
      bg="lightCard"
    >
      <StakeCard
        {...bStyles}
        title="Max Supply"
        value={String(BRAINIES_MAX_SUPPLY) || '0'}
      />
      <StakeCard
        {...bStyles}
        title="Total Minted"
        value={String(totalSupply) || '0'}
      />
      {isConnected ? (
        <StakeCard
          {...bStyles}
          title="Unused Weight"
          value={getUnusedWeight(userVotingPower).unused}
        />
      ) : null}
      <StakeCard
        {...bStyles}
        title="Weekly Reward"
        value={weeklyReward || '0'}
      />
      <StakeCard
        {...bStyles}
        title="Voting round ends in"
        value={nextVotingRound || ''}
      />
    </Flex>
  )
}

export default HeadingCards
