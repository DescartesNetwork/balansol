import { useCallback } from 'react'

import { useAccount, useMint, useWallet } from '@sentre/senhub'
import { account, utils, DEFAULT_EMPTY_ADDRESS } from '@senswap/sen-js'

export const useMintBalance = () => {
  const {
    wallet: { address: walletAddress, lamports },
  } = useWallet()
  const { getDecimals } = useMint()
  const { accounts } = useAccount()

  const buildResult = (
    mintAddress?: string,
    amount?: bigint,
    decimals?: number,
  ) => {
    if (
      !account.isAddress(mintAddress) ||
      amount === undefined ||
      decimals === undefined
    )
      return { amount: BigInt(0), decimals: 0, balance: 0 }
    return {
      mintAddress,
      amount,
      decimals,
      balance: Number(utils.undecimalize(amount, decimals)),
    }
  }

  const getMintBalance = useCallback(
    async (addressToken: string) => {
      if (!account.isAddress(walletAddress) || !account.isAddress(addressToken))
        return buildResult()
      const {
        sentre: { splt },
      } = window
      try {
        const accountAddress = await splt.deriveAssociatedAddress(
          walletAddress,
          addressToken,
        )
        if (accountAddress === walletAddress) {
          return buildResult(DEFAULT_EMPTY_ADDRESS, lamports, 9)
        }
        const { amount, mint: mintAddress } = accounts[accountAddress] || {}
        const decimals = await getDecimals(mintAddress)
        return buildResult(mintAddress, amount, decimals)
      } catch (er) {
        return buildResult()
      }
    },
    [accounts, getDecimals, lamports, walletAddress],
  )

  return { getMintBalance }
}
