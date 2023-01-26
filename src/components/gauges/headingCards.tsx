import React from 'react'
import { SimpleGrid } from '@chakra-ui/react'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { getUnusedWeight } from '@/utils/gauges.util'
import { useRewardsDistributor } from '@/hooks/useRewardsDistributor'
import { useAppSelector } from '@/store/hook'
import { Gauge } from '@/types/gauge'
import config from '@/config'
import { useAccount } from 'wagmi'
import { BRAINIES_MAX_SUPPLY } from '@/data/GaugesConstants'
import StakeCard from '../cards/StakeCard'

const HeadingCards = () => {
  const currentGauge: Gauge | undefined = useAppSelector(
    state => state.gauges.currentGauge,
  )
  const { isConnected } = useAccount()
  const { userVotingPower, nextVotingRound } = useGaugeCtrl()
  const { weeklyReward } = useRewardsDistributor({
    gaugeAddress:
      currentGauge !== undefined
        ? currentGauge.gaugeAddress
        : config.nftFarmAddress,
  })

  return (
    <SimpleGrid
      columns={{ base: 2, md: 4 }}
      px={{ base: '2' }}
      py="3"
      mt="1"
      spacingY="13px"
      border="solid 1px"
      borderColor="divider"
      rounded="lg"
      bg="lightCard"
    >
      <StakeCard
        title="HiiQ Balance"
        value={`${String(BRAINIES_MAX_SUPPLY)} HiIQ` || '0'}
      />

      <StakeCard
        title="Unused Weight"
        value={isConnected ? getUnusedWeight(userVotingPower).unused : '0%'}
      />

      <StakeCard
        title="Weekly Reward"
        value={`${weeklyReward} IQ` || '0'}
        borderLeft={{ base: 'none', md: 'solid 1px' }}
        borderColor={{ md: 'divider2' }}
      />

      <StakeCard title="Voting timer" value={nextVotingRound || '00:00:00'} />
    </SimpleGrid>
  )
}

export default HeadingCards
