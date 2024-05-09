import { gql } from 'graphql-request'

export const DAILY_TREASURY = gql`
  query GetDailyTreasury($startDate: Int, $endDate: Int) {
    dailyTreasury(startDate: $startDate, endDate: $endDate) {
      id
      totalValue
      created
      updated
    }
  }
`

export const fraxLendQueryObject = {
  query: `
    query fraxlendArbitrumPairs {
      pairs {
        ...fraxlendPairDetail
        dailyHistory(first: 1, orderBy: timestamp, orderDirection: desc) {
          id
          exchangeRate
          totalAssetAmount
          totalAssetShare
          totalCollateral
          totalBorrowAmount
          totalBorrowShare
          totalBorrowValue
          totalAssetValue
          totalCollateralValue
          interestPerSecond
          utilization
          totalFeesAmount
          totalFeesShare
          lastAccrued
          timestamp
        }
      }
    }
    fragment fraxlendPairDetail on Pair {
      address
      name
      symbol
      oracleDivideAddress {
        id
        decimals
      }
      oracleMultiplyAddress {
        id
        decimals
      }
      maxLTV
      liquidationFee
      maturity
      pauseStatus
      lenderWhitelistActive
      borrowerWhitelistActive
      asset {
        symbol
        decimals
        address
        name
      }
      collateral {
        symbol
        decimals
        address
        name
      }
      rateContract {
        id
        rateType
        rateName
        interestHalfLife
        minInterest
        maxInterest
        minUtilization
        maxUtilization
        maxVertexUtilization
        utilizationPrecision
        maxFullUtilRate
        maxTargetUtil
        minFullUtilRate
        minTargetUtil
        rateHalfLife
        ratePrec
        utilPrec
        vertexRatePercent
        vertexUtil
        zeroUtilRate
      }
      positions(orderBy: borrowedAssetShare, orderDirection: desc) {
        user {
          id
        }
        borrowedAssetShare
        depositedCollateralAmount
        lentAssetShare
        timestamp
      }
    }
  `,
  operationName: 'fraxlendArbitrumPairs',
}
