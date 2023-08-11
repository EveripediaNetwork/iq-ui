import hiIQABI from '@/abis/hiIQABI.abi'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { parseAbiItem, decodeEventLog } from 'viem'

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
    fromBlock: 'earliest',
    toBlock: 'latest',
  })
   const cleanData = []
  console.log(logs, 'logs')
  for (const log of logs) {
    const address = log.args.provider
    const data = log.data
    const topics = log.topics
    const decodedData = decodeEventLog({
      abi: hiIQABI,
      data: data,
      topics: topics,
    })
    const block = await publicClient.getBlock({
      blockNumber: log.blockNumber as bigint,
    })
    const timestamp = new Date(Number(block.timestamp * 1000n)).toUTCString()

    cleanData.push({ address, decodedData, timestamp })
  }
  return cleanData
}