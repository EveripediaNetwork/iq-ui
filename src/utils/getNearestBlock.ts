export const getNearestBlock = async (timestamp: number) => {
  const data = await fetch(`https://coins.llama.fi/block/ethereum/${timestamp}`)
  const { height } = await data.json()

  return height
}