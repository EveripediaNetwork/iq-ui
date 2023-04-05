import React, { useEffect, useState } from 'react'
import {
  Flex,
  Box,
  Text,
  SimpleGrid,
  Select,
  Spacer,
  chakra,
} from '@chakra-ui/react'
import { useNFTGauge } from '@/hooks/useNFTGauge'
import { useBrainy } from '@/hooks/useBrainy'
import { useAccount } from 'wagmi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setCurrentStaking } from '@/store/slices/nftFarm-slice'
import { getGaugeName } from '@/utils/gauges.util'
import BrainiesStakes from './brainiesStakes'
import StakingInfo from '../lock/StakingInfo'
import StakeInfoIcon from '../elements/stakeCommon/StakeInfoIcon'
import StakeBrainy from './StakeBrainy'
import { StakingTabs } from './brainyStakingElements'
import IncreaseStakeTime from './IncreaseStakeTime'

type TokenIdType = {
  tokenId: number
}

const BrainyStaking = () => {
  const [, setNfts] = useState<TokenIdType[]>()
  const [openStakingInfo, setOpenStakingInfo] = useState(false)
  const { isConnected } = useAccount()
  const { getMintedNFTsByUser } = useBrainy()
  const { lockedStakes } = useNFTGauge()
  const dispatch = useDispatch()
  const { gauges } = useSelector((state: RootState) => state.gauges)
  const { currentStakingAddress } = useSelector(
    (state: RootState) => state.nftFarms,
  )

  const getMintedNfts = async () => {
    const result = await getMintedNFTsByUser()
    if (!result?.isError) setNfts(result?.nfts)
  }

  useEffect(() => {
    if (isConnected) getMintedNfts()
    else setNfts([])
  }, [isConnected])

  useEffect(() => {
    getMintedNfts()
  }, [])

  return (
    <SimpleGrid
      justifyContent="center"
      w="full"
      columns={{ base: 1, lg: 2 }}
      spacing={{ base: 8, lg: 16, '2xl': 4 }}
      my={7}
    >
      <Flex
        mb={3}
        w={[320, 430, 500]}
        rounded="lg"
        alignItems="center"
        direction="column"
        border="solid 1px "
        borderColor="divider"
        px={10}
        mx={{ base: 'auto', lg: '10' }}
      >
        <Flex
          w="100%"
          direction="row"
          py={6}
          alignItems="center"
          justifyContent="space-between"
        >
          <Select
            w="auto"
            fontSize={{ md: 'xl' }}
            fontWeight="bold"
            variant="unstyled"
            onChange={(value) =>
              dispatch(setCurrentStaking(value.target.value))
            }
            value={currentStakingAddress}
          >
            {gauges?.map((gauge) => (
              <option value={gauge.gaugeAddress}>{gauge.name}</option>
            ))}
          </Select>
          <Spacer />
          <StakeInfoIcon handler={setOpenStakingInfo} />
        </Flex>
        {lockedStakes.length > 0 && (
          <Box
            alignSelf="center"
            rounded="md"
            width={{ md: 355 }}
            bg="lightCard"
            textAlign="center"
            p={4}
            mb="4"
          >
            <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="medium">
              You have locked a total of{' '}
              <chakra.span fontWeight="bold">
                {lockedStakes.length} Brainie.
              </chakra.span>{' '}
              Expiring on{' '}
              <chakra.span fontWeight="bold">
                {lockedStakes[0].endingTimestamp}
              </chakra.span>
            </Text>
          </Box>
        )}
        <StakingTabs
          arrayNum={lockedStakes.length}
          firstElement={<StakeBrainy />}
          secondElement={<IncreaseStakeTime />}
          texts={['Stake more NFTs', 'Increase Stake time']}
        />
      </Flex>
      <BrainiesStakes
        currentGauge={getGaugeName(gauges, currentStakingAddress)}
      />
      <StakingInfo
        isOpen={openStakingInfo}
        onClose={() => setOpenStakingInfo(false)}
        isBrainyStaking
      />
    </SimpleGrid>
  )
}

export default BrainyStaking
