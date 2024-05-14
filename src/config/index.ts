const config = {
  wikiContractAddress:
    process.env.NEXT_PUBLIC_WIKI_CONTRACT_ADDRESS ||
    '0xCFca7c16155DCff806f665E0C9b73281fCe62b7d',
  iqAddress:
    process.env.NEXT_PUBLIC_IQ_ADDRESS ||
    '0x579CEa1889991f68aCc35Ff5c3dd0621fF29b0C9',
  wiqAddress: '0x4Af20e15F5959A5Db8fA7Fa957DAc60eae7AFC22',
  hiiqAddress:
    process.env.NEXT_PUBLIC_HIIQ_ADDRESS ||
    '0x1396C8aDD1212784F6534D7938DC534aF448FA2C',
  treasuryHiIQAddress:
    process.env.NEXT_PUBLIC_TREASURY_HIIQ_ADDRESS ||
    '0xaCa39B187352D9805DECEd6E73A3d72ABf86E7A0',
  hiiqRewardAddress:
    process.env.NEXT_PUBLIC_HIIQREWARDS_ADDRESS ||
    '0xb61bC70681bbDf8C4e5eE9F0ef3654F0aC0f7D1E',
  blockExplorerUrl:
    process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL ||
    'https://testnet.braindao.org',
  infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
  alchemyApiKey: String(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY),
  alchemyChain: process.env.NEXT_PUBLIC_ALCHEMY_CHAIN || 'iqTestnet',
  graphqlUrl:
    process.env.NEXT_PUBLIC_EP_API || 'https://api.dev.braindao.org/graphql',
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID || '313377',
  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME || 'iqTestnet',
  ensRPC: String(process.env.NEXT_PUBLIC_ENS_RPC),
  publicDomain: String(process.env.NEXT_PUBLIC_DOMAIN),
  treasuryAddress: process.env.NEXT_PUBLIC_TREASURY_ADDRESS,
  fraxtalTreasuryAddress: process.env.NEXT_PUBLIC_FRAX_TREASURY_ADDRESS,
  eosChainId:
    process.env.NEXT_PUBLIC_EOS_CHAIN_ID ||
    'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  eosRpcProtocol: process.env.NEXT_PUBLIC_EOS_RPC_PROTOCOL || 'https',
  eosRpcHost: process.env.NEXT_PUBLIC_EOS_RPC_HOST || 'mainnet.eosn.io',
  eosRpcPort: process.env.NEXT_PUBLIC_EOS_RPC_PORT || 443,
  hiiqRewardsAddress: process.env.NEXT_PUBLIC_HIIQREWARDS_ADDRESS || '',
  etherScanApiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
  ethplorerApiKey: process.env.NEXT_PUBLIC_ETHPLORER_API_KEY || 'freekey',
  pMinterAddress: process.env.NEXT_PUBLIC_PMINTER_ADDRESS || '',
  pIqAddress:
    process.env.NEXT_PUBLIC_PIQ_ADDRESS ||
    '0xa23d33d5e0a61ba81919bfd727c671bb03ab0fea',
  brainyAddress: process.env.NEXT_PUBLIC_BRAINY_ADDRESS || '',
  gaugeCtrlAddress: process.env.NEXT_PUBLIC_GAUGE_CTRL_ADDRESS || '',
  gaugeRewardsDistributorAddress:
    process.env.NEXT_PUBLIC_GAUGE_REWARDS_DISTRIBUTOR_ADDRESS || '',
  nftFarmAddress: process.env.NEXT_PUBLIC_NFT_FARM_ADDRESS || '',
  debankApiKey: process.env.DEBANK_API_KEY,
  cmcApiKey: process.env.NEXT_PUBLIC_CMC_API_KEY,
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  isProd: process.env.NEXT_PUBLIC_IS_PROD === 'true',
}

export default config
