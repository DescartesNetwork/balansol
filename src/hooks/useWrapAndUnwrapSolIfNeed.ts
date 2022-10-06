import { useCallback } from 'react'
import { web3 } from '@project-serum/anchor'
import {
  NATIVE_MINT,
  getAssociatedTokenAddress,
  createSyncNativeInstruction,
} from '@solana/spl-token-v3'
import { useAccounts } from '@sentre/senhub'
import { utils } from '@senswap/sen-js'

import { SOL_DECIMALS } from 'constant'
import { createWrapSolIx, createATAIx, createUnWrapSolIx } from 'helper'
import { useMintBalance } from './useMintBalance'

const { wallet } = window.sentre

export const useWrapAndUnwrapSolIfNeed = () => {
  const { getMintBalance } = useMintBalance()
  const accounts = useAccounts()

  const createWrapSolTxIfNeed = useCallback(
    async (
      mint: string,
      amount: number | string,
    ): Promise<web3.Transaction | undefined> => {
      const tx = new web3.Transaction()
      const walletAddress = await wallet.getAddress()
      const { balance } = await getMintBalance(mint)
      if (mint !== NATIVE_MINT.toBase58() || balance >= amount) return

      const decimalizedAmount = utils.decimalize(amount, SOL_DECIMALS)
      const decimalizedBalance = utils.decimalize(balance, SOL_DECIMALS)
      const neededWrappedSol = decimalizedAmount - decimalizedBalance
      const wSolATA = await getAssociatedTokenAddress(
        NATIVE_MINT,
        new web3.PublicKey(walletAddress),
      )
      // Create token account to hold your wrapped SOL if haven't existed
      if (!accounts[wSolATA.toBase58()]) {
        const creatingATAIx = await createATAIx(
          new web3.PublicKey(walletAddress),
        )
        tx.add(creatingATAIx)
      }
      const wSolIx = await createWrapSolIx(
        neededWrappedSol,
        new web3.PublicKey(walletAddress),
      )
      tx.add(wSolIx, createSyncNativeInstruction(wSolATA))

      return tx
    },
    [accounts, getMintBalance],
  )

  const createUnWrapSolTxIfNeed = async (
    mint: string,
  ): Promise<web3.Transaction | undefined> => {
    const walletAddress = await wallet.getAddress()
    if (mint !== NATIVE_MINT.toBase58()) return

    const uwSolIx = await createUnWrapSolIx(new web3.PublicKey(walletAddress))

    return new web3.Transaction().add(uwSolIx)
  }

  return { createWrapSolTxIfNeed, createUnWrapSolTxIfNeed }
}
