import { makeGraphQLRequest } from '@/lib/graphql-client'
import { HIIQ_HOLDERS_COUNT } from './holders/queries'

export async function getHIIQHoldersCount() {
  try {
    const response = await makeGraphQLRequest<{
      hiIQHoldersCount: { amount: number }[]
    }>(HIIQ_HOLDERS_COUNT)
    return response.hiIQHoldersCount[0].amount
  } catch (error) {
    console.error('Error fetching HIIQ holders count:', error)
    return 0
  }
}
