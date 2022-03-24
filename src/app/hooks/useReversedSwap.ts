import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  calcInGivenOutSwap,
  calcOutGivenInSwap,
  getMintInfo,
} from 'app/helper/oracles'
import { AppState } from 'app/model'
import { useOracles } from './useOracles'
import { useRouteSwap } from './useRouteSwap'

type Route = {
  pool: string
  bidMint: string
  bidAmount: string
  askMint: string
  askAmount: string
}

export const useReversedSwap = () => {
  const {
    swap: { askMint, bidMint },
    pools,
  } = useSelector((state: AppState) => state)

  const { decimalizeMintAmount, undecimalizeMintAmount } = useOracles()

  const estimateTokenOut = useCallback(
    async (askAmount: string) => {
      let result = ''
      if (!bidMint || !askMint) return result

      for (const pool in pools) {
        const poolData = pools[pool]
        const bidMintInfo = getMintInfo(poolData, bidMint)
        const askMintInfo = getMintInfo(poolData, askMint)
        if (!bidMintInfo || !askMintInfo) continue
        const askAmountBN = await decimalizeMintAmount(askAmount, askMint)

        const tokenOutAmount = calcInGivenOutSwap(
          askAmountBN,
          askMintInfo.reserve,
          bidMintInfo.reserve,
          askMintInfo.normalizedWeight,
          bidMintInfo.normalizedWeight,
          poolData.fee,
        )

        const bidAmount = await undecimalizeMintAmount(tokenOutAmount, bidMint)
        if (Number(bidAmount) > Number(result)) {
          result = bidAmount
        }
      }
      return result
    },
    [askMint, bidMint, decimalizeMintAmount, pools, undecimalizeMintAmount],
  )

  return { estimateTokenOut }
}
