export type VotingItemProps = {
  item: {
    id: string
    title: string
    body: string
    author: string
    end: number
  }
  active?: boolean
}
