import { env } from '@/env.mjs'

const config = {
  iqAddress: env.NEXT_PUBLIC_IQ_ADDRESS,
  hiiqAddress: env.NEXT_PUBLIC_HIIQ_ADDRESS,
  hiiqRewardAddress: env.NEXT_PUBLIC_HIIQREWARDS_ADDRESS,
  blockExplorerUrl: env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL,
  infuraId: env.NEXT_PUBLIC_INFURA_ID,
  alchemyApiKey: env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  alchemyChain: env.NEXT_PUBLIC_ALCHEMY_CHAIN,
  graphqlUrl: env.NEXT_PUBLIC_EP_API,
  chainId: env.NEXT_PUBLIC_CHAIN_ID,
  ensRPC: env.NEXT_PUBLIC_ENS_RPC,
  treasuryAddress: env.NEXT_PUBLIC_TREASURY_ADDRESS,
  eosChainId: env.NEXT_PUBLIC_EOS_CHAIN_ID,
  eosRpcProtocol: env.NEXT_PUBLIC_EOS_RPC_PROTOCOL,
  eosRpcHost: env.NEXT_PUBLIC_EOS_RPC_HOST,
  eosRpcPort: env.NEXT_PUBLIC_EOS_RPC_PORT,
  hiiqRewardsAddress: env.NEXT_PUBLIC_HIIQREWARDS_ADDRESS,
  pMinterAddress: env.NEXT_PUBLIC_PMINTER_ADDRESS,
  pIqAddress: env.NEXT_PUBLIC_PIQ_ADDRESS,
  brainyAddress: env.NEXT_PUBLIC_BRAINY_ADDRESS,
  gaugeCtrlAddress: env.NEXT_PUBLIC_GAUGE_CTRL_ADDRESS,
  gaugeRewardsDistributorAddress:
    env.NEXT_PUBLIC_GAUGE_REWARDS_DISTRIBUTOR_ADDRESS,
  nftFarmAddress: env.NEXT_PUBLIC_NFT_FARM_ADDRESSES.split('')[0],
  debankApiKey: env.NEXT_PUBLIC_DEBANK_API_KEY,
  cmcApiKey: env.NEXT_PUBLIC_CMC_API_KEY,
  walletConnectProjectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
}

export default config
