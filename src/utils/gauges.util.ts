import { MAX_USER_WEIGHT } from '@/data/GaugesConstants'

export const getUnusedWeight = (weight: number) => {
  const usedWeight = (weight * 100) / MAX_USER_WEIGHT
  const unusedRaw = 100 - usedWeight

  return { used: `${usedWeight}%`, unused: `${unusedRaw}%`, unusedRaw }
}
