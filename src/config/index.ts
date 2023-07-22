const config = {
  wikiContractAddress:
    process.env.NEXT_PUBLIC_WIKI_CONTRACT_ADDRESS ||
    '0x94bb4c72252d0ae7a98b2b0483Dc4145C0C79059',
  iqAddress:
    process.env.NEXT_PUBLIC_IQ_ADDRESS ||
    '0xb7C3B17f97C2099d44d38E3dbd7496b782005819',
  hiiqAddress:
    process.env.NEXT_PUBLIC_HIIQ_ADDRESS ||
    '0x02750C9345A7Cc6Aedb726f9471d7Dd3483E85Bc',
  hiiqRewardAddress:
    process.env.NEXT_PUBLIC_HIIQREWARDS_ADDRESS ||
    '0x63549a3f6709Af9F7408A94A677Baa8C753070cd',
  blockExplorerUrl:
    process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL ||
    'https://sepolia.etherscan.io/',
  infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
  alchemyApiKey: String(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY),
  alchemyChain: process.env.NEXT_PUBLIC_ALCHEMY_CHAIN || 'sepolia',
  graphqlUrl:
    process.env.NEXT_PUBLIC_EP_API || 'https://api.dev.braindao.org/graphql',
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID || '11155111',
  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME || 'sepolia',
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
    '0x276780BEDbbB5136a12e0b334670ac50234f9Cb4',
  brainyAddress: process.env.NEXT_PUBLIC_BRAINY_ADDRESS || '',
  gaugeCtrlAddress: process.env.NEXT_PUBLIC_GAUGE_CTRL_ADDRESS || '',
  gaugeRewardsDistributorAddress:
    process.env.NEXT_PUBLIC_GAUGE_REWARDS_DISTRIBUTOR_ADDRESS || '',
  nftFarmAddress: process.env.NEXT_PUBLIC_NFT_FARM_ADDRESS || '',
  debankApiKey: process.env.NEXT_PUBLIC_DEBANK_API_KEY,
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
}

export default config
