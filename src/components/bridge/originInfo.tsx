import React from 'react'
import { useIQRate } from '@/hooks/useRate'
import { Token, TokenId, getToken } from '@/types/bridge'
import { shortenNumber } from '@/utils/shortenNumber.util'
import { Input, Flex, Badge, Text } from '@chakra-ui/react'
import { formatValue } from '@/utils/LockOverviewUtils'
import { BraindaoLogo3 } from '../braindao-logo-3'

type OriginInfoType = {
  selectedToken: Token
  isBalanceZero: () => boolean
  tokenInputAmount: string | undefined
  setTokenInputAmount: (amount: string) => void
  getSpecificBalance: (id: TokenId) => number
}

const OriginInfo = ({
  selectedToken,
  isBalanceZero,
  tokenInputAmount,
  setTokenInputAmount,
  getSpecificBalance,
}: OriginInfoType) => {
  const { rate: exchangeRate } = useIQRate()
  return (
    <Flex p="3" pr="5" rounded="lg" border="solid 1px" borderColor="divider">
      <Flex flex={1} direction="column" gap="1.5">
        <Text color="fadedText4" fontSize="xs" fontWeight="medium">
          Send:
        </Text>
        <Flex gap="1" align="center">
          <Input
            variant="unstyled"
            onChange={e => String(setTokenInputAmount(e.target.value))}
            placeholder="00.00"
            value={tokenInputAmount}
            color="fadedText4"
            disabled={isBalanceZero()}
            fontSize="lg"
            fontWeight="semibold"
            display="inline-block"
            w={
              tokenInputAmount
                ? `min(${(tokenInputAmount.toString().length + 3.5) * 9}px,60%)`
                : '30%'
            }
            type="number"
          />
          <Text
            align="left"
            color="fadedText4"
            fontSize="xs"
            fontWeight="medium"
          >
            (~$
            {shortenNumber(
              Number(
                (Number(tokenInputAmount) * exchangeRate || 0.0).toFixed(3),
              ),
            )}
            )
          </Text>
        </Flex>
      </Flex>

      <Flex flex={1} direction="column" ml="auto" align="end" gap="1">
        <Flex gap="1" align="center">
          <Text
            onClick={() =>
              setTokenInputAmount(
                String(getSpecificBalance(selectedToken?.id)) || '0',
              )
            }
            color="fadedText4"
            cursor="pointer"
            fontSize="xs"
            fontWeight="medium"
          >
            Balance: {formatValue(getSpecificBalance(selectedToken.id))}
          </Text>
          <Badge
            onClick={() =>
              setTokenInputAmount(
                String(getSpecificBalance(selectedToken?.id)) || '0',
              )
            }
            cursor="pointer"
            _hover={{
              fontWeight: 'bold',
            }}
            variant="solid"
            bg="brand.50"
            color="brandText"
            _dark={{
              bg: 'brand.200',
            }}
            colorScheme="brand"
            rounded="md"
            fontWeight="medium"
          >
            MAX
          </Badge>
        </Flex>
        <Flex gap="1" align="center">
          <BraindaoLogo3 w="6" h="5" />
          <Text fontSize={{ base: 'sm', lg: 'md' }} fontWeight="medium">
            {getToken(TokenId.IQ)?.label}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default OriginInfo
