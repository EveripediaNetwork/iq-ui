import { AuthContextType } from '@/types/bridge'
import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { UALContext, UALProvider } from 'ual-reactjs-renderer'
import {
  appName,
  supportedAuthenticators,
  supportedChains,
} from './UalProvider'

export const WalletProviderContext = createContext({})

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const authContext = useContext<AuthContextType>(UALContext)
  const { activeUser, showModal, logout } = authContext
  const [walletState, setWalletState] = useState({
    // eslint-disable-next-line react/no-unused-state
    activeUser,
    // eslint-disable-next-line react/no-unused-state
    showModal: () => {
      showModal()
    },
    // eslint-disable-next-line react/no-unused-state
    logout: () => logout(),
    tweaker: 0,
  })

  /**
   * when user is logged in/out update the provider's state
   */
  useEffect(() => {
    setWalletState(prev => ({
      ...prev,
      activeUser,
      tweaker: prev.tweaker + 1,
    }))
  }, [activeUser])

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
export const UALProviderSwitch = ({ children }: { children: ReactNode }) => (
  <UALProvider
    chains={supportedChains}
    authenticators={supportedAuthenticators}
    appName={appName}
  >
    {children}
  </UALProvider>
)
