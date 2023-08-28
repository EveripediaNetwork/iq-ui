export const getTokenHoldersCount = async():Promise<number>=>{
  const res = await fetch("https://api.ethplorer.io/getTokenInfo/0x579CEa1889991f68aCc35Ff5c3dd0621fF29b0C9?apiKey=freekey")
  const data = await res.json()
  return data.holdersCount
}
