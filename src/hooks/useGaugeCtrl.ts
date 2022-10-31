import { useAccount, useContractRead } from 'wagmi'
import config from '@/config'
import { gaugeCtrlAbi } from '@/abis/gaugecontroller.abi'

export const useGaugeCtrl = () => {
  const { address } = useAccount()
  const { data: userVotingPower } = useContractRead({
    addressOrName: config.gaugeCtrlAddress,
    contractInterface: gaugeCtrlAbi,
    functionName: 'vote_user_power',
    args: [address],
  })

  const { data: gaugeType } = useContractRead({
    addressOrName: config.gaugeCtrlAddress,
    contractInterface: gaugeCtrlAbi,
    functionName: 'gauge_types',
    args: [config.nftFarmAddress],
  })

  const { data: gaugeName } = useContractRead({
    addressOrName: config.gaugeCtrlAddress,
    contractInterface: gaugeCtrlAbi,
    functionName: 'gauge_type_names',
    args: [gaugeType?.toString()],
  })

  const getUserVotingPower = () => {
    return userVotingPower?.toString() || ''
  }

  const getGaugeType = () => {
    return gaugeType
  }

  const getGaugeName = () => {
    if (gaugeName)
      return String(gaugeName)

    return undefined
  }

  return {
    userVotingPower: getUserVotingPower(),
    gaugeType: getGaugeType(),
    gaugeName: getGaugeName(),
  }
}
