import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useBrainy } from '@/hooks/useBrainy'
import { useNFTGauge } from '@/hooks/useNFTGauge'
import GaugeSlider from './GaugeSlider'
import GaugesFormCommon from './GaugesFormCommon'
import { NftImage } from './brainyStakingElements'

const StakeBrainy = () => {
  const [nftId, setNftId] = useState<number | undefined>()
  const { approve, isTheOwner, tokenURI } = useBrainy()
  const [isLoading, setIsLoading] = useState(false)
  const [lockPeriod, setLockPeriod] = useState(7)
  const [lockEnd, setLockEnd] = useState('')
  const { lockedStakes, stake, stakeMoreBrainy } = useNFTGauge()
  const [nftURI, setNftURI] = useState('')
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

  const handleOnInputNftChange = async (tokenId: number) => {
    try {
      const { isError, tokenURI: URI } = await tokenURI(tokenId)
      if (!isError) {
        // setNftURI(URI)
        console.log(URI)
        setNftURI('/images/brainy-nft-image.png')
        setNftId(tokenId)
        showToast('NFT successfully fetched', 'success')
        return
      }
      setNftURI('/')
      showToast('Invalid Token Id', 'error')
    } catch (err: any) {
      console.log(err.response.message)
    }
  }

  const updateLockPeriod = (days: number) => {
    setLockPeriod(days)
    const now = new Date()
    now.setSeconds(days * 86400)
    setLockEnd(now.toUTCString())
  }

  const handleLock = async () => {
    if (typeof nftId === 'undefined') return

    setIsLoading(true)

    const isTheCurrentOwner = await isTheOwner(nftId)
    if (!isTheCurrentOwner) {
      showToast(
        'You need to be the owner of the nft before you can stake it',
        'error',
      )
      setIsLoading(false)
      return
    }

    const { isError, msg } = await approve(nftId)
    if (isError) {
      showToast(msg, isError ? 'error' : 'success')
      setIsLoading(false)
      return
    }

    if (lockedStakes.length < 1) {
      const { isError: error, msg: stakeMsg } = await stake(
        Number(nftId),
        lockPeriod,
      )
      showToast(stakeMsg, error ? 'error' : 'success')
      setIsLoading(false)
      return
    }
    const { isError: error, msg: stakeMsg } = await stakeMoreBrainy(
      Number(nftId),
      lockedStakes[0].kek_id,
    )
    showToast(stakeMsg, error ? 'error' : 'success')
    setIsLoading(false)
  }

  return (
    <>
      <NftImage
        nftURI={nftURI}
        action={(event) => handleOnInputNftChange(Number(event.target.value))}
      />
      {lockedStakes.length < 1 && (
        <GaugeSlider
          updateLockPeriod={(days: number) => updateLockPeriod(days)}
        />
      )}
      <GaugesFormCommon
        handler={handleLock}
        lockEnd={lockEnd}
        locking={isLoading}
      />
    </>
  )
}

export default StakeBrainy
