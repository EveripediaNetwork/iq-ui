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
  const testData = logs[0]
  const eventData = testData.data
  const eventTopics = testData.topics
  const decodedData = decodeEventLog({
    abi: hiIQABI,
    data: eventData,
    topics: eventTopics,
  })
  const block = await publicClient.getBlock({
    blockNumber: testData.blockNumber as bigint,
  })

  const timestamp = new Date(Number(block.timestamp * 1000n)).toUTCString()

  return {
    decodedData,
    log: testData,
    timestamp,
  }
}
