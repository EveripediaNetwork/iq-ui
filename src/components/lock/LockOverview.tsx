import { useLockOverview } from '@/hooks/useLockOverview'
import { SimpleGrid } from '@chakra-ui/layout'
import React, { useState, useEffect } from 'react'
import * as Humanize from 'humanize-plus'
import { calculateAPR, getNumberOfHiIQHolders } from '@/utils/LockOverviewUtils'
import { useErc20 } from '@/hooks/useErc20'
import StakeCard from '../cards/StakeCard'

const LockOverview = () => {
  const { totalHiiqSupply, userTotalIQLocked } = useLockOverview()
  const { tvl } = useErc20()
  const [holders, setHolders] = useState(0)

  useEffect(() => {
    const getHiIQHolders = async () => {
      const data = await getNumberOfHiIQHolders()
      setHolders(data)
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
        title="APR"
        value={`${Humanize.formatNumber(
          calculateAPR(totalHiiqSupply, userTotalIQLocked, 4),
          2,
        )} %`}
        hasPopUp
      />
      <StakeCard
        title="Total HiIQ"
        value={`${Humanize.formatNumber(totalHiiqSupply, 2)}`}
        {...bStyles}
      />
      <StakeCard
        title="Total volume "
        subtitle="locked"
        value={`${Humanize.formatNumber(tvl, 2)} IQ`}
        borderLeft={{ base: 'none', md: 'solid 1px' }}
        borderColor={{ md: 'divider2' }}
      />

      <StakeCard
        title="No of HiIQ Holders"
        value={`${holders}`}
        borderLeftWidth={{ base: '0', md: '1px' }}
        {...bStyles}
      />
    </SimpleGrid>
  )
}

export default LockOverview
