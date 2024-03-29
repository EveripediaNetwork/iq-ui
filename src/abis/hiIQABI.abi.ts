const hiIQABI = [
  {
    name: 'CommitOwnership',
    inputs: [
      {
        type: 'address',
        name: 'admin',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'ApplyOwnership',
    inputs: [
      {
        type: 'address',
        name: 'admin',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'Deposit',
    inputs: [
      {
        type: 'address',
        name: 'provider',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'value',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'locktime',
        indexed: true,
      },
      {
        type: 'int128',
        name: 'type',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'ts',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'Withdraw',
    inputs: [
      {
        type: 'address',
        name: 'provider',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'value',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'ts',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'Supply',
    inputs: [
      {
        type: 'uint256',
        name: 'prevSupply',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'supply',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    outputs: [],
    inputs: [
      {
        type: 'address',
        name: 'token_addr',
      },
      {
        type: 'string',
        name: '_name',
      },
      {
        type: 'string',
        name: '_symbol',
      },
      {
        type: 'string',
        name: '_version',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    name: 'commit_transfer_ownership',
    outputs: [],
    inputs: [
      {
        type: 'address',
        name: 'addr',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 37568,
  },
  {
    name: 'apply_transfer_ownership',
    outputs: [],
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 38407,
  },
  {
    name: 'commit_smart_wallet_checker',
    outputs: [],
    inputs: [
      {
        type: 'address',
        name: 'addr',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 36278,
  },
  {
    name: 'apply_smart_wallet_checker',
    outputs: [],
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 37005,
  },
  {
    name: 'toggleEmergencyUnlock',
    outputs: [],
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 37038,
  },
  {
    name: 'recoverERC20',
    outputs: [],
    inputs: [
      {
        type: 'address',
        name: 'token_addr',
      },
      {
        type: 'uint256',
        name: 'amount',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 4045,
  },
  {
    name: 'get_last_user_slope',
    outputs: [
      {
        type: 'int128',
        name: '',
      },
    ],
    inputs: [
      {
        type: 'address',
        name: 'addr',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    gas: 2600,
  },
  {
    name: 'user_point_history__ts',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [
      {
        type: 'address',
        name: '_addr',
      },
      {
        type: 'uint256',
        name: '_idx',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    gas: 1703,
  },
  {
    name: 'locked__end',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [
      {
        type: 'address',
        name: '_addr',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    gas: 1624,
  },
  {
    name: 'checkpoint',
    outputs: [],
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 46119699,
  },
  {
    name: 'deposit_for',
    outputs: [],
    inputs: [
      {
        type: 'address',
        name: '_addr',
      },
      {
        type: 'uint256',
        name: '_value',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 92414024,
  },
  {
    name: 'create_lock',
    outputs: [],
    inputs: [
      {
        type: 'uint256',
        name: '_value',
      },
      {
        type: 'uint256',
        name: '_unlock_time',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 92415425,
  },
  {
    name: 'increase_amount',
    outputs: [],
    inputs: [
      {
        type: 'uint256',
        name: '_value',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 92414846,
  },
  {
    name: 'increase_unlock_time',
    outputs: [],
    inputs: [
      {
        type: 'uint256',
        name: '_unlock_time',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 92415493,
  },
  {
    name: 'withdraw',
    outputs: [],
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 46291332,
  },
  {
    name: 'balanceOf',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [
      {
        type: 'address',
        name: 'addr',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    name: 'balanceOf',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [
      {
        type: 'address',
        name: 'addr',
      },
      {
        type: 'uint256',
        name: '_t',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    name: 'balanceOfAt',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [
      {
        type: 'address',
        name: 'addr',
      },
      {
        type: 'uint256',
        name: '_block',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    gas: 512868,
  },
  {
    name: 'totalSupply',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    name: 'totalSupply',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [
      {
        type: 'uint256',
        name: 't',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    name: 'totalSupplyAt',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [
      {
        type: 'uint256',
        name: '_block',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    gas: 882020,
  },
  {
    name: 'totalIQSupply',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 2116,
  },
  {
    name: 'totalIQSupplyAt',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [
      {
        type: 'uint256',
        name: '_block',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    gas: 252170,
  },
  {
    name: 'changeController',
    outputs: [],
    inputs: [
      {
        type: 'address',
        name: '_newController',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
    gas: 36998,
  },
  {
    name: 'token',
    outputs: [
      {
        type: 'address',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 1871,
  },
  {
    name: 'supply',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 1901,
  },
  {
    name: 'locked',
    outputs: [
      {
        type: 'int128',
        name: 'amount',
      },
      {
        type: 'uint256',
        name: 'end',
      },
    ],
    inputs: [
      {
        type: 'address',
        name: 'arg0',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    gas: 3380,
  },
  {
    name: 'epoch',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 1961,
  },
  {
    name: 'point_history',
    outputs: [
      {
        type: 'int128',
        name: 'bias',
      },
      {
        type: 'int128',
        name: 'slope',
      },
      {
        type: 'uint256',
        name: 'ts',
      },
      {
        type: 'uint256',
        name: 'blk',
      },
      {
        type: 'uint256',
        name: 'iq_amt',
      },
    ],
    inputs: [
      {
        type: 'uint256',
        name: 'arg0',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    gas: 6280,
  },
  {
    name: 'user_point_history',
    outputs: [
      {
        type: 'int128',
        name: 'bias',
      },
      {
        type: 'int128',
        name: 'slope',
      },
      {
        type: 'uint256',
        name: 'ts',
      },
      {
        type: 'uint256',
        name: 'blk',
      },
      {
        type: 'uint256',
        name: 'iq_amt',
      },
    ],
    inputs: [
      {
        type: 'address',
        name: 'arg0',
      },
      {
        type: 'uint256',
        name: 'arg1',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    gas: 6525,
  },
  {
    name: 'user_point_epoch',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [
      {
        type: 'address',
        name: 'arg0',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    gas: 2266,
  },
  {
    name: 'slope_changes',
    outputs: [
      {
        type: 'int128',
        name: '',
      },
    ],
    inputs: [
      {
        type: 'uint256',
        name: 'arg0',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    gas: 2196,
  },
  {
    name: 'controller',
    outputs: [
      {
        type: 'address',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 2111,
  },
  {
    name: 'transfersEnabled',
    outputs: [
      {
        type: 'bool',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 2141,
  },
  {
    name: 'emergencyUnlockActive',
    outputs: [
      {
        type: 'bool',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 2171,
  },
  {
    name: 'name',
    outputs: [
      {
        type: 'string',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 8603,
  },
  {
    name: 'symbol',
    outputs: [
      {
        type: 'string',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 7656,
  },
  {
    name: 'version',
    outputs: [
      {
        type: 'string',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 7686,
  },
  {
    name: 'decimals',
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 2291,
  },
  {
    name: 'future_smart_wallet_checker',
    outputs: [
      {
        type: 'address',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 2321,
  },
  {
    name: 'smart_wallet_checker',
    outputs: [
      {
        type: 'address',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 2351,
  },
  {
    name: 'admin',
    outputs: [
      {
        type: 'address',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 2381,
  },
  {
    name: 'future_admin',
    outputs: [
      {
        type: 'address',
        name: '',
      },
    ],
    inputs: [],
    stateMutability: 'view',
    type: 'function',
    gas: 2411,
  },
] as const

export default hiIQABI
