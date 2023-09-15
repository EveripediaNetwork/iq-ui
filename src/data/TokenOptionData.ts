import config from '@/config'
import { tokenOptionsData } from '@/types/TokenOptionDataType'

export const tokenOptionData: { [key: string]: tokenOptionsData } = {
    IQ: {
      address: config.iqAddress,
      decimals: 18,
      symbol: 'IQ',
      image:
        'https://assets.coingecko.com/coins/images/5010/small/YAIS3fUh.png?1626267646',
    },
    HiIQ: {
      address: config.hiiqAddress,
      decimals: 18,
      symbol: 'HiIQ',
      image:
        'https://assets.coingecko.com/coins/images/5010/small/YAIS3fUh.png?1626267646',
    },
  }