import { useEffect, useRef, useState } from 'react'
import { Dict } from '@chakra-ui/utils'
import {
  getEpData,
  getIQ,
  getLPs,
  getSocialData,
  getVolume,
} from '@/utils/stats-data'
import { getTokenHolders } from '@/app/[locale]/dashboard/_actions'

const initialDataForTokenHolders = {
  holders: { eos: 0, eth: 0, matic: 0, bsc: 0, hiiq: 0 },
}

const initialDataForVolume = {
  volume: { eos: 0, eth: 0, matic: 0, bsc: 0, hiiq: 0 },
}

const initialDataForIQ = {
  Iq: { locked: 0, mcap: 0, volume: 0 },
}

const initialDataForLPs = {
  lp: {
    fraxSwap: 0,
    fraxswapCurveFraxtal: 0,
    sushiSwap: 0,
  },
}

const initialDataForSocialData = {
  social: { twitter: 0, reddit: 0 },
}

const initialDataForEpData = {
  ep: { articles: 0, edits: 0 },
}

const getMappedValue = (object: Dict) => {
  let val = 0
  Object.values(object).forEach((h) => {
    val += Number(h)
  })
  return val
}

function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: NodeJS.Timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Promise timed out after ${ms} ms`))
    }, ms)
  })

  return Promise.race([promise, timeoutPromise]).finally(() =>
    clearTimeout(timeoutId),
  ) as Promise<T>
}

const fetchWithTimeout = async <T>(
  fetchFn: () => Promise<T>,
  timeout: number,
  initialData: T,
): Promise<T> => {
  try {
    return await timeoutPromise(fetchFn(), timeout)
  } catch (error) {
    console.error(`Failed to fetch data: ${error}`)
    return initialData
  }
}

export function useStatsData() {
  const [data, setData] = useState<Dict>({})
  const [totals, setTotals] = useState<Dict>({})
  const isFetched = useRef(false)

  useEffect(() => {
    const fetchData = async () => {
      const TIMEOUT = 10000

      const results = await Promise.allSettled([
        fetchWithTimeout(getTokenHolders, TIMEOUT, initialDataForTokenHolders),
        fetchWithTimeout(getVolume, TIMEOUT, initialDataForVolume),
        fetchWithTimeout(getIQ, TIMEOUT, initialDataForIQ),
        fetchWithTimeout(getLPs, TIMEOUT, initialDataForLPs),
        fetchWithTimeout(getSocialData, TIMEOUT, initialDataForSocialData),
        fetchWithTimeout(getEpData, TIMEOUT, initialDataForEpData),
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
  }, [getTokenHolders])

  return { data, totals, isFetched: isFetched.current }
}
