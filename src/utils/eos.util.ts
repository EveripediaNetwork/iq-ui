import { asset } from 'eos-common'

export const getUserTokenBalance = async (ual: any) => {
  if (!ual.activeUser) return

  const response = await ual.activeUser.rpc.get_currency_balance(
    'everipediaiq', // TODO: move
    ual.activeUser.accountName,
    'IQ',
  )

  // eslint-disable-next-line consistent-return
  return response.length > 0 ? asset(response[0]) : null
}

export const convertTokensTx = async (
  quantity: string,
  ethAddress: string,
  ual: any,
) => {
  return ual.activeUser.signTransaction(
    {
      actions: [
        {
          account: 'everipediaiq', // TODO: move
          name: 'transfer',
          authorization: [
            {
              actor: ual.activeUser.accountName,
              permission: 'active',
            },
          ],
          data: {
            from: ual.activeUser.accountName,
            to: 'xeth.ptokens',
            quantity,
            memo: ethAddress,
          },
        },
      ],
    },
    {
      broadcast: true,
      expireSeconds: 300,
    },
  )
}
