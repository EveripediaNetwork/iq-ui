import { Pseudos, SemanticValue } from '@chakra-ui/react'

export type SemanticTokens = Partial<
  Record<string, Record<string, SemanticValue<keyof Pseudos>>>
>

export const semanticTokens: SemanticTokens = {
  colors: {
    bodyBg: {
      default: 'white',
      _dark: 'gray.800',
    },
    lightCard: {
      default: 'gray.50',
      _dark: 'gray.700',
    },
    brandBackground: {
      default: 'primary',
      _dark: 'brand.900',
    },
    dimColor: {
      default: '#0000002a',
    },
    linkColor: {
      default: 'gray.600',
      _dark: 'gray.200',
    },
    dimmedText: {
      _dark: 'whiteAlpha.700',
    },
    grayText: {
      default: 'gray.500',
      _dark: 'whiteAlpha.500',
    },
    grayText2: {
      default: 'gray.500',
      _dark: 'whiteAlpha.500',
    },
    textColor: {
      default: 'gray.900',
      _dark: 'grey.200',
    },
    linkHoverColor: {
      default: 'gray.800',
      _dark: 'gray.400',
    },
    subMenuBg: {
      default: 'white',
      _dark: 'gray.800',
    },
    pageBg: {
      default: 'gray.100',
      _dark: 'gray.800',
    },
    hoverBg: {
      default: 'gray.100',
      _dark: 'gray.600',
    },
    toolTipBg: {
      default: 'black',
      _dark: 'gray.500',
    },
    cardBg: {
      default: 'gray.200',
      _dark: 'gray.700',
    },
    pageBorderColor: {
      default: 'gray.300',
      _dark: 'gray.600',
    },
    borderColor: {
      default: 'gray.300',
      _dark: 'gray.600',
    },
    borderColorHover: {
      default: 'gray.400',
      _dark: 'gray.700',
    },
    socialIconColor: {
      default: 'gray.700',
      _dark: 'gray.100',
    },
    fadedText: {
      default: 'gray.600',
      _dark: 'whiteAlpha.700',
    },
    divider: {
      default: 'gray.200',
      _dark: 'whiteAlpha.200',
    },
    divider2: {
      default: 'gray.300',
      _dark: 'whiteAlpha.200',
    },
    btnBgColor: {
      default: 'white',
      _dark: 'gray.800',
    },
    brandText: {
      default: 'brand.500',
      _dark: 'brand.800',
    },
  },
}
