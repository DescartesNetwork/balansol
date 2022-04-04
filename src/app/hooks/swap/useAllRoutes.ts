import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { calcOutGivenInSwap, getMintInfo } from 'app/helper/oracles'
import { AppState } from 'app/model'
import { useOracles } from '../useOracles'
import { MetaRoute } from './useMetaRoutes'

type RouteInfo = {
  pool: string
  bidMint: string
  bidAmount: BN
  askMint: string
  askAmount: BN
  priceImpact: number
}
export type Route = RouteInfo[]

export const useAllRoutes = (metaRoutes: MetaRoute[]): Route[] => {
  const {
    swap: { bidAmount },
    pools,
  } = useSelector((state: AppState) => state)
  const { decimalizeMintAmount } = useOracles()
  const [routes, setRoutes] = useState<Route[]>([])

  const computeRouteInfos = useCallback(async () => {
    const routes = []
    for (const metaRoute of metaRoutes) {
      const route = await Promise.all(
        metaRoute.map(async (market) => {
          const { bidMint, askMint, pool } = market
          const poolData = pools[pool]
          const bidMintInfo = getMintInfo(poolData, bidMint)
          const askMintInfo = getMintInfo(poolData, askMint)

          const bidAmountBN = await decimalizeMintAmount(bidAmount, bidMint)
          const tokenOutAmount = calcOutGivenInSwap(
            bidAmountBN,
            askMintInfo.reserve,
            bidMintInfo.reserve,
            askMintInfo.normalizedWeight,
            bidMintInfo.normalizedWeight,
            poolData.fee,
          )
          const routeInfo: RouteInfo = {
            pool: market.pool,
            bidMint,
            askMint,
            bidAmount: bidAmountBN,
            askAmount: tokenOutAmount,
            priceImpact: 0,
          }
          return routeInfo
        }),
      )
      routes.push(route)
    }
    return setRoutes(routes)
  }, [bidAmount, decimalizeMintAmount, metaRoutes, pools])

  useEffect(() => {
    computeRouteInfos()
  }, [computeRouteInfos])

  return routes
}
