const config = {
  wikiContractAddress:
    process.env.NEXT_PUBLIC_WIKI_CONTRACT_ADDRESS ||
    '0x94bb4c72252d0ae7a98b2b0483Dc4145C0C79059',
  iqAddress:
    process.env.NEXT_PUBLIC_IQ_ADDRESS ||
    '0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
  hiiqAddress:
    process.env.NEXT_PUBLIC_HIIQ_ADDRESS ||
    '0xc03bcacc5377b7cc6634537650a7a1d14711c1a3',
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
  pMinterAddress: process.env.NEXT_PUBLIC_PMINTER_ADDRESS || '',
  pIqAddress:
    process.env.NEXT_PUBLIC_PIQ_ADDRESS ||
    '0xa23d33d5e0a61ba81919bfd727c671bb03ab0fea',
  brainyAddress: '0x70560fcF75aC94Cc4D48a005024b164908333CcD',
  gaugeCtrlAddress: '0xdB23554ce1fF69085adc6FA3bBc3be8A171e55A1',
  gaugeRewardsDistributorAddress: '0xA8B023EbD88960096a1B09B748C929525d41b13a',
  nftFarmAddress: '0xca2B58781C6c928b8B7d181bD4c998C206a1AD7D',
}

export default config
