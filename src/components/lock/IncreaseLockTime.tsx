import { useLock } from '@/hooks/useLock'
import React, { useState, useEffect } from 'react'
import { IconButton } from '@chakra-ui/react'
import { RiArrowDownLine } from 'react-icons/ri'
import { useLockOverview } from '@/hooks/useLockOverview'
import { useReward } from '@/hooks/useReward'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { calculateReturn } from '@/utils/LockOverviewUtils'
import { Dict } from '@chakra-ui/utils'
import { logEvent } from '@/utils/googleAnalytics'
import { useReusableToast } from '@/hooks/useToast'
import { useLockEnd } from '@/hooks/useLockEnd'
import LockFormCommon from './LockFormCommon'
import LockSlider from '../elements/Slider/LockSlider'

const IncreaseLockTime = () => {
  const { increaseLockPeriod } = useLock()
  const [loading, setLoading] = useState(false)
  const { userTotalIQLocked, refetchUserLockEndDate } = useLockOverview()
  const { lockEndDate } = useLockEnd()
  const [trxHash, setTrxHash] = useState<`0x${string}`>()
  const { showToast } = useReusableToast()
  const [lockend, setLockend] = useState<Date>()
  const [receivedAmount, setReceivedAmount] = useState(0)
  const [lockValue, setLockValue] = useState(0)
  const { checkPoint } = useReward()
  const { data, isSuccess } = useWaitForTransactionReceipt({ hash: trxHash })
  const { address } = useAccount()

  const resetValues = () => {
    setLoading(false)
    setLockValue(0)
    setTrxHash(undefined)
    refetchUserLockEndDate()
  }

  useEffect(() => {
    if (trxHash && data) {
      if (isSuccess) {
        showToast('IQ successfully locked', 'success')
        checkPoint()
        resetValues()
      } else {
        showToast('Transaction could not be completed', 'error')
        resetValues()
      }
    }
  }, [data, trxHash, checkPoint])

  useEffect(() => {
    const amountToBeRecieved = calculateReturn(
      userTotalIQLocked,
      lockValue,
      lockEndDate,
      0,
    )
    setReceivedAmount(amountToBeRecieved)
  }, [userTotalIQLocked, lockValue])

  const updateLockend = (lockPeriodInput: number) => {
    if (lockEndDate) {
      const newDate = new Date(lockEndDate)
      if (lockPeriodInput === 0) {
        setLockValue(0)
        return
      }

      newDate.setDate(lockEndDate.getUTCDate() + lockPeriodInput)
      setLockend(newDate)
      setLockValue(lockPeriodInput)
    }
  }

  const handleExtendLockPeriod = async () => {
    if (
      lockValue < 1 ||
      !lockend ||
      !lockEndDate ||
      lockend.getTime() <= lockEndDate.getTime()
    ) {
      showToast(
        'You need to specify a new lock period and it must be more than the current unlock date',
        'error',
      )
      return
    }
    setLoading(true)
    try {
      const result = await increaseLockPeriod(lockend.getTime())
      if (!result) {
        showToast('Transaction failed', 'error')
        logEvent({
          action: 'INCREASE_STAKE_PERIOD_FAILURE',
          label: JSON.stringify(address),
          value: 0,
          category: 'increase_stake_period_failure',
        })
        setLoading(false)
        return
      }
      logEvent({
        action: 'INCREASE_STAKE_PERIOD_SUCCESS',
        label: JSON.stringify(address),
        value: 1,
        category: 'increase_stake_period_success',
      })
      setTrxHash(result.hash)
    } catch (err) {
      const errorObject = err as Dict
      if (errorObject?.code === 'ACTION_REJECTED') {
        showToast('Transaction cancelled by user', 'error')
      }
      setLoading(false)
    }
  }

  return (
    <>
      <LockSlider updateLockend={(value: number) => updateLockend(value)} />
      <IconButton
        icon={<RiArrowDownLine />}
        aria-label="Swap"
        variant="outline"
        w="fit-content"
        mx="auto"
        color="brandText"
      />
      <LockFormCommon
        lockend={lockend}
        receivedAmount={receivedAmount}
        hasIQLocked={false}
        isLoading={loading}
        handleLockPeriodUpdate={handleExtendLockPeriod}
        isDisabled={lockValue < 1 ? true : false}
      />
    </>
  )
}

export default IncreaseLockTime
