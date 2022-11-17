import { MAX_USER_WEIGHT } from '@/data/GaugesConstants'

export const getUnusedWeight = (weight: number) => {
  if (weight === 0) throw new Error("Weight can't be zero")

  const usedWeight = (weight * 100) / MAX_USER_WEIGHT
  const unusedRaw = 100 - usedWeight

  return { used: `${usedWeight}%`, unused: `${unusedRaw}%`, unusedRaw }
}
