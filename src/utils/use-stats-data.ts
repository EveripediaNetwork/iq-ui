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

function timeoutPromise(promise: Promise<any>, ms: number): Promise<any> {
  let timeoutId: NodeJS.Timeout
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Promise timed out after ${ms} ms`))
    }, ms)
  })

  return Promise.race([promise, timeoutPromise]).finally(() =>
    clearTimeout(timeoutId),
  )
}

export function useStatsData() {
  const [data, setData] = useState<Dict>({})
  const [totals, setTotals] = useState<Dict>({})
  const isFetched = useRef(false)

  useEffect(() => {
    const fetchData = async () => {
      const TIMEOUT = 10000

      const results = await Promise.allSettled([
        timeoutPromise(getTokenHolders(), TIMEOUT),
        timeoutPromise(getVolume(), TIMEOUT),
        timeoutPromise(getIQ(), TIMEOUT),
        timeoutPromise(getLPs(), TIMEOUT),
        timeoutPromise(getSocialData(), TIMEOUT),
        timeoutPromise(getEpData(), TIMEOUT),
      ])

      const newData: Dict = {}
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          Object.assign(newData, result.value)
        } else {
          console.error(
            `Failed to fetch data for index ${index}:`,
            result.reason,
          )
        }
      })

      setData(newData)
      setTotals({
        holders: getMappedValue(newData.holders),
        volume: getMappedValue(newData.volume),
      })
    }
    if (!isFetched.current) {
      isFetched.current = true
      fetchData()
    }
  }, [data, totals])

  return { data, totals }
}
