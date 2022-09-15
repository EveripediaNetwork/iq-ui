import { useEffect, useState } from 'react'
import { provider } from '@/utils/getProvider'

export const useENSData = (address: string | undefined | null) => {
  const [avatar, setAvatar] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const getAvatar = async (addrs: string) => {
      const name = await provider.lookupAddress(addrs)
      let avatarURI
      if (name) {
        avatarURI = await provider.getAvatar(name)
        if (avatarURI) setAvatar(avatarURI)
      }
      setLoading(false)
    }

    if (!avatar && address) {
      getAvatar(address)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, avatar])

  return [avatar, loading] as const
}
