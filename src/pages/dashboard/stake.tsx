import RewardCalculator from '@/components/lock/RewardCalculator'
import StakingInfo from '@/components/lock/StakingInfo'
import UnlockNotification from '@/components/lock/UnlockNotification'
import {
  Flex,
  Heading,
  Text,
  Box,
  SimpleGrid,
  Spacer,
  useToast,
  chakra,
} from '@chakra-ui/react'
import React, { useState, useEffect, useCallback } from 'react'
import LockOverview from '@/components/lock/LockOverview'
import LockedDetails from '@/components/lock/LockedDetails'
import { useLockOverview } from '@/hooks/useLockOverview'
import * as Humanize from 'humanize-plus'
import { useLock } from '@/hooks/useLock'
import { useReward } from '@/hooks/useReward'
import { useWaitForTransaction, useNetwork, useSwitchNetwork } from 'wagmi'
import NetworkErrorNotification from '@/components/lock/NetworkErrorNotification'
import config from '@/config'
import StakeIQ from '@/components/lock/StakeIQ'
import IncreaseLockTime from '@/components/lock/IncreaseLockTime'
import { Dict } from '@chakra-ui/utils'
import { NextSeo } from 'next-seo'
import { useIQRate } from '@/hooks/useRate'
import PageHeader from '@/components/dashboard/PageHeader'
import StakeInfoIcon from '@/components/elements/stakeCommon/StakeInfoIcon'
import { StakingTabs } from '@/components/gauges/brainyStakingElements'
import { useLockEnd } from '@/hooks/useLockEnd'

const Lock = () => {
  const [openUnlockNotification, setOpenUnlockNotification] = useState(false)
  const [openStakingInfo, setOpenStakingInfo] = useState(false)
  const [openRewardCalculator, setOpenRewardCalculator] = useState(false)
  const { userTotalIQLocked } = useLockOverview()
  const { withdraw } = useLock()
  const { checkPoint } = useReward()
  const [isProcessingUnlock, setIsProcessingUnlock] = useState(false)
  const [trxHash, setTrxHash] = useState()
  const { data } = useWaitForTransaction({ hash: trxHash })
  const toast = useToast()
  const [openErrorNetwork, setOpenErrorNetwork] = useState(false)
  const { chain } = useNetwork()
  const chainId = parseInt(config.chainId)
  const { switchNetwork, isSuccess } = useSwitchNetwork()
  const { rate: exchangeRate } = useIQRate()
  const resetValues = () => {
    setIsProcessingUnlock(false)
    setTrxHash(undefined)
  }
  const { lockEndDate } = useLockEnd()

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
      try {
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
        setIsProcessingUnlock(false)
        return
      }
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
    <>
      <NextSeo
        title="Stake Page"
        description="Stake IQ to earn IQ token rewards and NFT raffles. The more IQ staked and longer you stake for the greater the rewards you earn and the chance of winning NFTs."
        openGraph={{
          title: 'IQ Stake',
          description:
            'Stake IQ to earn IQ token rewards and NFT raffles. The more IQ staked and longer you stake for the greater the rewards you earn and the chance of winning NFTs.',
        }}
      />
      <Flex pt={{ base: '5', lg: '6' }} direction="column" gap="6" pb="20">
        <PageHeader
          header="HiIQ"
          body="Stake IQ to earn IQ token rewards and NFT raffles. The more IQ
            staked and longer you stake for the greater the rewards you earn and
            the chance of winning NFTs."
        />
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
                  Stake IQ
                </Heading>
                <Spacer />
                <StakeInfoIcon handler={setOpenStakingInfo} />
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
                  <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="medium">
                    You have Staked a total of{' '}
                    <chakra.span fontWeight="bold">
                      {Humanize.formatNumber(userTotalIQLocked, 2)}
                    </chakra.span>{' '}
                    IQ. Expiring on{' '}
                    <chakra.span fontWeight="bold">
                      {lockEndDate?.toUTCString()}
                    </chakra.span>
                  </Text>
                </Box>
              )}
              <StakingTabs
                texts={['Stake more IQ', 'Increase Stake time']}
                arrayNum={userTotalIQLocked}
                firstElement={<StakeIQ exchangeRate={exchangeRate} />}
                secondElement={<IncreaseLockTime />}
              />
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
    </>
  )
}

export default Lock
