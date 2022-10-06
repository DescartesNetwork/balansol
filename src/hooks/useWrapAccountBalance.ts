import { useMemo } from 'react'
import { utils } from '@senswap/sen-js'
import { useWalletBalance } from '@sentre/senhub'
import { NATIVE_MINT } from '@solana/spl-token-v3'

import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import { SOL_DECIMALS } from 'constant'

export const useWrapAccountBalance = (mintAddress: string) => {
  const lamports = useWalletBalance()

  const balance = useAccountBalanceByMintAddress(mintAddress)
  const wsol = useAccountBalanceByMintAddress(NATIVE_MINT.toBase58())

  const totalSolBalance = useMemo(() => {
    const total = wsol.amount + lamports
    const totalBalance = Number(utils.undecimalize(total, SOL_DECIMALS))
    return { balance: totalBalance, amount: total }
  }, [lamports, wsol.amount])

  return mintAddress === NATIVE_MINT.toBase58() ? totalSolBalance : balance
}
