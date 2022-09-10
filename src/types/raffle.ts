export type Raffle = {
  id: number
  title: string
  slug: string
  body: string
  madeBy: string
  imageUrl: string
  details: { name: string; address: string; qty: number }[]
  date: string
}
