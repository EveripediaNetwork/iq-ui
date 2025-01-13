import { zodEnumFromValues } from '@/utils/zodEnumFromRecord'
import type { z } from 'zod'

export const locales = [
  {
    locale: 'en',
    default: true,
    name: 'English',
    currency: 'usd',
    localization: 'en-US',
    icon: '/US.svg',
  },
  {
    locale: 'kr',
    name: 'Korean',
    currency: 'krw',
    localization: 'ko-KR',
    icon: '/KR.svg',
  },
  {
    locale: 'zh',
    name: 'Chinese',
    currency: 'cny',
    localization: 'zh-CN',
    icon: '/ZH.svg',
  },
] as const

export const localeSchema = zodEnumFromValues(locales, 'locale')
export type Locale = z.infer<typeof localeSchema>
