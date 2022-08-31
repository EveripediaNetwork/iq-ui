import { DashboardLayout } from '@/components/dashboard/layout'
import LockForm from '@/components/lock/LockForm'
import LockFormCommon from '@/components/lock/LockFormCommon'
import RewardCalculator from '@/components/lock/RewardCalculator'
import StakingInfo from '@/components/lock/StakingInfo'
import UnlockNotification from '@/components/lock/UnlockNotification'
import {
  Flex,
  Heading,
  Icon,
  Text,
  Box,
  SimpleGrid,
  Spacer,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  useToast,
  chakra,
} from '@chakra-ui/react'
import React, { useState, useEffect, useCallback } from 'react'
import { RiQuestionLine } from 'react-icons/ri'
import LockOverview from '@/components/lock/LockOverview'
import LockedDetails from '@/components/lock/LockedDetails'
import { useLockOverview } from '@/hooks/useLockOverview'
import * as Humanize from 'humanize-plus'
import { useLock } from '@/hooks/useLock'
import { useReward } from '@/hooks/useReward'
import { useWaitForTransaction, useNetwork, useSwitchNetwork } from 'wagmi'
import NetworkErrorNotification from '@/components/lock/NetworkErrorNotification'
import config from '@/config'

const Lock = () => {
  const [openUnlockNotification, setOpenUnlockNotification] = useState(false)
  const [openStakingInfo, setOpenStakingInfo] = useState(false)
  const [openRewardCalculator, setOpenRewardCalculator] = useState(false)
  const { userTotalIQLocked, lockEndDate } = useLockOverview()
  const { increaseLockPeriod, withdraw } = useLock()
  const { checkPoint } = useReward()
  const [loading, setLoading] = useState(false)
  const [isProcessingUnlock, setIsProcessingUnlock] = useState(false)
  const [trxHash, setTrxHash] = useState()
  const { data } = useWaitForTransaction({ hash: trxHash })
  const toast = useToast()
  const [openErrorNetwork, setOpenErrorNetwork] = useState(false)
  const { chain } = useNetwork()
  const chainId = parseInt(config.chainId)
  const { switchNetwork, isSuccess } = useSwitchNetwork()

  const handleExtendLockPeriod = async (newLockEnd: Date) => {
    setLoading(true)
    const result = await increaseLockPeriod(newLockEnd.getTime())
    if (!result) {
      toast({
        title: `Transaction failed`,
        position: 'top-right',
        isClosable: true,
        status: 'error',
      })
      setLoading(false)
    }
    setTrxHash(result.hash)
  }

  const resetValues = () => {
    setLoading(false)
    setIsProcessingUnlock(false)
    setTrxHash(undefined)
  }

  useEffect(() => {
    if (trxHash && data) {
      if (data.status) {
        toast({
          title: `Transaction successfully performed`,
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
  }, [data, checkPoint, toast, trxHash])

  const handleUnlock = async () => {
    setOpenUnlockNotification(false)
    setIsProcessingUnlock(true)
    if (
      lockEndDate &&
      typeof lockEndDate !== 'number' &&
      new Date().getTime() > lockEndDate.getTime()
    ) {
      const result = await withdraw()
      if (!result) {
        toast({
          title: `Transaction failed`,
          position: 'top-right',
          isClosable: true,
          status: 'error',
        })
        setIsProcessingUnlock(false)
      }
      setTrxHash(result.hash)
      return
    }
    toast({
      title: `You can only unlock your fund after the lock period`,
      position: 'top-right',
      isClosable: true,
      status: 'error',
    })
    setIsProcessingUnlock(false)
  }

  const handleChainChanged = useCallback(
    (chainDetails: number | undefined) => {
      if (chainDetails && chainDetails !== chainId) {
        setOpenErrorNetwork(true)
      }
    },
    [chainId],
  )

  useEffect(() => {
    if (chain?.id !== chainId) {
      handleChainChanged(chain?.id)
    }
    if (isSuccess && chainId === chain?.id) {
      setOpenErrorNetwork(false)
    }
  }, [chain, handleChainChanged, isSuccess, chainId])

  const handleNetworkSwitch = () => {
    if (switchNetwork) {
      switchNetwork(chainId)
    }
  }

  return (
    <DashboardLayout>
      <Flex direction="column" gap="6" pt="4" pb="20">
        <Flex direction="column" gap="2">
          <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
            HiIQ
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="fadedText">
            Lock IQ token over a period of time and earn IQ token rewards.
          </Text>
        </Flex>
        <LockOverview />
        <Flex pb="10" w="full" mt="3">
          <SimpleGrid
            justifyContent="center"
            ml={{ lg: '3%' }}
            w="full"
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 8, lg: 0, '2xl': 4 }}
          >
            <Flex
              maxW={{ base: 526, lg: '576' }}
              w="full"
              p="5"
              rounded="lg"
              border="solid 1px"
              borderColor="divider"
              direction="column"
              gap="6"
              mx="auto"
              mb="auto"
            >
              <Flex gap="2.5" align="center">
                <Heading fontWeight="bold" fontSize={{ md: 'xl', lg: '2xl' }}>
                  Lock IQ
                </Heading>
                <Spacer />
                <Icon
                  color="brandText"
                  cursor="pointer"
                  onClick={() => setOpenStakingInfo(true)}
                  fontSize={20}
                  as={RiQuestionLine}
                />
              </Flex>
              {userTotalIQLocked > 0 && typeof lockEndDate !== 'number' && (
                <Box
                  alignSelf="center"
                  rounded="md"
                  width={{ md: 355 }}
                  bg="lightCard"
                  textAlign="center"
                  p={4}
                >
                  <Text fontSize={{ base: 'xs', md: 'sm' }}>
                    You have locked a total of{' '}
                    <chakra.span fontWeight="bold">
                      {Humanize.formatNumber(userTotalIQLocked, 2)}
                    </chakra.span>{' '}
                    IQ. Expiring on{' '}
                    <chakra.span fontWeight="bold">
                      {lockEndDate.toUTCString()}
                    </chakra.span>
                  </Text>
                </Box>
              )}
              <Tabs variant="unstyled">
                {userTotalIQLocked > 0 && (
                  <TabList display="flex" justifyContent="center">
                    <Tab
                      px={{ base: 3, md: 4 }}
                      border="1px solid"
                      fontWeight={{ md: 'bold' }}
                      fontSize="xs"
                      borderColor="divider2"
                      borderLeftRadius="5"
                      borderRightColor="transparent"
                      _selected={{ color: 'white', bg: 'brandText' }}
                    >
                      Stake more IQ
                    </Tab>
                    <Tab
                      px={{ base: 3, md: 4 }}
                      border="1px solid"
                      fontWeight={{ md: 'bold' }}
                      fontSize="xs"
                      borderColor="divider2"
                      borderRightRadius="5"
                      borderLeftColor="transparent"
                      _selected={{ color: 'white', bg: 'brandText' }}
                    >
                      Increase Lock time
                    </Tab>
                  </TabList>
                )}
                <TabPanels>
                  <TabPanel p={0} pt={6}>
                    <LockForm />
                  </TabPanel>
                  <TabPanel p={0} mt={7}>
                    <VStack rowGap={6}>
                      <LockFormCommon
                        isLoading={loading}
                        handleLockPeriodUpdate={(newUnlockDate: Date) =>
                          handleExtendLockPeriod(newUnlockDate)
                        }
                        hasSlider
                        hasNewLockDate
                      />
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
            <LockedDetails
              setOpenUnlockNotification={status =>
                setOpenUnlockNotification(status)
              }
              setOpenRewardCalculator={status =>
                setOpenRewardCalculator(status)
              }
              loading={isProcessingUnlock}
            />
          </SimpleGrid>
        </Flex>
      </Flex>
      <UnlockNotification
        isOpen={openUnlockNotification}
        onClose={() => setOpenUnlockNotification(false)}
        handleUnlock={handleUnlock}
      />
      <StakingInfo
        isOpen={openStakingInfo}
        onClose={() => setOpenStakingInfo(false)}
      />
      <RewardCalculator
        isOpen={openRewardCalculator}
        onClose={() => setOpenRewardCalculator(false)}
      />
      <NetworkErrorNotification
        switchNetwork={handleNetworkSwitch}
        isOpen={openErrorNetwork}
        onClose={() => setOpenErrorNetwork(false)}
      />
    </DashboardLayout>
  )
}

export default Lock
