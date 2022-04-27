import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  calcInGivenOutSwap,
  calcPriceImpactSwap,
  getMintInfo,
} from 'app/helper/oracles'
import { AppState } from 'app/model'
import { useOracles } from '../../useOracles'
import { MetaRoute } from '../useMetaRoutes'
import { Route, RouteInfo } from '../useRouteSwap'
import { useMint } from '@senhub/providers'

export const useAllRoutesFromAsk = (metaRoutes: MetaRoute[]) => {
  const {
    swap: { askAmount, isReverse },
    pools,
  } = useSelector((state: AppState) => state)
  const { decimalizeMintAmount } = useOracles()
  const [routes, setRoutes] = useState<Route[]>([])
  const { getDecimals } = useMint()

  const computeRouteInfos = useCallback(async () => {
    const routes = []
    if (!isReverse) return setRoutes([])
    for (const metaRoute of metaRoutes) {
      const askMint = metaRoute[metaRoute.length - 1].askMint
      let route: RouteInfo[] = []
      let isValidRoute = true
      let currentAskAmount = await decimalizeMintAmount(askAmount, askMint)
      for (const market of [...metaRoute].reverse()) {
        const { bidMint, askMint, pool } = market
        const poolData = pools[pool]
        const bidMintInfo = getMintInfo(poolData, bidMint)
        const askMintInfo = getMintInfo(poolData, askMint)
        const decimalIn = await getDecimals(bidMint)
        const decimalOut = await getDecimals(askMint)

        if (currentAskAmount.gt(askMintInfo.reserve)) {
          isValidRoute = false
          break
        }
        const tokenInAmount = calcInGivenOutSwap(
          currentAskAmount,
          askMintInfo.reserve,
          bidMintInfo.reserve,
          askMintInfo.normalizedWeight,
          bidMintInfo.normalizedWeight,
          poolData.fee.add(poolData.taxFee),
        )
        if (tokenInAmount.lten(0)) {
          isValidRoute = false
          break
        }

        const dataForSlippage = {
          balanceIn: bidMintInfo.reserve,
          balanceOut: askMintInfo.reserve,
          weightIn: bidMintInfo.normalizedWeight,
          weightOut: askMintInfo.normalizedWeight,
          decimalIn: decimalIn,
          decimalOut: decimalOut,
          swapFee: poolData.fee.add(poolData.taxFee),
        }

        const newPriceImpact = calcPriceImpactSwap(
          tokenInAmount,
          currentAskAmount,
          dataForSlippage,
          true,
        )
        route = [
          {
            pool: market.pool,
            bidMint,
            askMint,
            bidAmount: tokenInAmount,
            askAmount: currentAskAmount,
            priceImpact: newPriceImpact,
          },
        ].concat(route)
        currentAskAmount = tokenInAmount
      }
      if (isValidRoute) routes.push(route)
    }
    return setRoutes(routes)
  }, [
    askAmount,
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
