import React, { useEffect } from "react"
import { SimpleGrid } from '@chakra-ui/react'
import { useNFTGauge } from '@/hooks/useNFTGauge'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { getUnusedWeight } from '@/utils/gauges.util'
import StakeCard from '../cards/StakeCard'

const bStyles = {
  borderLeft: 'solid 1px',
  borderColor: 'divider2',
}

const HeadingCards = () => {
  const { earned } = useNFTGauge()
  const { userVotingPower } = useGaugeCtrl()


  console.log(earned)

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
      <StakeCard {...bStyles} title="Weekly Reward" value="77.5k" />
      <StakeCard {...bStyles} title="Next voting round in" value="2D 9H 55M" />
      <StakeCard
        {...bStyles}
        title="Contracts"
        value={`Rewards Distributor \n GaugeController`}
      />
    </SimpleGrid>
  )
}

export default HeadingCards
