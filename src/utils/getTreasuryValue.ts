import {
  getTreasuryDetails,
  SortAndSumTokensValue,
} from '@/utils/treasury-utils'
import config from '@/config'

export const getCurrentTreasuryValue = async (
  rate: number,
  userTotalIQLocked: number,
) => {
  const treasuryTokens = await getTreasuryDetails()
  const updatedTreasuryTokens = [
    ...treasuryTokens,
    {
      id: 'HiIQ',
      token: userTotalIQLocked,
      raw_dollar: userTotalIQLocked * rate,
      contractAddress: config.treasuryHiIQAddress,
    },
  ]

  const { totalAccountValue } = await SortAndSumTokensValue(
    updatedTreasuryTokens,
  )
  return totalAccountValue
}
