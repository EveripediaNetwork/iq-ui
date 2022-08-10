import { Anchor } from 'ual-anchor'

import config from '@/config'

const appName = 'IQ Dashboard'

const chain = {
  chainId: config.eosChainId || '',
  rpcEndpoints: [
    {
      protocol: config.eosRpcProtocol || '',
      host: config.eosRpcHost || '',
      port: Number(config.eosRpcPort),
    },
  ],
}

const anchor = new Anchor([chain], {
  appName,
  service: 'https://cb.anchor.link',
  disableGreymassFuel: false,
  requestStatus: false,
})

const supportedAuthenticators = [anchor]
const supportedChains = [chain]

export { appName, supportedChains, supportedAuthenticators }
