import React from 'react'
import { SimpleGrid } from '@chakra-ui/react'
import { useNFTGauge } from '@/hooks/useNFTGauge'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { getUnusedWeight } from '@/utils/gauges.util'
import { useRewardsDistributor } from '@/hooks/useRewardsDistributor'
import { useAppSelector } from '@/store/hook'
import { Gauge } from '@/types/gauge'
import StakeCard from '../cards/StakeCard'

const bStyles = {
  borderLeft: 'solid 1px',
  borderColor: 'divider2',
}

const HeadingCards = () => {
  const currentGauge: Gauge | undefined = useAppSelector(
    state => state.gauges.currentGauge,
  )
  const { earned } = useNFTGauge()
  const { userVotingPower, nextVotingRound } = useGaugeCtrl()
  const { weeklyReward } = useRewardsDistributor({
    gaugeAddress: currentGauge !== undefined ? currentGauge.gaugeAddress : '',
  })

  return (
    <SimpleGrid
      columns={{ base: 2, md: 4 }}
      px={{ base: '8', md: '2' }}
      py="3"
      mt="1"
      spacingY="13px"
      justifyContent="space-between"
      border="solid 1px"
      alignItems="center"
      borderColor="divider"
      templateColumns="repeat(5, minmax(0, 1fr))"
      rounded="lg"
      bg="lightCard"
    >
      <StakeCard title="Earned" value={String(earned) || '0'} />
      <StakeCard
        {...bStyles}
        title="Unused Weight"
        value={getUnusedWeight(userVotingPower).unused}
      />
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
      <StakeCard
        {...bStyles}
        title="Contracts"
        value={`Rewards Distributor \n GaugeController`}
      />
    </SimpleGrid>
  )
}

export default HeadingCards
