import {
  getEpData,
  getHiIQ,
  getLPs,
  getSocialData,
  getTokenHolders,
  getVolume,
} from '@/utils/stats-data'
import { Dict } from '@chakra-ui/utils'
import { useEffect, useState } from 'react'

const getMappedValue = (object: Dict) => {
  let val = 0
  // eslint-disable-next-line array-callback-return
  Object.values(object).map((h) => {
    val += Number(h)
  })

  return val
}

export function useStatsData() {
  const [data, setData] = useState<Dict>({})
  const [totals, setTotals] = useState<Dict>({})

  useEffect(() => {
    async function run() {
      const holders = await getTokenHolders()
      setData((prevState) => {
        return { ...prevState, ...holders }
      })

      setTotals((prev) => ({
        ...prev,
        holders: getMappedValue(holders.holders),
      }))

      const volume = await getVolume()
      setData((prevState) => {
        return { ...prevState, ...volume }
      })

      setTotals((prev) => ({
        ...prev,
        volume: getMappedValue(volume.volume),
      }))

      const hiiq = await getHiIQ()
      setData((prevState) => {
        return { ...prevState, ...hiiq }
      })

      const lp = await getLPs()

      setData((prevState) => {
        return { ...prevState, ...lp }
      })
      const social = await getSocialData()
      setData((prevState) => {
        return { ...prevState, ...social }
      })
      const ep = await getEpData()
      setData((prevState) => {
        return { ...prevState, ...ep }
      })
    }

    run()
  }, [])

  return { data, totals }
}
