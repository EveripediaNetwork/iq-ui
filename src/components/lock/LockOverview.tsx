import { useLockOverview } from '@/hooks/useLockOverview'
import React, { useState, useEffect } from 'react'
import * as Humanize from 'humanize-plus'
import { calculateAPR, getNumberOfHiIQHolders } from '@/utils/LockOverviewUtils'
import { useErc20 } from '@/hooks/useErc20'
import StakeCard from '../cards/StakeCard'
import StakeOverviewWrapper from '../elements/stakeCommon/StakeOverviewWrapper'

const LockOverview = () => {
  const { totalHiiqSupply, userTotalIQLocked } = useLockOverview()
  const { tvl } = useErc20()
  const [holders, setHolders] = useState(0)

  useEffect(() => {
    const getHiIQHolders = async () => {
      const data = await getNumberOfHiIQHolders()
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
          hasPopUp
          label='Total hiiq supply'
        />
        <StakeCard
          title="Total volume"
          subtitle="locked"
          value={`${Humanize.formatNumber(tvl, 2)} IQ`}
          borderLeft={{ base: 'none', md: 'solid 1px' }}
          borderColor={{ md: 'divider2' }}
          hasPopUp
          label='Total volume locked'
        />

        <StakeCard
          title="Average lock time"
          value={`${holders}`}
          borderLeftWidth={{ base: '0', md: '1px' }}
          {...bStyles}
          hasPopUp
          label='Average lock time'
        />

        <StakeCard
          title="Est. Yield per week "
          value={`${holders}`}
          borderLeftWidth={{ base: '0', md: '1px' }}
          {...bStyles}
          hasPopUp
          label='Est. Yield per week'
        />
      </>
    </StakeOverviewWrapper>
  )
}

export default LockOverview
