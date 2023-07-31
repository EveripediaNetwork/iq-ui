import React, { useState } from 'react'
import { useNFTGauge } from '@/hooks/useNFTGauge'
import { useToast } from '@chakra-ui/react'
import { getEpochTime } from '@/utils/gauges.util'
import GaugeSlider from './GaugeSlider'
import GaugesFormCommon from './GaugesFormCommon'

const IncreaseStakeTime = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [, setLockPeriod] = useState(7)
  const [lockEnd, setLockEnd] = useState('')
  const { lockedStakes, increaseStakePeriod } = useNFTGauge()
  const toast = useToast()

  const showToast = (msg: string, status: 'success' | 'error') => {
    toast({
      title: msg,
      status,
      duration: 4000,
      isClosable: true,
      position: 'top-right',
    })
  }

  const handleIncreaseLockPeriod = async () => {
    setIsLoading(true)
    const { isError: error, msg: stakeMsg } = await increaseStakePeriod(
      getEpochTime(lockEnd),
      Number(lockedStakes[0].kek_id),
    )
    showToast(stakeMsg, error ? 'error' : 'success')
    setIsLoading(false)
  }
  const updateLockPeriod = (days: number) => {
    setLockPeriod(days)
    const now = new Date()
    now.setSeconds(days * 86400)
    setLockEnd(now.toUTCString())
  }
  return (
    <>
      <GaugeSlider
        updateLockPeriod={(newDate: number) => updateLockPeriod(newDate)}
      />
      <GaugesFormCommon
        lockEnd={lockEnd}
        handler={handleIncreaseLockPeriod}
        locking={isLoading}
      />
    </>
  )
}

export default IncreaseStakeTime
