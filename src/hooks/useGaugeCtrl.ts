import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import gaugeCtrlAbi from '@/abis/gaugecontroller.abi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { WEIGHT_VOTE_DELAY } from '@/data/GaugesConstants'
import config from '@/config'
import { Gauge } from '@/types/gauge'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { getContract, formatEther, createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { wagmiConfig } from '@/config/wagmi'

type ErrorResponse = {
  reason: string
}

const contractConfig = {
  address: config.gaugeCtrlAddress as `0x${string}`,
  abi: gaugeCtrlAbi,
}
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const useGaugeCtrl = (nftFarmAddress = config.nftFarmAddress) => {
  const { address } = useAccount()
  const currentGauge: Gauge | undefined = useSelector(
    (state: RootState) => state.gauges.currentGauge,
  )

  const contract = getContract({
    address: config.gaugeCtrlAddress as `0x${string}`,
    abi: gaugeCtrlAbi,
    client: publicClient,
  })

  const { data: userVotingPower, refetch: refetchUserVotingPower } =
    useReadContract({
      ...contractConfig,
      functionName: 'vote_user_power',
      args: [address as `0x${string}`],
    })

  const { data: gaugeType } = useReadContract({
    ...contractConfig,
    functionName: 'gauge_types',
    args: [nftFarmAddress as `0x${string}`],
  })

  const { data: gaugeName } = useReadContract({
    ...contractConfig,
    functionName: 'gauge_type_names',
    args: [gaugeType ?? BigInt(0)],
  })

  const { data: lastUserVoteData, refetch: refetchLastUserVoteData } =
    useReadContract({
      ...contractConfig,
      functionName: 'last_user_vote',
      args: [
        address as `0x${string}`,
        currentGauge
          ? (currentGauge?.gaugeAddress as `0x${string}`)
          : (nftFarmAddress as `0x${string}`),
      ],
    })

  const { data: nextVotingRoundTime } = useReadContract({
    ...contractConfig,
    functionName: 'time_total',
  })

  // const { writeAsync: vote } = useContractWrite({
  //   ...contractConfig,
  //   functionName: 'vote_for_gauge_weights',
  // })

  const { data: voteHash, writeContractAsync: vote } = useWriteContract()

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
      await vote({
        ...contractConfig,
        functionName: 'vote_for_gauge_weights',
        args: [gaugeAddr as `0x${string}`, BigInt(userWeight)],
      })
      await waitForTransactionReceipt(wagmiConfig, {
        hash: voteHash as `0x${string}`,
      })
      await refetchUserVotingPower()
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

  const getEvents = async () => {
    if (contract) {
      const { filters, queryFilter } = contract as any
      const eventFilter = filters.VoteForGauge()
      const events = await queryFilter(eventFilter, 0, 'latest')

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
    const { data: gaugeRelativeWeight } = useReadContract({
      ...contractConfig,
      functionName: 'get_gauge_weight',
      args: [gaugeAddress as `0x${string}`],
    })
    if (gaugeRelativeWeight) return Number(formatEther(gaugeRelativeWeight))

    return 0
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
    events: () => getEvents(),
    getRelativeWeight: (gaugeAddress: string) =>
      getGaugeRelativeWeight(gaugeAddress),
    lastUserVotePlusDelay: getLastUserVotePlusDelay(),
    refetchLastUserVoteData: () => refetchLastUserVoteData(),
    lastUserVoteData,
  }
}
