import React, { useEffect, useState } from 'react'
import { Icon, Divider, Flex, Text, Button, useToast } from '@chakra-ui/react'
import { RiLinksLine } from 'react-icons/ri'
import { useNFTGauge } from '@/hooks/useNFTGauge'
import config from '@/config'
import { useAccount } from 'wagmi'
import { Stake } from '@/types/gauge'

const BrainiesStakes = () => {
  const { address, isDisconnected } = useAccount()
  const { lockedStakes, earned, claimReward, unlockStakes } = useNFTGauge()
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
      p={5}
      mb={4}
      borderRadius="12px"
      w={[360, 376]}
      direction="column"
      alignItems="center"
      justifyContent="center"
      border="lightgray solid 1px"
    >
      <Flex
        mb={6}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize="24px">Current Stakes</Text>
        <Divider />
      </Flex>
      {lockedStakes ? (
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          mb={6}
        >
          <Text fontSize="16px">Brainies locked</Text>
          <Text fontWeight="bold">{lockedStakes.length}</Text>
        </Flex>
      ) : null}
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        mb={6}
      >
        <Text fontSize="16px">Rewards Earned</Text>
        <Text fontWeight="bold">{earned}</Text>
      </Flex>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        mb={6}
      >
        <Text fontSize="16px">Time Remaining</Text>
        {lockedStakes.map((s: Stake, index: number) => (
          <Text fontSize="14px" key={index}>
            <strong>Stake {index + 1}:</strong> {s.endingTimestamp}
          </Text>
        ))}
      </Flex>
      <Flex mb={12} direction="row" justifyContent="space-around">
        <Button
          isLoading={isClaiming}
          loadingText="Claiming Rewards"
          onClick={handleRewardsClaim}
          disabled={isDisconnected || isClaiming}
        >
          Claim Rewards
        </Button>
        <Button
          isLoading={isUnlocking}
          onClick={() => performUnlock()}
          loadingText="Unlocking"
          isDisabled={!isAnyStakeExpired}
          ml={2}
          variant="outline"
        >
          Unlock
        </Button>
      </Flex>
      <Flex
        w="100%"
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          target="_blank"
          as="a"
          href={`${config.blockExplorerUrl}address/${config.gaugeCtrlAddress}`}
          direction="row"
          alignItems="center"
        >
          <Icon fontSize={12} color="brand.400" as={RiLinksLine} />
          <Text fontSize={14} color="brand.400" ml={1}>
            Rewards Distributor
          </Text>
        </Flex>
        <Flex
          cursor="pointer"
          as="a"
          href={`${config.blockExplorerUrl}address/${config.gaugeCtrlAddress}`}
          target="_blank"
          direction="row"
          alignItems="center"
          ml={2}
        >
          <Icon fontSize={12} color="brand.400" as={RiLinksLine} />
          <Text fontSize={14} color="brand.400" ml={1}>
            Gauge Controller
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default BrainiesStakes
