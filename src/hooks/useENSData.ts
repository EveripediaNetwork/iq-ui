import { useEffect, useState, useCallback } from 'react'
import { provider } from '@/utils/getProvider'

export const useENSData = (address: string | undefined | null) => {
  const [avatar, setAvatar] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const getAvatar = useCallback(
    async (addrs: string) => {
      const name = await provider.lookupAddress(addrs)
      let avatarURI
      if (name) {
        avatarURI = await provider.getAvatar(name)
        if (avatarURI) setAvatar(avatarURI)
      }
      setLoading(false)
    },
    [],
  )

  useEffect(() => {
    if (!avatar && address) {
      getAvatar(address)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, avatar])

  return [avatar, loading] as const
}
