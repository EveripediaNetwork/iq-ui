import config from '@/config'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

if (typeof window !== 'undefined') {
  posthog.init(config.posthugApikey, {
    api_host: '/ingest',
    ui_host: 'https://us.posthog.com',
    person_profiles: 'identified_only',
  })
}

export const CSPostHogProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  return (
    <PostHogProvider client={posthog}>
      <PosthogAuthWrapper>{children}</PosthogAuthWrapper>
    </PostHogProvider>
  )
}

function PosthogAuthWrapper({ children }: React.PropsWithChildren<{}>) {
  const { address, connector } = useAccount()

  useEffect(() => {
    const identifyUser = async () => {
      const chainId = await connector?.getChainId()
      if (address) {
        posthog.identify(address, {
          chainId,
          connector: connector?.name,
        })
      }
    }
    identifyUser()
  }, [address])

  return <>{children}</>
}
