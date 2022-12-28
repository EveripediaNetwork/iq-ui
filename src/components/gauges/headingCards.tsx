import React from 'react'
import { Flex, Text, Link } from '@chakra-ui/react'
import { useNFTGauge } from '@/hooks/useNFTGauge'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { getUnusedWeight } from '@/utils/gauges.util'
import { useRewardsDistributor } from '@/hooks/useRewardsDistributor'
import { useAppSelector } from '@/store/hook'
import { Gauge } from '@/types/gauge'
import config from '@/config'
import { useAccount } from 'wagmi'
import StakeCard from '../cards/StakeCard'

const bStyles = {
  // borderLeft: 'solid 1px',
  // borderColor: 'divider2',
  minWidth: '212px',
}

const HeadingCards = () => {
  const currentGauge: Gauge | undefined = useAppSelector(
    state => state.gauges.currentGauge,
  )
  const { isConnected } = useAccount()
  const { earned } = useNFTGauge()
  const { userVotingPower, nextVotingRound } = useGaugeCtrl()
  const { weeklyReward } = useRewardsDistributor({
    gaugeAddress:
      currentGauge !== undefined
        ? currentGauge.gaugeAddress
        : config.nftFarmAddress,
  })

  return (
    <Flex
      // columns={{ base: 2, md: 4 }}
      px={{ base: '8', md: '2' }}
      py="3"
      mt="1"
      // spacingY="13px"
      justifyContent="space-evenly"
      border="solid 1px"
      flexWrap="wrap"
      alignItems="center"
      borderColor="divider"
      // minChildWidth="212px"
      // templateColumns="repeat(5, minmax(0, 1fr))"
      rounded="lg"
      bg="lightCard"
    >
      <StakeCard
        title="Earned"
        minWidth="212px"
        value={isConnected ? String(earned) || '0' : 'Disconnected'}
      />
      {isConnected ? (
        <StakeCard
          {...bStyles}
          title="Unused Weight"
          value={getUnusedWeight(userVotingPower).unused}
        />
      ) : null}
      <StakeCard
        {...bStyles}
        title="Weekly Reward"
        value={weeklyReward || '0'}
      />
      <StakeCard
        {...bStyles}
        title="Voting round ends in"
        value={nextVotingRound || ''}
      />
      <Flex
        {...bStyles}
        direction="column"
        gap="6px"
        align="center"
        px={{ base: '8px', lg: '10px' }}
        py={{ base: '10px', lg: '7px' }}
        textAlign="center"
        title=""
      >
        <Text
          fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
          color="tooltipColor"
          fontWeight="medium"
        >
          Contracts
        </Text>
        <Text
          fontWeight="semibold"
          fontSize={{ base: 'sm', md: 'md', lg: 'xl' }}
        >
          <Link
            target="_blank"
            rel="noreferrer noopener"
            href={`${config.blockExplorerUrl}address/${config.gaugeCtrlAddress}`}
          >
            GaugeController
          </Link>
        </Text>
        <Text
          fontWeight="semibold"
          fontSize={{ base: 'sm', md: 'md', lg: 'xl' }}
        >
          <Link
            target="_blank"
            rel="noreferrer noopener"
            href={`${config.blockExplorerUrl}address/${config.gaugeRewardsDistributorAddress}`}
          >
            Rewards Distributor
          </Link>
        </Text>
      </Flex>
    </Flex>
  )
}

export default HeadingCards
