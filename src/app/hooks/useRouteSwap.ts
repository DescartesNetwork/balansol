import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  calcOutGivenInSwap,
  calcSpotPrice,
  getMintInfo,
  MintInfo,
} from 'app/helper/oracles'
import { AppState } from 'app/model'
import { useOracles } from './useOracles'
import { BN } from '@project-serum/anchor'

type Route = {
  pool: string
  bidMint: string
  bidAmount: string
  askMint: string
  askAmount: string
  priceImpact: number
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
    priceImpact: 0,
  })
  const { decimalizeMintAmount, undecimalizeMintAmount } = useOracles()

  const findRoute = useCallback(async () => {
    let newRoute = {
      pool: '',
      bidMint,
      bidAmount,
      askMint,
      askAmount: '',
      priceImpact: 0,
    }

    if (!bidMint || !askMint) return setBestRoute(newRoute)

    for (const pool in pools) {
      const poolData = pools[pool]
      const bidMintInfo = getMintInfo(poolData, bidMint)
      const askMintInfo = getMintInfo(poolData, askMint)
      if (!bidMintInfo || !askMintInfo) continue
      const bidAmountBN = await decimalizeMintAmount(bidAmount, bidMint)

      const tokenOutAmount = calcOutGivenInSwap(
        bidAmountBN,
        askMintInfo.reserve,
        bidMintInfo.reserve,
        askMintInfo.normalizedWeight,
        bidMintInfo.normalizedWeight,
        poolData.fee,
      )
      const askAmount = await undecimalizeMintAmount(tokenOutAmount, askMint)
      if (Number(askAmount) > Number(newRoute.askAmount)) {
        const priceImpact = calcPriceImpact(
          bidMintInfo,
          askMintInfo,
          bidAmountBN,
          tokenOutAmount,
        )

        newRoute.askAmount = askAmount
        newRoute.priceImpact = priceImpact
        newRoute.pool = pool
      }
    }
    setBestRoute(newRoute)
  }, [
    askMint,
    bidAmount,
    bidMint,
    decimalizeMintAmount,
    pools,
    undecimalizeMintAmount,
  ])

  const calcPriceImpact = (
    bidMintInfo: MintInfo,
    askMintInfo: MintInfo,
    bidAmountBN: BN,
    tokenOutAmount: BN,
  ) => {
    const beforeSpotPrice = calcSpotPrice(
      bidMintInfo.reserve,
      bidMintInfo.normalizedWeight,
      askMintInfo.reserve,
      askMintInfo.normalizedWeight,
    )
    const afterSpotPrice = calcSpotPrice(
      new BN(bidMintInfo.reserve.toNumber() + bidAmountBN.toNumber()),
      bidMintInfo.normalizedWeight,
      new BN(askMintInfo.reserve.toNumber() - tokenOutAmount.toNumber()),
      askMintInfo.normalizedWeight,
    )
    return (afterSpotPrice - beforeSpotPrice) / beforeSpotPrice
  }

  useEffect(() => {
    findRoute()
  }, [findRoute])

  return { ...bestRoute }
}
