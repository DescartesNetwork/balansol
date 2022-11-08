import { useCallback } from 'react'
import { BN } from '@project-serum/anchor'
import { utilsBN } from '@sen-use/web3'

export const useGetPriceInPool = () => {
  const getTokenPrice = useCallback(
    (weightA: BN, balanceA: BN, priceB: number, balanceB: BN, weightB: BN) => {
      const totalWeights = utilsBN.toNumber(weightA) + utilsBN.toNumber(weightB)
      const numWeightA = utilsBN.toNumber(weightA) / totalWeights
      const numWeightB = utilsBN.toNumber(weightB) / totalWeights
      const numBalanceA = utilsBN.toNumber(balanceA)
      const numBalanceB = utilsBN.toNumber(balanceB)
      const priceA =
        (numWeightA * numBalanceB * priceB) / (numBalanceA * numWeightB)
      return priceA
    },
    [],
  )

  return getTokenPrice
}
