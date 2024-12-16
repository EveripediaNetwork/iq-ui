import { bscHolders, maticHolders } from '@/data/StatsData'
import { useGetHIIQHoldersCountQuery } from '@/services/holders'

const useTokenHolders = () => {
  const { data: count } = useGetHIIQHoldersCountQuery()

  const getTokenHolders = async () => {
    try {
      const eosDataresponse = await fetch(
        'https://www.api.bloks.io/tokens?type=tokenHoldersCount&chain=eos&contract=everipediaiq&symbol=IQ',
      )
      const eosData = await eosDataresponse.text()

      const ethDataResponse = await fetch(
        '/api/token-holder-count?address=0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
      )
      const ethData = await ethDataResponse.json()

      const holdersData = {
        holders: {
          eos: eosData,
          eth: ethData?.response ?? 0,
          matic: maticHolders,
          bsc: bscHolders,
          hiiq: count ?? 0,
        },
      }

      console.log('Token Holders Data:', holdersData)

      return holdersData
    } catch (err) {
      console.error('Error fetching token holders:', err)
      return {
        holders: {
          eos: 0,
          eth: 0,
          matic: 0,
          bsc: 0,
          hiiq: 0,
        },
      }
    }
  }

  return { getTokenHolders }
}

export default useTokenHolders
