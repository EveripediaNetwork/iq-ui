import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { gaugeCtrlAbi } from '@/abis/gaugecontroller.abi'
import config from '@/config'
import { WEIGHT_VOTE_DELAY } from '@/data/GaugesConstants'

const contractConfig = {
  addressOrName: config.gaugeCtrlAddress,
  contractInterface: gaugeCtrlAbi,
}

export const useGaugeCtrl = () => {
  const { address } = useAccount()
  const { data: userVotingPower } = useContractRead({
    ...contractConfig,
    functionName: 'vote_user_power',
    args: [address],
  })

  const { data: gaugeType } = useContractRead({
    ...contractConfig,
    functionName: 'gauge_types',
    args: [config.nftFarmAddress],
  })

  const { data: gaugeName } = useContractRead({
    ...contractConfig,
    functionName: 'gauge_type_names',
    args: [gaugeType?.toString()],
  })

  const { data: lastUserVoteData } = useContractRead({
    ...contractConfig,
    functionName: 'last_user_vote',
    args: [address, config.nftFarmAddress],
  })

  const { writeAsync: vote } = useContractWrite({
    ...contractConfig,
    functionName: 'vote_for_gauge_weights',
  })

  const getUserVotingPower = () => {
    if (userVotingPower) return Number(userVotingPower.toString())
    return 0
  }

  const getGaugeType = () => {
    return gaugeType
  }

  const getGaugeName = () => {
    if (gaugeName) return String(gaugeName)

    return undefined
  }

  const voteForGaugeWeights = () => {}

  const isUserAllowedToVote = () => {
    if (lastUserVoteData) {
      const currentDate = new Date()
      const currentUnixTime = Math.floor(currentDate.getTime() / 1000)

      const lastUserVoteDate = new Date(Number(lastUserVoteData.toString()))
      const lastUserVoteUnixTime = lastUserVoteDate.getTime()
      const lastUserVoteUnixTimePlusDelay =
        lastUserVoteUnixTime + WEIGHT_VOTE_DELAY
      // const lastUserVoteDateWithDelay = new Date(lastUserVoteUnixTimePlusDelay)

      if (currentUnixTime >= lastUserVoteUnixTimePlusDelay) return true
      // return { /* daysRemaining: currentDate.getUTCDate() - lastUserVoteDateWithDelay.getUTCDate(), */ canVote: true }
      return false
      // return { /* daysRemaining: lastUserVoteDateWithDelay.getUTCDate() - currentDate.getUTCDate(), */ canVote: false }
    }
  }

  return {
    userVotingPower: getUserVotingPower(),
    gaugeType: getGaugeType(),
    gaugeName: getGaugeName(),
    canVote: isUserAllowedToVote(),
  }
}
