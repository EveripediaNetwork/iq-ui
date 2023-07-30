export type LockedDetailsTypes = {
  setOpenUnlockNotification: (status: boolean) => void
  setOpenRewardCalculator: (status: boolean) => void
  loading: boolean
}

export type LockFormCommonType = {
  hasIQLocked?: boolean
  handleLockOrIncreaseAmount?: () => void
  handleLockPeriodUpdate?: () => void
  isLoading: boolean
  lockend: Date | undefined
  receivedAmount: number
  isDisabled?: boolean
}

export type NetworkErrorNotificationType = {
  isOpen: boolean
  onClose: () => void
  switchNetwork: () => void
}

export type CalculatorResultType = {
  result: number
  title: string
  symbol: string
}

export type StakeBoxprops = {
  userTotalIQLocked: number
  setOpenStakingInfo: React.Dispatch<React.SetStateAction<boolean>>
  lockEndDate: Date | undefined
  exchangeRate: number
}

export type StakingInforType = {
  isOpen: boolean
  onClose: () => void
  isBrainyStaking?: boolean
}

export type UnlockNotificationType = {
  isOpen: boolean
  onClose: () => void
  handleUnlock: () => void
}
