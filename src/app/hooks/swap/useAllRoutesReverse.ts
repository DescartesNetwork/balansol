import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { calcInGivenOutSwap, getMintInfo } from 'app/helper/oracles'
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

export const useAllRoutesReverse = (metaRoutes: MetaRoute[]) => {
  const { pools } = useSelector((state: AppState) => state)
  const { decimalizeMintAmount } = useOracles()

  const computeRouteInfos = useCallback(
    async (askAmountInput: number | string) => {
      const routes = []
      for (const metaRoute of metaRoutes) {
        let isValidRoute = true
        const route = await Promise.all(
          metaRoute.map(async (market) => {
            const { bidMint, askMint, pool } = market
            const poolData = pools[pool]
            const bidMintInfo = getMintInfo(poolData, bidMint)
            const askMintInfo = getMintInfo(poolData, askMint)

            const askAmountBN = await decimalizeMintAmount(
              askAmountInput,
              askMint,
            )
            const tokenInAmount = calcInGivenOutSwap(
              askAmountBN,
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
              bidAmount: tokenInAmount,
              askAmount: askAmountBN,
              priceImpact: 0,
            }
            if (tokenInAmount.lten(0)) {
              isValidRoute = false
            }
            return routeInfo
          }),
        )
        if (isValidRoute) routes.push(route)
      }
      return routes
    },
    [decimalizeMintAmount, metaRoutes, pools],
  )

  return { computeRouteInfos }
}
