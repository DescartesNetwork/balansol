import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { calcInGivenOutSwap, getMintInfo } from 'app/helper/oracles'
import { AppState } from 'app/model'
import { useOracles } from '../../useOracles'
import { MetaRoute } from '../useMetaRoutes'
import { Route, RouteInfo } from '../useRouteSwap'

export const useAllRoutesFromAsk = (metaRoutes: MetaRoute[]) => {
  const {
    swap: { askAmount, isReverse },
    pools,
  } = useSelector((state: AppState) => state)
  const { decimalizeMintAmount } = useOracles()
  const [routes, setRoutes] = useState<Route[]>([])

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
        route = [
          {
            pool: market.pool,
            bidMint,
            askMint,
            bidAmount: tokenInAmount,
            askAmount: currentAskAmount,
            priceImpact: 0,
          },
        ].concat(route)
        currentAskAmount = tokenInAmount
      }
      if (isValidRoute) routes.push(route)
    }
    return setRoutes(routes)
  }, [askAmount, decimalizeMintAmount, isReverse, metaRoutes, pools])

  useEffect(() => {
    computeRouteInfos()
  }, [computeRouteInfos])

  return routes
}
