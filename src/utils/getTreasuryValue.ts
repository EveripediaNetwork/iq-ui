import {
  calculateYield,
  getTreasuryDetails,
  SortAndSumTokensValue,
} from '@/utils/treasury-utils'
import config from '@/config'

export const getCurrentTreasuryValue = async (
  rate: number,
  userTotalIQLocked: number,
  totalHiiqSupply?: number,
  fraxAprData?: number,
  fraxEthSummary?: number,
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

  const { totalAccountValue, sortedTreasuryDetails } = SortAndSumTokensValue(
    updatedTreasuryTokens,
  )
  const treasuryValuePlusYield = sortedTreasuryDetails.map((token) => ({
    ...token,
    yield: calculateYield(
      token,
      totalHiiqSupply || 0,
      fraxAprData,
      fraxEthSummary,
    ),
  }))

  return { totalAccountValue, treasuryValuePlusYield }
}
