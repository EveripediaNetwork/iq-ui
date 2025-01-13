'use client'

import { Link, usePathname } from '@/i18n/routing'
import { locales } from '@/messages/_schema'
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
import React from 'react'
import { FaChevronDown } from 'react-icons/fa'

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
            <MenuItem key={locale.locale} gap="4">
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
