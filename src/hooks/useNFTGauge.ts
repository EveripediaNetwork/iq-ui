import { useContractWrite, useContractRead, useAccount } from 'wagmi'
import config from '@/config'
import { nftFarmAbi } from '@/abis/nftfarm.abi'
import { utils } from 'ethers'
import { shortenBalance } from '@/utils/dashboard-utils'

export const useNFTGauge = () => {
  const { address } = useAccount()
  const { data: earnedData } = useContractRead({
    addressOrName: config.nftFarmAddress,
    contractInterface: nftFarmAbi,
    functionName: 'earned',
    args: [address],
    // watch: true,
  })
  const { writeAsync: getReward } = useContractWrite({
    addressOrName: config.nftFarmAddress,
    contractInterface: nftFarmAbi,
    functionName: 'getReward',
  })

  // TODO: check if needs approval

  const claimReward = async (destinationAddress: string) => {
    const result = await (
      await getReward({ args: [destinationAddress] })
    ).wait()

    return result
  }

  const getEarnedData = () => {
    console.log(earnedData)
    if (earnedData) return shortenBalance(Number(utils.formatEther(earnedData[0])))

    return 0
  }

  return {
    claimReward,
    earned: getEarnedData(),
  }
}
