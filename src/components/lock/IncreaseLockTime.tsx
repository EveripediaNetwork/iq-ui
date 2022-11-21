import { useLock } from '@/hooks/useLock'
import React, { useState, useEffect } from 'react'
import { useToast, IconButton } from '@chakra-ui/react'
import { RiArrowDownLine } from 'react-icons/ri'
import { useLockOverview } from '@/hooks/useLockOverview'
import { useReward } from '@/hooks/useReward'
import { useAccount, useWaitForTransaction } from 'wagmi'
import { calculateReturn } from '@/utils/LockOverviewUtils'
import { Dict } from '@chakra-ui/utils'
import { logEvent } from '@/utils/googleAnalytics'
import LockFormCommon from './LockFormCommon'
import LockSlider from '../elements/Slider/LockSlider'

const IncreaseLockTime = () => {
  const { increaseLockPeriod } = useLock()
  const [loading, setLoading] = useState(false)
  const { userTotalIQLocked, lockEndDate } = useLockOverview()
  const [trxHash, setTrxHash] = useState()
  const toast = useToast()
  const [lockend, setLockend] = useState<Date>()
  const [lockEndMemory, setLockEndValueMemory] = useState<Date>()
  const [receivedAmount, setReceivedAmount] = useState(0)
  const [lockValue, setLockValue] = useState(0)
  const { checkPoint } = useReward()
  const { data } = useWaitForTransaction({ hash: trxHash })
  const { address } = useAccount()

  const resetValues = () => {
    setLoading(false)
    setLockValue(0)
    setTrxHash(undefined)
  }

  useEffect(() => {
    if (trxHash && data) {
      if (data.status) {
        toast({
          title: `IQ successfully locked`,
          position: 'top-right',
          isClosable: true,
          status: 'success',
        })
        checkPoint()
        resetValues()
      } else {
        toast({
          title: `Transaction could not be completed`,
          position: 'top-right',
          isClosable: true,
          status: 'error',
        })
        resetValues()
      }
    }
  }, [data, toast, trxHash, checkPoint])

  useEffect(() => {
    const amountToBeRecieved = calculateReturn(
      userTotalIQLocked,
      lockValue,
      lockEndDate,
      0,
    )
    setReceivedAmount(amountToBeRecieved)
  }, [userTotalIQLocked, lockValue])

  useEffect(() => {
    if (!lockend && lockEndDate && typeof lockEndDate !== 'number') {
      setLockend(lockEndDate)
      setLockEndValueMemory(lockEndDate)
    }
  }, [lockEndDate, lockend])

  const updateLockend = (lockPeriodInput: number) => {
    const temp = lockEndMemory || new Date()
    const newDate = new Date(temp)
    if (lockPeriodInput === 0) {
      setLockValue(0)
      return
    }
    newDate.setDate(temp.getUTCDate() + lockPeriodInput)
    setLockend(newDate)
    setLockValue(lockPeriodInput)
  }

  const handleExtendLockPeriod = async () => {

    if (lockValue < 1 || !lockend || typeof lockEndDate === 'number' || lockend?.getTime() <= lockEndDate?.getTime()) {
      toast({
        title: `You need to specify a new lock period and it must be more than the current unlock date`,
        position: 'top-right',
        isClosable: true,
        status: 'error',
      })
      return
    }
    setLoading(true)
    try {
      const result = await increaseLockPeriod(lockend.getTime())
      if (!result) {
        toast({
          title: `Transaction failed`,
          position: 'top-right',
          isClosable: true,
          status: 'error',
        })
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
        toast({
          title: `Transaction cancelled by user`,
          position: 'top-right',
          isClosable: true,
          status: 'error',
        })
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
      />
    </>
  )
}

export default IncreaseLockTime
