import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { AppState } from 'app/model'
import { useMetaRoutes } from './useMetaRoutes'
import { Route, useAllRoutesReverse } from './useAllRoutesReverse'
import { useOracles } from '../useOracles'

type RouteSwapInfo = {
  route: Route
  bidAmount: number
  askAmount: number
  priceImpact: number
}

export const useRouteReversedSwap = () => {
  const {
    swap: { bidMint },
  } = useSelector((state: AppState) => state)
  const { undecimalizeMintAmount } = useOracles()
  const metaRoutes = useMetaRoutes()
  const { computeRouteInfos } = useAllRoutesReverse(metaRoutes)

  const getBestRoute = useCallback(
    async (askAmountInput: number | string) => {
      let routeSwapInfo: RouteSwapInfo = {
        route: [],
        bidAmount: 0,
        askAmount: 0,
        priceImpact: 0,
      }
      const routes: Route[] = await computeRouteInfos(askAmountInput)

      let sortedRoute = routes.sort((routeA, routeB) => {
        let bidAmountA: BN = routeA[0].bidAmount
        let bidAmountB: BN = routeB[0].bidAmount
        return bidAmountA.gt(bidAmountB) ? 1 : -1
      })

      const bestRoute = sortedRoute[0] || []

      let bidAmount =
        bestRoute.length && bidMint
          ? await undecimalizeMintAmount(bestRoute[0]?.bidAmount, bidMint)
          : ''
      routeSwapInfo = {
        route: bestRoute,
        bidAmount: Number(bidAmount),
        askAmount: Number(askAmountInput),
        priceImpact: 0,
      }
      return routeSwapInfo
    },
    [bidMint, computeRouteInfos, undecimalizeMintAmount],
  )

  return { getBestRoute }
}
