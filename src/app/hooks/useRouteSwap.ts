import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { calOutGivenInSwap, getMintInfo } from 'app/helper/oracles'
import { AppState } from 'app/model'
import { useOracles } from './useOracles'

type Route = {
  pool: string
  bidMint: string
  bidAmount: string
  askMint: string
  askAmount: string
}

export const useRouteSwap = () => {
  const {
    swap: { bidAmount, askMint, bidMint },
    pools,
  } = useSelector((state: AppState) => state)
  const [bestRoute, setBestRoute] = useState<Route>({
    pool: '',
    bidMint,
    bidAmount,
    askMint,
    askAmount: '',
  })
  const { decimalizeMintAmount } = useOracles()

  const findRoute = useCallback(async () => {
    let newRoute = {
      pool: '',
      bidMint,
      bidAmount,
      askMint,
      askAmount: '',
    }
    if (!bidMint || !askMint) return setBestRoute(newRoute)

    for (const pool in pools) {
      const poolData = pools[pool]
      const bidMintInfo = getMintInfo(poolData, bidMint)
      const askMintInfo = getMintInfo(poolData, askMint)
      if (!bidMintInfo || !askMintInfo) continue
      const bidAmountBN = await decimalizeMintAmount(bidAmount, bidMint)

      const tokenOutAmount = calOutGivenInSwap(
        bidAmountBN,
        askMintInfo.reserve,
        bidMintInfo.reserve,
        bidMintInfo.normalizedWeight,
        askMintInfo.normalizedWeight,
        poolData.fee,
      )
      if (tokenOutAmount > Number(newRoute.askAmount)) {
        newRoute.askAmount = String(tokenOutAmount)
        newRoute.pool = pool
      }
    }
    setBestRoute(newRoute)
  }, [askMint, bidAmount, bidMint, decimalizeMintAmount, pools])

  useEffect(() => {
    findRoute()
  }, [findRoute])

  return { ...bestRoute }
}
