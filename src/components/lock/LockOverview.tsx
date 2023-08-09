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
import { useIQRate } from '@/hooks/useRate'

const LockOverview = () => {
  const { totalHiiqSupply, userTotalIQLocked } = useLockOverview()
  const { tvl } = useErc20()
  const [holders, setHolders] = useState(0)
  const [averageLockTime, setAverageLockTime] = useState(0)
  const { rate } = useIQRate()

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
          title="APR"
          value={`${Humanize.formatNumber(
            calculateAPR(totalHiiqSupply, userTotalIQLocked, 4),
            2,
          )} %`}
          hasPopUp
          label={`
                  Assumes 4 HiIQ = 1 IQ (i.e 1 IQ locked for 4 years). 
                  Calculated based on the current IQ emissions rate (does not factor in future halvenings). \n 
                  IQ emissions halve annually on Nov. 1.
                `}
        />
        <StakeCard
          title="Total HiIQ"
          value={`${Humanize.formatNumber(totalHiiqSupply, 2)}`}
          {...bStyles}
        />
        <StakeCard
          title="Total volume locked"
          value={`${Humanize.formatNumber(tvl, 2)} IQ`}
          borderLeft={{ base: 'none', md: 'solid 1px' }}
          borderColor={{ md: 'divider2' }}
          hasPopUp
          label="Total Volume locked  is the total volume of IQ locked in the pool"
        />

        <StakeCard
          title="Average lock time"
          value={`${Humanize.formatNumber(averageLockTime, 1)} years`}
          borderLeft={{ base: 'solid 1px' }}
          borderColor={{ base: 'divider2' }}
          hasPopUp
          label="Average lock time is the average approximate value of the total no of years users are staking"
        />

        <StakeCard
          title="Est. Yield per week "
          value={`$${Humanize.formatNumber(
            calculateEstimatedYieldPerWeek() * rate,
            2,
          )}`}
          borderLeft={{ base: 'none', md: 'solid 1px' }}
          borderColor={{ md: 'divider2' }}
          hasPopUp
          label="Estimated USD value of yield available to IQ holders per week"
          isLastItem={true}
        />
      </>
    </StakeOverviewWrapper>
  )
}

export default LockOverview
