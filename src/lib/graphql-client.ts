import { GraphQLClient } from 'graphql-request'
import config from '@/config'

const client = new GraphQLClient(config.graphqlUrl)

export async function makeGraphQLRequest<T>(
  document: string,
  variables?: Record<string, any>,
): Promise<T> {
  try {
    return await client.request<T>(document, variables)
  } catch (error) {
    console.error('GraphQL request error:', error)
    throw error
  }
}

export function getGraphQLClient(): GraphQLClient {
  return client
}
