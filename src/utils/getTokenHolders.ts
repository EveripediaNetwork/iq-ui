import hiIQABI from '@/abis/hiIQABI.abi'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { parseAbiItem, decodeEventLog } from 'viem'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const getLogs = async () => {
  //get deposit logs
  const depositLogs = await publicClient.getLogs({
    address: '0x1bF5457eCAa14Ff63CC89EFd560E251e814E16Ba',
    event: parseAbiItem(
      'event Deposit(address indexed provider, uint256 value,uint256 locktime, int128 type, uint256 ts)',
    ),
    fromBlock: 12548031n,
    toBlock: 'latest',
  })

  const decodedDepositData = []
  for (const log of depositLogs) {
    const data = log.data
    const topics = log.topics
    const logData = decodeEventLog({
      abi: hiIQABI,
      data: data,
      topics: topics,
    })
    decodedDepositData.push(logData)
  }
  //Get withdraw logs
  const withdrawLogs = await publicClient.getLogs({
    address: '0x1bF5457eCAa14Ff63CC89EFd560E251e814E16Ba',
    event: parseAbiItem(
      'event Withdraw(address indexed provider, uint256 value, uint256 ts)',
    ),
    fromBlock: 12548031n,
    toBlock: 'latest',
  })

  const decodedWithdrawData = []
  for (const log of withdrawLogs) {
    const data = log.data
    const topics = log.topics
    const logData = decodeEventLog({
      abi: hiIQABI,
      data: data,
      topics: topics,
    })
    decodedWithdrawData.push(logData)
  }
  const filteredDepositData = decodedDepositData.filter(
    //@ts-ignore
    (log) => log.args.type === 1n,
  )
  return filteredDepositData.length - decodedWithdrawData.length
}
