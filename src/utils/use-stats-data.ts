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
      const newData: Dict = {}

      const fetchHolders = async () => {
        try {
          const holders = await getTokenHolders()
          newData.holders = holders.holders
          setData((prevData) => ({ ...prevData, ...newData }))
          setTotals((prevTotals) => ({
            ...prevTotals,
            holders: getMappedValue(holders.holders),
          }))
        } catch (error) {
          console.error('Error fetching holders:', error)
        }
      }

      const fetchVolume = async () => {
        try {
          const volume = await getVolume()
          newData.volume = volume.volume
          setData((prevData) => ({ ...prevData, ...newData }))
          setTotals((prevTotals) => ({
            ...prevTotals,
            volume: getMappedValue(volume.volume),
          }))
        } catch (error) {
          console.error('Error fetching volume:', error)
        }
      }

      const fetchIQ = async () => {
        try {
          const iq = await getIQ()
          newData.Iq = iq.Iq
          setData((prevData) => ({ ...prevData, ...newData }))
        } catch (error) {
          console.error('Error fetching IQ data:', error)
        }
      }

      const fetchLPs = async () => {
        try {
          const lp = await getLPs()
          newData.lp = lp.lp
          setData((prevData) => ({ ...prevData, ...newData }))
        } catch (error) {
          console.error('Error fetching LP data:', error)
        }
      }

      const fetchSocial = async () => {
        try {
          const social = await getSocialData()
          newData.social = social.social
          setData((prevData) => ({ ...prevData, ...newData }))
        } catch (error) {
          console.error('Error fetching social data:', error)
        }
      }

      const fetchEp = async () => {
        try {
          const ep = await getEpData()
          newData.ep = ep.ep
          setData((prevData) => ({ ...prevData, ...newData }))
        } catch (error) {
          console.error('Error fetching EP data:', error)
        }
      }

      fetchHolders()
      fetchVolume()
      fetchIQ()
      fetchLPs()
      fetchSocial()
      fetchEp()
    }

    if (!isFetched.current) {
      isFetched.current = true
      fetchData()
    }
  }, [])

  return { data, totals }
}
