import { useCallback } from 'react'
import { Address, BN, web3 } from '@coral-xyz/anchor'
import { useGetMintDecimals } from '@sentre/senhub'
import util from '@senswap/sen-js/dist/utils'

export const useOracles = () => {
  const getDecimals = useGetMintDecimals()

  const decimalizeMintAmount = useCallback(
    async (amount: number | string, mintAddress: Address) => {
      const decimals =
        (await getDecimals({
          mintAddress: new web3.PublicKey(mintAddress).toString(),
        })) || 0
      return new BN(util.decimalize(amount, decimals).toString())
    },
    [getDecimals],
  )

  const undecimalizeMintAmount = useCallback(
    async (amount: BN, mintAddress: Address) => {
      const decimals =
        (await getDecimals({
          mintAddress: new web3.PublicKey(mintAddress).toString(),
        })) || 0
      return util.undecimalize(BigInt(amount.toString()), decimals)
    },
    [getDecimals],
  )

  const decimalize = useCallback(
    (amount: number | string, decimals: number) => {
      return new BN(util.decimalize(amount, decimals).toString())
    },
    [],
  )

  const undecimalize = useCallback((amount: BN, decimals: number) => {
    return util.undecimalize(BigInt(amount.toString()), decimals)
  }, [])

  return {
    decimalize,
    undecimalize,
    decimalizeMintAmount,
    undecimalizeMintAmount,
  }
}
