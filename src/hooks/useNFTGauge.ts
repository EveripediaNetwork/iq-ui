import { useContractWrite, useContractRead, useAccount } from 'wagmi'
import config from '@/config'
import { nftFarmAbi } from '@/abis/nftfarm.abi'
import { utils } from 'ethers'
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'

export const useNFTGauge = () => {
  const { address } = useAccount()
  const { data: earnedData } = useContractRead({
    addressOrName: config.nftFarmAddress,
    contractInterface: nftFarmAbi,
    functionName: 'earned',
    args: [address],
    watch: true,
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
    if (isBigNumberish(earnedData)) return utils.formatEther(earnedData)

    return 0
  }

  return {
    claimReward,
    earned: getEarnedData(),
  }
}
