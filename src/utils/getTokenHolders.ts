import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { parseAbiItem } from 'viem'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const getLogs = async () => {
  const logs = await publicClient.getLogs({
    address: '0x1bF5457eCAa14Ff63CC89EFd560E251e814E16Ba',
    event: parseAbiItem(
      'event Deposit(address indexed provider, uint256 value,uint256 locktime, int128 type, uint256 ts)',
    ),
    fromBlock: 0n,
    toBlock: await publicClient.getBlockNumber(),
  })
  return logs
}
