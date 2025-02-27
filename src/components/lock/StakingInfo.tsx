import React from 'react'
import {
  Box,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  Flex,
  Text,
  Icon,
  Spacer,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'
import { RiCloseLine, RiQuestionLine } from 'react-icons/ri'
import { IQLogo } from '../iq-logo'
import { useTranslations } from 'next-intl'

const StakingInfo = ({
  onClose,
  isOpen,
  isBrainyStaking,
}: {
  isOpen: boolean
  onClose: () => void
  isBrainyStaking?: boolean
}) => {
  const t = useTranslations('hiiq.stakingInfo')
  const cancelRef = React.useRef<FocusableElement>(null)

  if (!isOpen) return null
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size="xl"
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <Box p={8}>
          <Flex>
            <Icon
              cursor="pointer"
              fontSize="2xl"
              fontWeight={600}
              as={RiQuestionLine}
              mr={2}
              color="brandText"
            />
            <Spacer />
            <Icon
              cursor="pointer"
              fontSize="3xl"
              fontWeight={600}
              as={RiCloseLine}
              onClick={onClose}
            />
          </Flex>

          <Box
            mt="5"
            textAlign="center"
            border="1px solid"
            borderColor="divider"
            py={10}
            px={4}
            rounded="lg"
          >
            {isBrainyStaking ? (
              <Text fontSize="sm" lineHeight="24px" fontWeight="medium">
                {t('brainyStakingText')}
              </Text>
            ) : (
              <>
                <Text fontSize="sm" lineHeight="24px" fontWeight="medium">
                  {t('regularStakingText')}
                </Text>
                <VStack mt="10" rowGap={3}>
                  <HStack display="flex" justify="center">
                    <Icon boxSize={6} as={IQLogo} />
                    <Text fontWeight="medium">
                      {t('lockPeriods.fourYears')}
                    </Text>
                  </HStack>
                  <HStack display="flex" justify="center">
                    <Icon boxSize={6} as={IQLogo} />
                    <Text fontWeight="medium">
                      {t('lockPeriods.threeYears')}
                    </Text>
                  </HStack>
                  <HStack display="flex" justify="center">
                    <Icon boxSize={6} as={IQLogo} />
                    <Text fontWeight="medium">{t('lockPeriods.twoYears')}</Text>
                  </HStack>
                  <HStack display="flex" justify="center">
                    <Icon boxSize={6} as={IQLogo} />
                    <Text fontWeight="medium">{t('lockPeriods.oneYear')}</Text>
                  </HStack>
                </VStack>
              </>
            )}
          </Box>
        </Box>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default StakingInfo
