import config from '@/config'
import { useGaugeCtrl } from '@/hooks/useGaugeCtrl'
import { useAppDispatch } from '@/store/hook'
import { setGauges } from '@/store/slices/gauges-slice'
import { useEffect } from 'react'

const Ghost2 = ({ nftFarmAddress }: { nftFarmAddress: string }) => {
  const { gaugeName } = useGaugeCtrl(nftFarmAddress)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (gaugeName) {
      dispatch(
        setGauges({
          name: gaugeName,
          address: config.gaugeCtrlAddress,
          gaugeAddress: nftFarmAddress,
        }),
      )
    }
  }, [gaugeName, dispatch])
  return null
}

export default Ghost2