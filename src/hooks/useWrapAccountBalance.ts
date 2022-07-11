import { utils } from '@senswap/sen-js'
import { useWallet } from '@sentre/senhub'
import { useMemo } from 'react'

import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'

const WSOL_ADDRESS = 'So11111111111111111111111111111111111111112'
const SOL_DECIMALS = 9

export const useWrapAccountBalance = (mintAddress: string) => {
  const {
    wallet: { lamports },
  } = useWallet()

  const { balance } = useAccountBalanceByMintAddress(mintAddress)
  const wsol = useAccountBalanceByMintAddress(WSOL_ADDRESS)

  const totalSolBalance = useMemo(() => {
    const total = wsol.amount + lamports
    return Number(utils.undecimalize(total, SOL_DECIMALS))
  }, [lamports, wsol.amount])

  return mintAddress === WSOL_ADDRESS ? totalSolBalance : balance
}
