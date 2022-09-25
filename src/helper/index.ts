import { BN, web3 } from '@project-serum/anchor'
import { util } from '@sentre/senhub'
import { utils } from '@senswap/sen-js'
import { MintActionState } from '@senswap/balancer'
import {
  NATIVE_MINT,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  createCloseAccountInstruction,
} from '@solana/spl-token-v3'

import { PriceImpact } from 'constant'

export const notifySuccess = (content: string, txId: string) => {
  return window.notify({
    type: 'success',
    description: `${content} successfully. Click to view details.`,
    onClick: () => window.open(util.explorer(txId), '_blank'),
  })
}

export const notifyError = (er: any) => {
  console.log('er', er)
  return window.notify({
    type: 'error',
    description: er.message,
  })
}

export const undecimalizeWrapper = (value: BN, decimals: number) => {
  const valueInBigInt = BigInt(value.toString())

  return utils.undecimalize(valueInBigInt, decimals)
}

export const priceImpactColor = (priceImpact: number) => {
  if (!priceImpact || priceImpact < PriceImpact.goodSwap) return '#14E041'
  if (priceImpact > PriceImpact.acceptableSwap) return '#D72311'
  return '#FA8C16'
}

export const getMintState = (mintStates: MintActionState[], idx: number) =>
  Object.keys(mintStates[idx])[0]

export const createWrapSolTx = async (
  amount: number,
  wallet: web3.PublicKey,
  hasATA: boolean = false,
) => {
  const wrappingTransaction = new web3.Transaction()
  const associatedTokenAccount = await getAssociatedTokenAddress(
    NATIVE_MINT,
    wallet,
  )

  // Create token account to hold your wrapped SOL if haven't existed
  if (!hasATA)
    wrappingTransaction.add(
      createAssociatedTokenAccountInstruction(
        wallet,
        associatedTokenAccount,
        wallet,
        NATIVE_MINT,
      ),
    )

  wrappingTransaction.add(
    web3.SystemProgram.transfer({
      fromPubkey: wallet,
      toPubkey: associatedTokenAccount,
      lamports: amount,
    }),
    createSyncNativeInstruction(associatedTokenAccount),
  )

  return wrappingTransaction
}

export const createUnWrapSolTx = async (wallet: web3.PublicKey) => {
  const associatedTokenAccount = await getAssociatedTokenAddress(
    NATIVE_MINT,
    wallet,
  )

  return new web3.Transaction().add(
    createCloseAccountInstruction(associatedTokenAccount, wallet, wallet),
  )
}
