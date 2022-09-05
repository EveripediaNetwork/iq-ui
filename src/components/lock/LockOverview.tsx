import { useLockOverview } from '@/hooks/useLockOverview'
import { SimpleGrid} from '@chakra-ui/layout'
import React from 'react'
import * as Humanize from 'humanize-plus'
import { calculate4YearsYield, calculateAPR } from '@/utils/LockOverviewUtils'
import { useErc20 } from '@/hooks/useErc20'
import StakeCard from '../cards/StakeCard'
import { useStatsData } from '@/utils/use-stats-data'
import { Spinner, } from '@chakra-ui/react'


const LockOverview = () => {
  const { totalHiiqSupply, userTotalIQLocked } = useLockOverview()
  const { tvl } = useErc20()
  const { data } = useStatsData()

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
      bg="lightCard"
    >
      <StakeCard
        title="Number of holders"
        value={`${data.hiiq?.holders ? data.hiiq?.holders: <Spinner variant="primary" role="status" size="sm">
        <span>Loading...</span>
      </Spinner> }`}
      />
      <StakeCard
        title="Total value locked"
        value={`${Humanize.formatNumber(tvl, 2)} IQ`}
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
