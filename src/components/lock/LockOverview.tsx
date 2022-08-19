import { useLockOverview } from '@/hooks/useLockOverview'
import { SimpleGrid } from '@chakra-ui/layout'
import React from 'react'
import * as Humanize from 'humanize-plus'
import { calculate4YearsYield, calculateAPR } from '@/utils/LockOverviewUtils'
import StakeCard from '../cards/StakeCard'

const LockOverview = () => {
  const { totalHiiqSupply, userTotalIQLocked } = useLockOverview()

  const bStyles = {
    borderLeft: 'solid 1px',
    borderColor: 'divider2',
  }

  return (
    <SimpleGrid
      columns={{ base: 2, md: 4 }}
      px={{ base: '8', md: '2' }}
      py="3"
      mt="7"
      spacingY="13px"
      border="solid 1px"
      borderColor="divider"
      rounded="lg"
      bg="divider"
    >
      <StakeCard
        title="Total supply of HiIQ"
        value={`${Humanize.formatNumber(totalHiiqSupply, 2)} HIIQ`}
      />
      <StakeCard
        title="Total value locked"
        value={`${Humanize.formatNumber(userTotalIQLocked, 2)} IQ`}
        {...bStyles}
      />
      <StakeCard
        title="Yield earned over 4years"
        value={`${Humanize.formatNumber(
          calculate4YearsYield(totalHiiqSupply),
          2,
        )} %`}
        {...bStyles}
        borderLeftWidth={{ base: '0', md: '1px' }}
      />
      <StakeCard
        title="Annual percentage rate"
        value={`${Humanize.formatNumber(
          calculateAPR(totalHiiqSupply, userTotalIQLocked, null),
          2,
        )} %`}
        {...bStyles}
      />
    </SimpleGrid>
  )
}

export default LockOverview
