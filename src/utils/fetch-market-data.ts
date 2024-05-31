import { useEffect, useRef, useState } from 'react'
import { fetchPrices, fetchTokenData, sanitizePrices } from './dashboard-utils'
import { Dict } from '@chakra-ui/utils'
import { GraphPeriod } from '@/data/dashboard-data'

export const fetchMarketData = () => {
  const [prices, setPrices] = useState<Dict<Dict<number>[]> | null>(null)
  const [marketData, setMarketData] = useState<Dict | null>(null)
  const isFetchedData = useRef(false)

  useEffect(() => {
    if (!isFetchedData.current) {
      isFetchedData.current = true

      const loadPrices = async () => {
        const [day, week, month, year] = await fetchPrices()
        setPrices({
          [GraphPeriod.DAY]: sanitizePrices(day.prices),
          [GraphPeriod.WEEK]: sanitizePrices(week.prices),
          [GraphPeriod.MONTH]: sanitizePrices(month.prices),
          [GraphPeriod.YEAR]: sanitizePrices(year.prices),
        })
      }

      const loadMarketData = async () => {
        const data = await fetchTokenData('IQ')
        setMarketData(data)
      }

      loadPrices()
      loadMarketData()
    }
  }, [])

  return { prices, marketData }
}
