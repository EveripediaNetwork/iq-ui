export const getTokenHoldersCount = async (): Promise<number> => {
  try {
    const res = await fetch(
      'https://api.ethplorer.io/getTokenInfo/0x579CEa1889991f68aCc35Ff5c3dd0621fF29b0C9?apiKey=freekey',
    )
    const data = await res.json()
    if (!data) {
      throw new Error('Invalid data received from the API')
    }
    return data.holdersCount
  } catch (error) {
    throw new Error(
      `Error fetching token holders count: ${(error as Error).message}`,
    )
  }
}
