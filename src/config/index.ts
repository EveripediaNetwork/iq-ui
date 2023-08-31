const config = {
  wikiContractAddress:
    process.env.NEXT_PUBLIC_WIKI_CONTRACT_ADDRESS ||
    '0x94bb4c72252d0ae7a98b2b0483Dc4145C0C79059',
  iqAddress:
    process.env.NEXT_PUBLIC_IQ_ADDRESS ||
    '0x0552D756a3E92Aa874EF60F61b7a29030373e869',
  hiiqAddress:
    process.env.NEXT_PUBLIC_HIIQ_ADDRESS ||
    '0xC03bCACC5377b7cc6634537650A7a1D14711c1A3',
  treasuryHiIQAddress:
    process.env.NEXT_PUBLIC_TREASURY_HIIQ_ADDRESS ||
    '0xaCa39B187352D9805DECEd6E73A3d72ABf86E7A0',
  hiiqRewardAddress:
    process.env.NEXT_PUBLIC_HIIQREWARDS_ADDRESS ||
    '0x36Cae8d96CBB53e139628e63E47ebe2B47a53f1f',
  blockExplorerUrl:
    process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL ||
    'https://goerli.etherscan.io/',
  infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
  alchemyApiKey: String(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY),
  alchemyChain: process.env.NEXT_PUBLIC_ALCHEMY_CHAIN || 'goerli',
  graphqlUrl:
    process.env.NEXT_PUBLIC_EP_API || 'https://api.dev.braindao.org/graphql',
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID || '5',
  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME || 'goerli',
  ensRPC: String(process.env.NEXT_PUBLIC_ENS_RPC),
  publicDomain: String(process.env.NEXT_PUBLIC_DOMAIN),
  treasuryAddress: process.env.NEXT_PUBLIC_TREASURY_ADDRESS,
  eosChainId:
    process.env.NEXT_PUBLIC_EOS_CHAIN_ID ||
    'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  eosRpcProtocol: process.env.NEXT_PUBLIC_EOS_RPC_PROTOCOL || 'https',
  eosRpcHost: process.env.NEXT_PUBLIC_EOS_RPC_HOST || 'mainnet.eosn.io',
  eosRpcPort: process.env.NEXT_PUBLIC_EOS_RPC_PORT || 443,
  hiiqRewardsAddress: process.env.NEXT_PUBLIC_HIIQREWARDS_ADDRESS || '',
  etherScanApiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
  pMinterAddress: process.env.NEXT_PUBLIC_PMINTER_ADDRESS || '',
  pIqAddress:
    process.env.NEXT_PUBLIC_PIQ_ADDRESS ||
    '0xa23d33d5e0a61ba81919bfd727c671bb03ab0fea',
  brainyAddress: process.env.NEXT_PUBLIC_BRAINY_ADDRESS || '',
  gaugeCtrlAddress: process.env.NEXT_PUBLIC_GAUGE_CTRL_ADDRESS || '',
  gaugeRewardsDistributorAddress:
    process.env.NEXT_PUBLIC_GAUGE_REWARDS_DISTRIBUTOR_ADDRESS || '',
  nftFarmAddress: process.env.NEXT_PUBLIC_NFT_FARM_ADDRESS || '',
  debankApiKey: process.env.NEXT_PUBLIC_DEBANK_API_KEY,
  cmcApiKey: process.env.NEXT_PUBLIC_CMC_API_KEY,
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
}

export default config
