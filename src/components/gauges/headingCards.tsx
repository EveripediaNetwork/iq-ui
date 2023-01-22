import React from 'react'
import { Flex, SimpleGrid } from '@chakra-ui/react'
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
  borderLeft: 'solid 1px',
  borderColor: 'divider2',
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
    <SimpleGrid
      columns={{ base: 3, md: 5 }}
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
        title="Total Supply"
        value={String(BRAINIES_MAX_SUPPLY) || '0'}
      />
      <StakeCard
        title="Total Minted"
        value={String(totalSupply) || '0'}
        {...bStyles}
      />

      <StakeCard
        title="Unused Weight"
        value={isConnected ? getUnusedWeight(userVotingPower).unused : "0"}
        borderLeftWidth={{ base: '0', md: '1px' }}
        {...bStyles}
      />

      <StakeCard
        title="Weekly Reward"
        value={weeklyReward || '0'}
        borderLeft={{ base: 'none', md: 'solid 1px' }}
        borderColor={{ md: 'divider2' }}
      />

      <StakeCard
        title="Voting timer"
        value={nextVotingRound || '00:00:00'}
        borderLeftWidth={{ base: '0', md: '1px' }}
        {...bStyles}
      />
    </SimpleGrid>
  )
}

export default HeadingCards
