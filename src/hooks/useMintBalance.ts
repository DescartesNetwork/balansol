import { useCallback } from 'react'
import {
  useAccounts,
  useGetMintDecimals,
  useWalletAddress,
  useWalletBalance,
} from '@sentre/senhub'
import {
  account,
  utils,
  DEFAULT_EMPTY_ADDRESS,
  DEFAULT_WSOL,
} from '@senswap/sen-js'

export const useMintBalance = () => {
  const walletAddress = useWalletAddress()
  const lamports = useWalletBalance()
  const getDecimals = useGetMintDecimals()
  const accounts = useAccounts()

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
    async (addressToken: string, wrapSol: boolean = false) => {
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

        const isWsolAddress = addressToken === DEFAULT_WSOL
        const isSolAddress = accountAddress === walletAddress
        if (isSolAddress || isWsolAddress) {
          const { amount = BigInt(0) } = accounts[accountAddress] || {}
          const mintAddress = isWsolAddress
            ? DEFAULT_WSOL
            : DEFAULT_EMPTY_ADDRESS
          const returnedBalance = isWsolAddress ? amount : lamports
          if (wrapSol) return buildResult(mintAddress, lamports + amount, 9)

          return buildResult(mintAddress, returnedBalance, 9)
        }
        const { amount, mint: mintAddress } = accounts[accountAddress] || {}
        const decimals = await getDecimals({ mintAddress })

        return buildResult(mintAddress, amount, decimals)
      } catch (er) {
        return buildResult()
      }
    },
    [accounts, getDecimals, lamports, walletAddress],
  )

  return { getMintBalance }
}
