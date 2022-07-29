import { IconProps } from '@chakra-ui/icon'

export type NetworkType = {
  id: number
  name: string
  icon: (props: IconProps) => JSX.Element
  isActive: boolean
}
