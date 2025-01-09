import React, { useEffect, useState } from 'react'
import {
  Button,
  Flex,
  Icon,
  Text,
  Stack,
  VStack,
  chakra,
} from '@chakra-ui/react'
import { RiCalculatorFill, RiLinksLine } from 'react-icons/ri'
import { useLockOverview } from '@/hooks/useLockOverview'
import * as Humanize from 'humanize-plus'
import { useReward } from '@/hooks/useReward'
import { useAccount, useWaitForTransaction } from 'wagmi'
import { Dict } from '@chakra-ui/utils'
import { useGetIqPriceQuery } from '@/services/iqPrice'
import { useReusableToast } from '@/hooks/useToast'
import { useLockEnd } from '@/hooks/useLockEnd'
import Link from '../elements/LinkElements/Link'
import StakeHeader from '../elements/stakeCommon/StakeHeader'
import TooltipElement from '../elements/Tooltip/TooltipElement'
import ClaimModal from './ClaimWarningModal'
import { CLAIM_WARNING_THRESHOLD } from '@/data/LockConstants'
import { usePostHog } from 'posthog-js/react'
import { useTranslations } from 'next-intl'

const LockedDetails = ({
  setOpenUnlockNotification,
  setOpenRewardCalculator,
  loading,
}: {
  setOpenUnlockNotification: (status: boolean) => void
  setOpenRewardCalculator: (status: boolean) => void
  loading: boolean
}) => {
  const { userTotalIQLocked, hiiqBalance } = useLockOverview()
  const { lockEndDate } = useLockEnd()
  const {
    checkPoint,
    rewardEarned,
    getYield,
    totalRewardEarned,
    userHiiqCheckPointed,
    refetchTotalRewardEarned,
  } = useReward()
  const [reward, setReward] = useState(0)
  const [refetchedData, setRefetchedData] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [daysDiff, setDaysDiff] = useState(0)
  const [totalIQReward, setTotalIQReward] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isRewardClaimingLoading, setIsRewardClaimingLoading] = useState(false)
  const [trxHash, setTrxHash] = useState()
  const [hasClaimed, setHasClaimed] = useState(false)
  const { data } = useWaitForTransaction({ hash: trxHash })
  const { isConnected, address } = useAccount()
  const { data: iqData } = useGetIqPriceQuery('IQ')
  const price = iqData?.response?.[0]?.quote?.USD?.price || 0.0
  const { showToast } = useReusableToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const closeModal = () => setIsModalOpen(false)
  const posthog = usePostHog()

  const t = useTranslations('hiiq.lockedDetails')

  useEffect(() => {
    const resolveReward = async () => {
      const resolvedReward = await rewardEarned()
      setTotalIQReward(resolvedReward)
      if (price > 0) {
        setReward(resolvedReward * price)
      }
    }
    if ((totalRewardEarned || refetchedData) && isConnected) {
      resolveReward()
    }
  }, [totalRewardEarned, refetchedData, isConnected, rewardEarned])

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
  }, [lockEndDate])

  const resetValues = () => {
    setIsLoading(false)
    setTrxHash(undefined)
    setIsRewardClaimingLoading(false)
    refetchTotalRewardEarned()
    setRefetchedData(true)
    setHasClaimed(true)
  }

  useEffect(() => {
    if (trxHash && data) {
      if (data.status) {
        showToast('Transaction successfully performed', 'success')
        resetValues()
      } else {
        showToast('Transaction could not be completed', 'error')
        resetValues()
      }
    }
  }, [data, trxHash])

  const handleCheckPointOrClaimReward = async (
    loadingAction: (value: React.SetStateAction<boolean>) => void,
    resultAction: () => Promise<any>,
    logAction: string,
  ) => {
    loadingAction(true)
    try {
      const result = await resultAction()
      setTrxHash(result.hash)
      posthog.capture(logAction.toLocaleLowerCase(), {
        category: 'lock',
        userAddress: address,
      })
      if (logAction === 'CLAIM_REWARD' && result) {
        setHasClaimed(true)
      }
    } catch (err) {
      const errorObject = err as Dict
      if (errorObject?.code === 'ACTION_REJECTED') {
        showToast('Transaction cancelled by user', 'error')
      }
      loadingAction(false)
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
      <StakeHeader title="Current Stake" />
      <VStack align="center">
        <Text color="grayText4" fontSize="md" fontWeight="medium">
          {t('iqStaked')}
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {Humanize.formatNumber(userTotalIQLocked, 2)} IQ
        </Text>
      </VStack>
      <VStack align="center">
        <Text color="grayText4" fontSize="md" fontWeight="medium">
          {t('hiiqBalance')}
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {Humanize.formatNumber(hiiqBalance, 2)} HiIQ
        </Text>
      </VStack>
      <VStack align="center">
        <Text color="grayText4" fontSize="md" fontWeight="medium">
          {t('timeRemaining')}
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {daysDiff < 1 ? '-' : `${daysDiff.toFixed(0)} days`}
        </Text>
      </VStack>
      <VStack align="center">
        <Text color="grayText4" fontSize="md" fontWeight="medium">
          {t('claimableReward')}
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
            isDisabled={totalIQReward <= 0}
            isLoading={isRewardClaimingLoading}
            onClick={() =>
              handleCheckPointOrClaimReward(
                setIsRewardClaimingLoading,
                getYield,
                'CLAIM_REWARD',
              )
            }
          >
            {t('claimRewards')}
          </Button>
          <Button
            borderColor="divider2"
            variant="outline"
            fontSize={{ base: 'xs', md: 'sm' }}
            w={{ base: 120, md: 164 }}
            onClick={() =>
              handleCheckPointOrClaimReward(
                setIsLoading,
                checkPoint,
                'CHECKPOINT',
              )
            }
            isDisabled={
              hiiqBalance === 0 || userHiiqCheckPointed >= hiiqBalance
            }
            isLoading={isLoading}
          >
            {t('checkpoint')}
          </Button>
          <TooltipElement text={t('checkpointTooltip')} />
        </Stack>
        <Button
          onClick={
            totalIQReward >= CLAIM_WARNING_THRESHOLD && !hasClaimed
              ? () => setIsModalOpen(true)
              : () => setOpenUnlockNotification(true)
          }
          fontWeight="bold"
          color="brand.500"
          variant="ghost"
          isDisabled={!isExpired}
          isLoading={loading}
        >
          {t('unlock')}
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
          {t('calculator')}
        </Text>
        <Link
          href="https://etherscan.io/address/0xb55dcc69d909103b4de773412a22ab8b86e8c602"
          isExternal
          display="flex"
          gap={1}
          fontSize="sm"
        >
          <Icon fontSize={20} as={RiLinksLine} />
          {t('viewContract')}
        </Link>
      </Stack>
      <ClaimModal
        isOpen={isModalOpen}
        onClose={closeModal}
        isLoading={isRewardClaimingLoading}
        isDisabled={totalIQReward < CLAIM_WARNING_THRESHOLD || hasClaimed}
        onYes={() => {
          handleCheckPointOrClaimReward(
            setIsRewardClaimingLoading,
            getYield,
            'CLAIM_REWARD',
          )
        }}
      />
    </Flex>
  )
}

export default LockedDetails
