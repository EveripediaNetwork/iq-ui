export type Raffle = {
  id: number
  title: string
  slug: string
  body: string
  madeBy: string
  imageUrl: string
  details: { address: string; qty: number }[]
  date: string
  snapshotLink: string
}
