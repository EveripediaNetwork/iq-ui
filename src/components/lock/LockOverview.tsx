import { useLockOverview } from '@/hooks/useLockOverview'
import React, { useState, useEffect } from 'react'
import * as Humanize from 'humanize-plus'
import {
  calculateAPR,
  getHiIQTransactions,
  getNumberOfHiIQHolders,
} from '@/utils/LockOverviewUtils'
import { useErc20 } from '@/hooks/useErc20'
import StakeCard from '../cards/StakeCard'
import StakeOverviewWrapper from '../elements/stakeCommon/StakeOverviewWrapper'
import { calculateEstimatedYieldPerWeek } from '@/data/LockConstants'
import { useGetIqPriceQuery } from '@/services/iqPrice'
import { useTranslations } from 'next-intl'

const LockOverview = () => {
  const { totalHiiqSupply, userTotalIQLocked } = useLockOverview()
  const { tvl } = useErc20()
  const [holders, setHolders] = useState(0)
  const [averageLockTime, setAverageLockTime] = useState(0)
  const { data } = useGetIqPriceQuery('IQ')
  const rate = data?.response?.[0]?.quote?.USD?.price || 0.0
  const t = useTranslations('hiiq.lockOverview')

  useEffect(() => {
    const getHiIQHolders = async () => {
      const data = await getNumberOfHiIQHolders()
      const averageStakeDays = await getHiIQTransactions()
      setAverageLockTime(averageStakeDays)
      setHolders(data.holdersCount)
    }
    if (!holders) {
      getHiIQHolders()
    }
  }, [holders])
  const bStyles = {
    borderLeft: 'solid 1px',
    borderColor: 'divider2',
  }

  return (
    <StakeOverviewWrapper>
      <>
        <StakeCard
          title={t('apr')}
          value={`${Humanize.formatNumber(
            calculateAPR(totalHiiqSupply, userTotalIQLocked, 4),
            2,
          )} %`}
          hasPopUp
          label={t('aprTooltip')}
        />
        <StakeCard
          title={t('totalHiiq')}
          value={`${Humanize.formatNumber(totalHiiqSupply, 2)}`}
          {...bStyles}
        />
        <StakeCard
          title={t('totalVolumeLocked')}
          value={`${Humanize.formatNumber(tvl, 2)} IQ`}
          borderLeft={{ base: 'none', md: 'solid 1px' }}
          borderColor={{ md: 'divider2' }}
          hasPopUp
          label={t('volumeLockedTooltip')}
        />
        <StakeCard
          title={t('averageLockTime')}
          value={`${Humanize.formatNumber(averageLockTime, 1)} ${t('years')}`}
          borderLeft={{ base: 'solid 1px' }}
          borderColor={{ base: 'divider2' }}
          hasPopUp
          label={t('averageLockTooltip')}
        />
        <StakeCard
          title={t('estimatedYield')}
          value={`${Humanize.formatNumber(
            calculateEstimatedYieldPerWeek() * rate,
            2,
          )}`}
          borderLeft={{ base: 'none', md: 'solid 1px' }}
          borderColor={{ md: 'divider2' }}
          hasPopUp
          label={t('estimatedYieldTooltip')}
          isLastItem={true}
        />
      </>
    </StakeOverviewWrapper>
  )
}

export default LockOverview
