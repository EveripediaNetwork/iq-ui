import { z } from 'zod'

type StringKeys<T> = Extract<keyof T, string>

export function zodEnumFromKeys<T extends Record<string, unknown>>(obj: T) {
  return z.enum(Object.keys(obj) as [StringKeys<T>, ...StringKeys<T>[]])
}

export function zodEnumFromValues<T, K extends keyof T>(
  arr: readonly T[],
  key: K,
): z.ZodEnum<[T[K] & string, ...(T[K] & string)[]]> {
  const values = arr.map((item) => item[key])
  return z.enum(values as [T[K] & string, ...(T[K] & string)[]])
}
