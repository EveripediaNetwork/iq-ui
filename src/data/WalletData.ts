import { Coinbase } from '@/components/icons/coinbase'
import { Metamask } from '@/components/icons/metamask'
import { Trevor } from '@/components/icons/trevor'
import { WalletConnect } from '@/components/icons/walletconnect'
import { IconProps } from '@chakra-ui/react'

export const WALLET_LOGOS: ((props: IconProps) => JSX.Element)[] = [
  Metamask,
  WalletConnect,
  Coinbase,
  Trevor,
]
