import {
  Button,
  Menu,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
  Box,
  BoxProps,
  Image,
  Text,
} from '@chakra-ui/react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { FaChevronDown } from 'react-icons/fa'

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

export const LanguageSwitch = (props: BoxProps) => {
  const pathname = usePathname()
  const locale = useLocale()

  const currentLocale = locales.find((loc) => loc.locale === locale)
  const strippedPathname = pathname?.replace(`/${locale}`, '') || '/'

  return (
    <Box {...props} minW="fit-content">
      <Menu>
        <MenuButton
          as={Button}
          variant="outline"
          size="sm"
          fontSize={{ base: 'xs', md: 'inherit' }}
          sx={{
            span: {
              gap: '2',
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          <Text>{currentLocale?.locale.toUpperCase()}</Text>
          <Icon as={FaChevronDown} fontSize="sm" />
        </MenuButton>

        <MenuList>
          {locales.map((locale) => (
            <MenuItem gap="4">
              <Link
                locale={locale.locale}
                href={strippedPathname}
                className="flex items-center gap-2"
                aria-label={`Change language to ${locale.name}`}
              >
                <Image
                  src={locale.icon}
                  alt={locale.name}
                  width={24}
                  height={24}
                  aria-hidden="true"
                  className="max-w-6 max-h-6"
                />
                <span>{locale.name}</span>
              </Link>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  )
}
