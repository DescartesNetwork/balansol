import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getMintInfo } from 'app/helper/oracles'
import { AppState } from 'app/model'
// import { useOracles } from '../useOracles'

type Route = {
  pool: string
  bidMint: string
  bidAmount: string
  askMint: string
  askAmount: string
  priceImpact: number
}[]

export const useRouteSwap = () => {
  const {
    swap: { bidAmount, askMint, bidMint },
    pools,
  } = useSelector((state: AppState) => state)
  const [bestRoute, setBestRoute] = useState<Route>([])
  // const { decimalizeMintAmount } = useOracles()

  const findRoute = useCallback(async () => {
    if (!bidMint || !askMint) return setBestRoute([])

    for (const pool in pools) {
      const poolData = pools[pool]
      try {
        const bidMintInfo = getMintInfo(poolData, bidMint)
        const askMintInfo = getMintInfo(poolData, askMint)
        if (!bidMintInfo || !askMintInfo) continue
        //const bidAmountBN = await decimalizeMintAmount(bidAmount, bidMint)

        // const tokenOutAmount = calcOutGivenInSwap(
        //   bidAmountBN,
        //   askMintInfo.reserve,
        //   bidMintInfo.reserve,
        //   askMintInfo.normalizedWeight,
        //   bidMintInfo.normalizedWeight,
        //   poolData.fee,
        // )
        // const askAmount = await undecimalizeMintAmount(tokenOutAmount, askMint)
        // if (Number(askAmount) > Number(newRoute.askAmount)) {
        //   const priceImpact = calcPriceImpact(
        //     bidMintInfo,
        //     askMintInfo,
        //     bidAmountBN,
        //     tokenOutAmount,
        //   )

        //   newRoute.askAmount = askAmount
        //   newRoute.priceImpact = priceImpact
        //   newRoute.pool = pool
        // }

        setBestRoute([])
      } catch {
        continue
      }
    }
  }, [askMint, bidMint, pools])

  // const calcPriceImpact = (
  //   bidMintInfo: MintDataFromPool,
  //   askMintInfo: MintDataFromPool,
  //   bidAmountBN: BN,
  //   tokenOutAmount: BN,
  // ) => {
  //   const beforeSpotPrice = calcSpotPrice(
  //     bidMintInfo.reserve,
  //     bidMintInfo.normalizedWeight,
  //     askMintInfo.reserve,
  //     askMintInfo.normalizedWeight,
  //   )
  //   const afterSpotPrice = calcSpotPrice(
  //     new BN(bidMintInfo.reserve.toNumber() + bidAmountBN.toNumber()),
  //     bidMintInfo.normalizedWeight,
  //     new BN(askMintInfo.reserve.toNumber() - tokenOutAmount.toNumber()),
  //     askMintInfo.normalizedWeight,
  //   )
  //   return (afterSpotPrice - beforeSpotPrice) / beforeSpotPrice
  // }

  useEffect(() => {
    findRoute()
  }, [findRoute])

  return {
    route: bestRoute,
    bidAmount: Number(bidAmount),
    askAmount: 0,
    priceImpact: 0,
  }
}
