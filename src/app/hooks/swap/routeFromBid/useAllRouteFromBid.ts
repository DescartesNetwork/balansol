import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useMint } from '@senhub/providers'
import {
  calcOutGivenInSwap,
  calcPriceImpactSwap,
  getMintInfo,
} from 'app/helper/oracles'
import { AppState } from 'app/model'
import { useOracles } from '../../useOracles'
import { MetaRoute } from '../useMetaRoutes'
import { Route, RouteInfo } from '../useRouteSwap'

export const useAllRouteFromBid = (metaRoutes: MetaRoute[]): Route[] => {
  const {
    swap: { bidAmount, isReverse },
    pools,
  } = useSelector((state: AppState) => state)
  const { decimalizeMintAmount } = useOracles()
  const [routes, setRoutes] = useState<Route[]>([])
  const { getDecimals } = useMint()

  const computeRouteInfos = useCallback(async () => {
    const routes = []
    if (isReverse) return setRoutes([])
    for (const metaRoute of metaRoutes) {
      const bidMint = metaRoute[0].bidMint
      const route = []
      let bidAmountBN = await decimalizeMintAmount(bidAmount, bidMint)
      for (const market of metaRoute) {
        const { bidMint, askMint, pool } = market
        const poolData = pools[pool]
        const bidMintInfo = getMintInfo(poolData, bidMint)
        const askMintInfo = getMintInfo(poolData, askMint)
        const decimalIn = await getDecimals(bidMint)
        const decimalOut = await getDecimals(askMint)

        const tokenOutAmount = calcOutGivenInSwap(
          bidAmountBN,
          askMintInfo.reserve,
          bidMintInfo.reserve,
          askMintInfo.normalizedWeight,
          bidMintInfo.normalizedWeight,
          poolData.fee.add(poolData.taxFee),
        )

        const dataForSlippage = {
          balanceIn: bidMintInfo.reserve,
          balanceOut: askMintInfo.reserve,
          weightIn: bidMintInfo.normalizedWeight,
          weightOut: askMintInfo.normalizedWeight,
          decimalIn: decimalIn,
          decimalOut: decimalOut,
          swapFee: poolData.fee.add(poolData.taxFee),
        }

        let priceImpact = calcPriceImpactSwap(
          bidAmountBN,
          tokenOutAmount,
          dataForSlippage,
        )

        if (priceImpact < 0) priceImpact = 0
        const routeInfo: RouteInfo = {
          pool: market.pool,
          bidMint,
          askMint,
          bidAmount: bidAmountBN,
          askAmount: tokenOutAmount,
          priceImpact: priceImpact,
        }
        route.push(routeInfo)
        bidAmountBN = tokenOutAmount
      }
      routes.push(route)
    }
    return setRoutes(routes)
  }, [
    bidAmount,
    decimalizeMintAmount,
    getDecimals,
    isReverse,
    metaRoutes,
    pools,
  ])

  useEffect(() => {
    computeRouteInfos()
  }, [computeRouteInfos])

  return routes
}
