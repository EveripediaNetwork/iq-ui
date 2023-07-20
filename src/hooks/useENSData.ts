import { useEffect, useState, useCallback } from 'react'
import { normalize } from 'viem/ens'
import { client } from '@/utils/getProvider'

export const useENSData = (address: string | undefined | null) => {
  const [avatar, setAvatar] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const getAvatar = useCallback(async (addrs: string) => {
    const name = await client.getEnsName({
      address: addrs as `0x${string}`,
    })
    let avatarURI
    if (name) {
      avatarURI = await client.getEnsAvatar({
        name: normalize(name),
      })
      if (avatarURI) setAvatar(avatarURI)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!avatar && address) {
      getAvatar(address)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, avatar])

  return [avatar, loading] as const
}
