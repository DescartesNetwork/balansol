import { useCallback } from 'react'
import { web3 } from '@project-serum/anchor'
import { NATIVE_MINT, getAssociatedTokenAddress } from '@solana/spl-token-v3'
import { useAccounts } from '@sentre/senhub'

import { EXPONENT, WSOL_ADDRESS } from 'constant'
import { createUnWrapSolTx, createWrapSolTx } from 'helper'
import { useMintBalance } from './useMintBalance'

const { wallet } = window.sentre

export const useWrapAndUnwrapSolIfNeed = () => {
  const { getMintBalance } = useMintBalance()
  const accounts = useAccounts()

  const createWrapSolTxIfNeed = useCallback(
    async (
      mint: string,
      amount: number,
    ): Promise<web3.Transaction | undefined> => {
      const walletAddress = await wallet.getAddress()
      const { balance } = await getMintBalance(mint)
      if (mint !== WSOL_ADDRESS || balance >= amount) return

      const associatedWrapSolAccount = await getAssociatedTokenAddress(
        NATIVE_MINT,
        new web3.PublicKey(walletAddress),
      )
      const neededWrappedSol = amount * EXPONENT - balance * EXPONENT
      const wrappingTransaction = await createWrapSolTx(
        neededWrappedSol,
        new web3.PublicKey(walletAddress),
        !!accounts[associatedWrapSolAccount.toBase58()],
      )

      return wrappingTransaction
    },
    [accounts, getMintBalance],
  )

  const createUnWrapSolTxIfNeed = async (
    mint: string,
  ): Promise<web3.Transaction | undefined> => {
    const walletAddress = await wallet.getAddress()
    if (mint !== WSOL_ADDRESS) return

    const wrappingTransaction = await createUnWrapSolTx(
      new web3.PublicKey(walletAddress),
    )

    return wrappingTransaction
  }

  return { createWrapSolTxIfNeed, createUnWrapSolTxIfNeed }
}
