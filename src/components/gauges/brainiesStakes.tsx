import React, { useEffect, useState } from 'react'
import {
  Icon,
  Divider,
  Flex,
  Text,
  Button,
  useToast,
  VStack,
  Heading,
  Link,
  Stack,
} from '@chakra-ui/react'
import { RiLinksLine } from 'react-icons/ri'
import { useNFTGauge } from '@/hooks/useNFTGauge'
import config from '@/config'
import { useAccount } from 'wagmi'
import { Stake } from '@/types/gauge'
import StakeHeader from '../elements/StakeHeader'

const StakeInfo = ({
  title,
  details,
  identifier,
}: {
  title: string
  details: Stake[]
  identifier: string
}) => {
  return (
    <VStack align="center">
      <Text color="grayText4" fontSize="md" fontWeight="medium">
        {title}
      </Text>
      {details.length > 0 ? (
        details.map((s: Stake, index: number) => (
          <Text fontSize="lg" fontWeight="bold" key={index}>
            {identifier === 'START' ? s.startTimestamp : s.endingTimestamp}
          </Text>
        ))
      ) : (
        <Text fontSize="lg" fontWeight="bold">
          -
        </Text>
      )}
    </VStack>
  )
}

const BrainiesStakes = ({ currentGauge }: { currentGauge: string }) => {
  const { address, isDisconnected } = useAccount()
  const {
    lockedStakes,
    earned,
    claimReward,
    unlockStakes,
    totalLiquidityLocked,
  } = useNFTGauge()
  const [isClaiming, setIsClaiming] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [expiredKekId, setExpiredKekId] = useState<string>()
  const [isAnyStakeExpired, setIsAnyStakeExpired] = useState(false)
  const toast = useToast()

  const handleRewardsClaim = async () => {
    setIsClaiming(true)
    const { isError, msg } = await claimReward(String(address))
    toast({
      title: msg,
      position: 'top-right',
      isClosable: true,
      status: isError ? 'error' : 'success',
    })
    setIsClaiming(false)
  }

  const performUnlock = async () => {
    if (!expiredKekId) return

    setIsUnlocking(true)

    const { isError, msg } = await unlockStakes(expiredKekId)
    toast({
      title: msg,
      position: 'top-right',
      isClosable: true,
      status: isError ? 'error' : 'success',
    })
    setIsUnlocking(false)
  }

  useEffect(() => {
    if (lockedStakes)
      lockedStakes.forEach((s: Stake) => {
        if (s.expired === true) {
          setIsAnyStakeExpired(true)
          setExpiredKekId(s.kek_id)
        }
      })
  }, [lockedStakes])

  return (
    <Flex
      direction="column"
      py="6"
      rounded="lg"
      border="solid 1px "
      borderColor="divider"
      align="center"
      maxW={{ base: 400 }}
      w="full"
      rowGap={5}
      mx={{ base: 'auto', lg: '10' }}
      mb="auto"
    >
      <StakeHeader title="Current Stakes"/>
      <VStack align="center">
        <Text color="grayText4" fontSize="md" fontWeight="medium">
          {currentGauge} Locked
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {lockedStakes.length} / {totalLiquidityLocked}
        </Text>
      </VStack>
      <StakeInfo
        identifier="START"
        title="Date Locked"
        details={lockedStakes}
      />
      <VStack align="center">
        <Text color="grayText4" fontSize="md" fontWeight="medium">
          Rewards Earned
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {earned}
        </Text>
      </VStack>
      <StakeInfo
        identifier="END"
        title="Time Remaining"
        details={lockedStakes}
      />
      <VStack rowGap={2}>
        <Stack direction="row" spacing={3}>
          <Button
            fontSize={{ base: 'xs', md: 'sm' }}
            w={{ base: 120, md: 164 }}
            variant="solid"
            isLoading={isClaiming}
            loadingText="Claiming Rewards"
            onClick={handleRewardsClaim}
            disabled={isDisconnected || isClaiming || !earned || earned < 1}
          >
            Claim Rewards
          </Button>
          <Button
            borderColor="divider2"
            variant="outline"
            fontSize={{ base: 'xs', md: 'sm' }}
            w={{ base: 120, md: 164 }}
            isLoading={isUnlocking}
            onClick={() => performUnlock()}
            loadingText="Unlocking"
            isDisabled={!isAnyStakeExpired}
          >
            Unlock
          </Button>
        </Stack>
      </VStack>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        gap={2}
        px={{ base: '2.5', md: '0' }}
      >
        <Link
          href={`${config.blockExplorerUrl}address/${config.gaugeCtrlAddress}`}
          isExternal
          display="flex"
          gap={1}
          fontSize="sm"
          color="brandLinkColor"
          _hover={{ textDecoration: 'underline' }}
        >
          <Icon fontSize={20} as={RiLinksLine} />
          Reward Distributor
        </Link>
        <Link
          href={`${config.blockExplorerUrl}address/${config.gaugeCtrlAddress}`}
          isExternal
          display="flex"
          gap={1}
          fontSize="sm"
          color="brandLinkColor"
          _hover={{ textDecoration: 'underline' }}
        >
          <Icon fontSize={20} as={RiLinksLine} />
          Gauge Controller
        </Link>
      </Stack>
    </Flex>
  )
}

export default BrainiesStakes
