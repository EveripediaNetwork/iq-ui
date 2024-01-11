import { useEffect, useRef, useState } from 'react'
import { Dict } from '@chakra-ui/utils'
import {
  getEpData,
  getIQ,
  getLPs,
  getSocialData,
  getTokenHolders,
  getVolume,
} from '@/utils/stats-data'

const getMappedValue = (object: Dict) => {
  let val = 0
  Object.values(object).forEach((h) => {
    val += Number(h)
  })
  return val
}

export function useStatsData() {
  const [data, setData] = useState<Dict>({})
  const [totals, setTotals] = useState<Dict>({})
  const isFetched = useRef(false)

  useEffect(() => {
    const fetchData = async () => {
      const [holders, volume, iq, lp, social, ep] = await Promise.all([
        getTokenHolders(),
        getVolume(),
        getIQ(),
        getLPs(),
        getSocialData(),
        getEpData(),
      ])

      const newData = { ...holders, ...volume, ...iq, ...lp, ...social, ...ep }

      setData(newData)

      setTotals({
        holders: getMappedValue(holders.holders),
        volume: getMappedValue(volume.volume),
      })
    }
    if (!isFetched.current) {
      isFetched.current = true
      fetchData()
    }
  }, [data, totals])

  return { data, totals }
}
