import React from 'react'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { getUnusedWeight } from '@/utils/gauges.util'
import { useRewardsDistributor } from '@/hooks/useRewardsDistributor'
import { useAppSelector } from '@/store/hook'
import { Gauge } from '@/types/gauge'
import config from '@/config'
import { useAccount } from 'wagmi'
import { useLockOverview } from '@/hooks/useLockOverview'
import * as Humanize from 'humanize-plus'
import StakeCard from '../cards/StakeCard'
import StakeOverviewWrapper from '../elements/stakeCommon/StakeOverviewWrapper'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const HeadingCards = () => {
  const currentGauge: Gauge | undefined = useAppSelector(
    state => state.gauges.currentGauge,
  )
  const {currentStakingAddress} = useSelector((state: RootState) => state.nftFarms)
  const { isConnected } = useAccount()
  const { userVotingPower, nextVotingRound } = useGaugeCtrl()
  const { hiiqBalance } = useLockOverview()
  const { weeklyReward } = useRewardsDistributor({
    gaugeAddress:
      currentGauge !== undefined
        ? currentGauge.gaugeAddress
        : currentStakingAddress,
  })

  return (
    <StakeOverviewWrapper>
      <>
        <StakeCard
          title="HiIQ Balance"
          value={`${String(Humanize.formatNumber(hiiqBalance, 2))} HiIQ` || '0'}
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
      </>
    </StakeOverviewWrapper>
  )
}

export default HeadingCards
