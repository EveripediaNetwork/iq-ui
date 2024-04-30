import { defineChain } from 'viem'

export const virtualMainnet = defineChain({
  id: 73571,
  name: 'Virtual Mainnet',
  nativeCurrency: { name: 'vETH', symbol: 'vETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://virtual.mainnet.rpc.tenderly.co/03b11be5-eb34-47f8-9940-02979425b7e4',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tenderly Explorer',
      url: 'https://virtual.mainnet.rpc.tenderly.co/4e94e7d0-a21b-4af4-8da1-a72d105c1bf2',
    },
  },
})
