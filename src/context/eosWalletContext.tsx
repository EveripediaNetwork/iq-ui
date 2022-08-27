import { AuthContextType } from '@/types/bridge'
import React, { useContext, createContext, useState, useEffect } from 'react'
import { UALContext, UALProvider } from 'ual-reactjs-renderer'
import {
  appName,
  supportedAuthenticators,
  supportedChains,
} from './UalProvider'

export const WalletProviderContext = createContext<any>(null)

export const WalletProvider = ({ children }: any) => {
  const authContext = useContext<AuthContextType>(UALContext)
  const [walletState, setWalletState] = useState({
    // eslint-disable-next-line react/no-unused-state
    activeUser: authContext.activeUser,
    // eslint-disable-next-line react/no-unused-state
    showModal: () => {
      authContext.showModal()
    },
    // eslint-disable-next-line react/no-unused-state
    logout: () => authContext.logout(),
    tweaker: 0,
  })

  /**
   * when user is logged in/out update the provider's state
   */
  useEffect(() => {
    setWalletState({
      ...walletState,
      activeUser: authContext.activeUser,
      tweaker: walletState.tweaker + 1,
    })
  }, [authContext.activeUser])

  return (
    <WalletProviderContext.Provider value={walletState}>
      {children}
    </WalletProviderContext.Provider>
  )
}

/**
 * if in an iframe then use parent wallet provider otherwise use local
 * @param children
 * @returns {*}
 * @constructor
 */
export const UALProviderSwitch = ({ children }: any) => (
  <UALProvider
    chains={supportedChains}
    authenticators={supportedAuthenticators}
    appName={appName}
  >
    {children}
  </UALProvider>
)
