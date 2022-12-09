import {
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
  useProvider,
} from 'wagmi'
import { gaugeCtrlAbi } from '@/abis/gaugecontroller.abi'
import { WEIGHT_VOTE_DELAY } from '@/data/GaugesConstants'
import config from '@/config'
import { utils } from 'ethers'

type ErrorResponse = {
  reason: string
}

const contractConfig = {
  addressOrName: config.gaugeCtrlAddress,
  contractInterface: gaugeCtrlAbi,
}

export const useGaugeCtrl = () => {
  const { address } = useAccount()
  const provider = useProvider()
  const contract = useContract({
    addressOrName: config.gaugeCtrlAddress,
    contractInterface: gaugeCtrlAbi,
    signerOrProvider: provider,
  })

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
    functionName: 'time_total',
  })

  const { writeAsync: vote, isLoading: isVoting } = useContractWrite({
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
    try {
      const { wait: waitForTheVoteSubmission } = await vote({
        args: [gaugeAddr, userWeight],
      })

      await waitForTheVoteSubmission(3)

      return { isError: false, msg: 'Vote submitted successfully' }
    } catch (error) {
      return { isError: true, msg: (error as ErrorResponse).reason }
    }
  }

  const dateDiffs = (nextVotingRound: number) => {
    const now = new Date().getTime()
    let nextRoundTimestamp = new Date(Number(nextVotingRound) * 1000).getTime()

    if (nextRoundTimestamp < now)
      nextRoundTimestamp = new Date(
        Number(nextVotingRound + WEIGHT_VOTE_DELAY) * 1000,
      ).getTime()

    let seconds = Math.floor((nextRoundTimestamp - now) / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    hours -= days * 24
    minutes = minutes - days * 24 * 60 - hours * 60
    seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60

    return `${days}D ${hours}H ${minutes}M`
  }

  const getNextVotingRound = () => {
    if (nextVotingRoundTime) {
      const nextVotingRound = Number(nextVotingRoundTime.toString())
      return dateDiffs(nextVotingRound)
    }

    return undefined
  }

  const getLastUserVotePlusDelay = () => {
    if (lastUserVoteData) {
      const lastUserVotePlusDelay = new Date(
        Number(Number(lastUserVoteData.toString()) + WEIGHT_VOTE_DELAY) * 1000,
      )

      return lastUserVotePlusDelay.toUTCString()
    }

    return undefined
  }

  const isUserAllowedToVote = () => {
    if (lastUserVoteData) {
      const currentUnixTime = Date.now()

      const lastUserVotePlusDelay = new Date(
        Number(Number(lastUserVoteData.toString()) + WEIGHT_VOTE_DELAY) * 1000,
      ).getTime()

      return currentUnixTime > lastUserVotePlusDelay
    }

    return false
  }

  const getEvents = async (startingBlock: number, endingBlock: number) => {
    if (contract) {
      const eventFilter = contract.filters.VoteForGauge()
      const events = await contract.queryFilter(
        eventFilter,
        startingBlock,
        endingBlock,
      )

      const formattedEvents = events.map((e: any) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { gauge_addr, time, user, weight } = e.args

        return {
          gaugeAddress: gauge_addr,
          voteDate: new Date(Number(time.toString()) * 1000).toUTCString(),
          user,
          weight: weight.toString(),
        }
      })

      return formattedEvents
    }

    return undefined
  }

  const getGaugeRelativeWeight = async (gaugeAddress: string) => {
    const gaugeRelativeWeight = await contract.get_gauge_weight(gaugeAddress)

    if (gaugeRelativeWeight)
      return Number(utils.formatEther(gaugeRelativeWeight.toString()))

    return undefined
  }

  return {
    userVotingPower: getUserVotingPower(),
    gaugeType: getGaugeType(),
    gaugeName: getGaugeName(),
    nextVotingRound: getNextVotingRound(),
    getNextVotingRoundRaw: () => Number(nextVotingRoundTime?.toString()),
    canVote: isUserAllowedToVote(),
    vote: (gaugeAddr: string, userWeight: number) =>
      voteForGaugeWeights(gaugeAddr, userWeight),
    isVoting,
    events: (startBlockTimestamp: number, endBlockTimestamp: number) =>
      getEvents(startBlockTimestamp, endBlockTimestamp),
    getRelativeWeight: (gaugeAddress: string) =>
      getGaugeRelativeWeight(gaugeAddress),
    lastUserVotePlusDelay: getLastUserVotePlusDelay(),
  }
}
