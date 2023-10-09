import { getDollarValue } from '@/utils/LockOverviewUtils'
import { useEffect, useState, useRef } from 'react'

export const useIQRate = () => {
  const [rate, setRate] = useState(0)
  const isRendered = useRef(false)
  useEffect(() => {
    if (!rate && !isRendered.current) {
      const fetchEveripediaRate = async () => {
        const price = await getDollarValue()
        setRate(price)
        isRendered.current = true
      }
      fetchEveripediaRate()
    }
  }, [])
  return { rate,
  isRendered: isRendered.current }
}
