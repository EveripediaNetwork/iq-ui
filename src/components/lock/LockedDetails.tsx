import React, { useEffect, useState } from 'react'
import {
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Text,
  Stack,
  VStack,
  Tooltip,
  chakra,
} from '@chakra-ui/react'
import { RiCalculatorFill, RiLinksLine, RiQuestionLine } from 'react-icons/ri'
import { useLockOverview } from '@/hooks/useLockOverview'
import * as Humanize from 'humanize-plus'
import { useReward } from '@/hooks/useReward'
import { useAccount, useWaitForTransaction } from 'wagmi'
import { Dict } from '@chakra-ui/utils'
import { logEvent } from '@/utils/googleAnalytics'
import { useIQRate } from '@/hooks/useRate'
import { useReusableToast } from '@/hooks/useToast'
import Link from '../elements/LinkElements/Link'

const LockedDetails = ({
  setOpenUnlockNotification,
  setOpenRewardCalculator,
  loading,
}: {
  setOpenUnlockNotification: (status: boolean) => void
  setOpenRewardCalculator: (status: boolean) => void
  loading: boolean
}) => {
  const { userTotalIQLocked, hiiqBalance, lockEndDate } = useLockOverview()
  const {
    checkPoint,
    rewardEarned,
    getYield,
    totalRewardEarned,
    userHiiqCheckPointed,
    refetchTotalRewardEarned,
  } = useReward()
  const [reward, setReward] = useState(0)
  const [isExpired, setIsExpired] = useState(false)
  const [daysDiff, setDaysDiff] = useState(0)
  const [totalIQReward, setTotalIQReward] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isRewardClaimingLoading, setIsRewardClaimingLoading] = useState(false)
  const [trxHash, setTrxHash] = useState()
  const { data } = useWaitForTransaction({ hash: trxHash })
  const { isConnected, address } = useAccount()
  const { rate: price } = useIQRate()
  const { showToast } = useReusableToast()

  useEffect(() => {
    const resolveReward = async () => {
      const resolvedReward = await rewardEarned()
      setTotalIQReward(resolvedReward)
      if (price > 0) {
        setReward(resolvedReward * price)
      }
    }
    if (totalRewardEarned && isConnected) {
      resolveReward()
    }
  }, [totalRewardEarned, isConnected, rewardEarned])

  useEffect(() => {
    if (lockEndDate && typeof lockEndDate !== 'number') {
      const currentDateTime = new Date().getTime()
      const lockedTime = lockEndDate.getTime()
      setIsExpired(currentDateTime > lockedTime)
      const differenceInDays =
        (lockedTime - currentDateTime) / (1000 * 3600 * 24)

      if (differenceInDays > 0) setDaysDiff(differenceInDays)
      else setDaysDiff(0)
    }
  }, [lockEndDate, daysDiff])

  const resetValues = () => {
    setIsLoading(false)
    setTrxHash(undefined)
    setIsRewardClaimingLoading(false)
    refetchTotalRewardEarned()
  }

  useEffect(() => {
    if (trxHash && data) {
      if (data.status) {
        showToast(`Transaction successfully performed`, 'success')
        resetValues()
      } else {
        showToast(`Transaction could not be completed`, 'error')
        resetValues()
      }
    }
  }, [data, trxHash])

  const handleCheckPoint = async () => {
    setIsLoading(true)
    try {
      const result = await checkPoint()
      setTrxHash(result.hash)
      logEvent({
        action: 'CHECKPOINT',
        label: JSON.stringify(address),
        value: 1,
        category: 'checkpoint',
      })
    } catch (err) {
      const errorObject = err as Dict
      if (errorObject?.code === 'ACTION_REJECTED') {
        showToast(`Transaction cancelled by user`, 'error')
      }
      setIsLoading(false)
    }
  }

  const handleClaimReward = async () => {
    setIsRewardClaimingLoading(true)
    try {
      const result = await getYield()
      setTrxHash(result.hash)
      logEvent({
        action: 'CLAIM_REWARD',
        label: JSON.stringify(address),
        value: 1,
        category: 'claim_reward',
      })
    } catch (err) {
      const errorObject = err as Dict
      if (errorObject?.code === 'ACTION_REJECTED') {
        showToast(`Transaction cancelled by user`, 'error')
      }
      setIsRewardClaimingLoading(false)
    }
  }

  return (
    <Flex
      direction="column"
      py="6"
      rounded="lg"
      border="solid 1px "
      borderColor="divider"
      align="center"
      maxW={{ base: 526, lg: 400 }}
      w="full"
      rowGap={5}
      mx={{ base: 'auto', lg: 'none' }}
      mb="auto"
    >
      <VStack align="center" rowGap={2}>
        <Heading fontWeight="medium" fontSize={{ md: 'xl', lg: '2xl' }}>
          Current Stake
        </Heading>
        <Divider
          w="30"
          borderColor="divider"
          display={{ base: 'none', lg: 'inherit' }}
        />
      </VStack>
      <VStack align="center">
        <Text color="grayText4" fontSize="md" fontWeight="medium">
          IQ Staked
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {Humanize.formatNumber(userTotalIQLocked, 2)} IQ
        </Text>
      </VStack>
      <VStack align="center">
        <Text color="grayText4" fontSize="md" fontWeight="medium">
          HiIQ Balance
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {Humanize.formatNumber(hiiqBalance, 2)} HiIQ
        </Text>
      </VStack>
      <VStack align="center">
        <Text color="grayText4" fontSize="md" fontWeight="medium">
          Time Remaining
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {daysDiff < 1 ? '-' : `${daysDiff.toFixed(0)} days`}
        </Text>
      </VStack>
      <VStack align="center">
        <Text color="grayText4" fontSize="md" fontWeight="medium">
          Claimable Reward
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {totalIQReward > 0
            ? `${Humanize.formatNumber(totalIQReward, 2)} `
            : '-'}
          {reward ? (
            <chakra.span color="grayText4" fontWeight="medium" fontSize="sm">
              ( {Humanize.formatNumber(reward, 3)} $ )
            </chakra.span>
          ) : null}
        </Text>
      </VStack>
      <VStack rowGap={2}>
        <Stack direction="row" spacing={3}>
          <Button
            fontSize={{ base: 'xs', md: 'sm' }}
            w={{ base: 120, md: 164 }}
            variant="solid"
            disabled={totalIQReward <= 0}
            isLoading={isRewardClaimingLoading}
            onClick={handleClaimReward}
          >
            Claim Rewards
          </Button>
          <Button
            borderColor="divider2"
            variant="outline"
            fontSize={{ base: 'xs', md: 'sm' }}
            w={{ base: 120, md: 164 }}
            onClick={handleCheckPoint}
            isDisabled={
              hiiqBalance === 0 || userHiiqCheckPointed >= hiiqBalance
            }
            isLoading={isLoading}
          >
            Checkpoint
          </Button>
          <Tooltip
            color="grayText4"
            placement="top"
            rounded="lg"
            p={5}
            bg="tooltipBg"
            shouldWrapChildren
            hasArrow
            label="The checkpoint action is needed to keep track of the hiiq supply for a particular user."
          >
            <Icon color="brandText" as={RiQuestionLine} mr={1} />
          </Tooltip>
        </Stack>
        <Button
          onClick={() => setOpenUnlockNotification(true)}
          fontWeight="bold"
          color="brand.500"
          variant="ghost"
          disabled={!isExpired}
          isLoading={loading}
        >
          Unlock
        </Button>
      </VStack>
      <Stack
        direction="row"
        gap={4}
        justifyContent="space-between"
        px={{ base: '2.5', md: '0' }}
      >
        <Text
          display="flex"
          gap={1}
          fontSize="sm"
          cursor="pointer"
          color="brandLinkColor"
          onClick={() => setOpenRewardCalculator(true)}
          _hover={{ textDecoration: 'underline' }}
        >
          <Icon fontSize={20} as={RiCalculatorFill} />
          Calculator
        </Text>
        <Link
          href="https://etherscan.io/address/0xb55dcc69d909103b4de773412a22ab8b86e8c602"
          isExternal
          display="flex"
          gap={1}
          fontSize="sm"
        >
          <Icon fontSize={20} as={RiLinksLine} />
          View Contract
        </Link>
      </Stack>
    </Flex>
  )
}

export default LockedDetails
