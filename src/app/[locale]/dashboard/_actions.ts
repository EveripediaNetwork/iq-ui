import { bscHolders, maticHolders } from '@/data/StatsData'
import { getHIIQHoldersCount } from '@/services/holder'

export async function getTokenHolders() {
  try {
    const hiiqCount = await getHIIQHoldersCount()

    const eosDataResponse = await fetch(
      'https://www.api.bloks.io/tokens?type=tokenHoldersCount&chain=eos&contract=everipediaiq&symbol=IQ',
      { cache: 'no-store' },
    )
    const eosData = await eosDataResponse.text()

    const ethDataResponse = await fetch(
      '/api/token-holder-count?address=0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
      { cache: 'no-store' },
    )
    const ethData = await ethDataResponse.json()

    const holdersData = {
      holders: {
        eos: eosData,
        eth: ethData?.response ?? 0,
        matic: maticHolders,
        bsc: bscHolders,
        hiiq: hiiqCount ?? 0,
      },
    }

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
