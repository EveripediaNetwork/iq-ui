import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { gaugeCtrlAbi } from '@/abis/gaugecontroller.abi'
import { WEIGHT_VOTE_DELAY } from '@/data/GaugesConstants'
import config from '@/config'

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

  const { data: nextVotingRoundTime } = useContractRead({
    ...contractConfig,
    functionName: 'time_total'
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

  const voteForGaugeWeights = async (gaugeAddr: string, userWeight: number) => {
    const { data: voteResult, wait: waitForTheVoteSubmission } = await vote({ args: [gaugeAddr, userWeight] })

    await waitForTheVoteSubmission(3)

    console.log(voteResult)

    return voteResult
  }

  // a and b are javascript Date objects
  const dateDiffs = (a: Date, b: Date) => {
    let seconds = Math.floor((b.getTime() - a.getTime()) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

    return `${days}D ${hours}H ${minutes}M`;
  }

  const getNextVotingRound = () => {
    if (nextVotingRoundTime) {
      // console.log(nextVotingRoundTime.toString())
      const now = new Date()
      const nextVotingRound = new Date(Number(nextVotingRoundTime.toString()) * 1000)
      return dateDiffs(now, nextVotingRound)
    }

    return undefined
    // console.log(new Date(nextVotingRoundTime))
  }

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
    nextVotingRound: getNextVotingRound(),
    canVote: isUserAllowedToVote(),
    vote: (gaugeAddr: string, userWeight: number) =>
      voteForGaugeWeights(gaugeAddr, userWeight),
  }
}
