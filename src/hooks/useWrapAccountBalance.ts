import { utilsBN } from '@sen-use/web3'
import { BN } from '@coral-xyz/anchor'
import { useMemo } from 'react'

import { useWalletBalance } from '@sentre/senhub'
import { NATIVE_MINT } from '@solana/spl-token-v3'

import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import { SOL_DECIMALS } from 'constant'

export const useWrapAccountBalance = (mintAddress: string) => {
  const lamports = useWalletBalance()

  const balance = useAccountBalanceByMintAddress(mintAddress)
  const wsol = useAccountBalanceByMintAddress(NATIVE_MINT.toBase58())

  const totalSolBalance = useMemo(() => {
    const total = wsol.amount.add(new BN(lamports))
    const totalBalance = Number(utilsBN.undecimalize(total, SOL_DECIMALS))
    return { balance: totalBalance, amount: total }
  }, [lamports, wsol.amount])

  return mintAddress === NATIVE_MINT.toBase58() ? totalSolBalance : balance
}
