import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { AppState } from 'app/model'
import { useMetaRoutes } from './useMetaRoutes'
import { Route, useAllRoutes } from './useAllRoutes'
import { useOracles } from '../useOracles'

type RouteSwapInfo = {
  route: Route
  bidAmount: number
  askAmount: number
  priceImpact: number
}

export const useRouteSwap = (): RouteSwapInfo => {
  const {
    swap: { bidAmount, askMint },
  } = useSelector((state: AppState) => state)
  const { undecimalizeMintAmount } = useOracles()
  const metaRoutes = useMetaRoutes()
  const routes = useAllRoutes(metaRoutes)
  const [routeSwapInfo, setRouteSwapInfo] = useState<RouteSwapInfo>({
    route: [],
    bidAmount: 0,
    askAmount: 0,
    priceImpact: 0,
  })

  const getBestRoute = useCallback(async () => {
    let sortedRoute = routes.sort((routeA, routeB) => {
      let askAmountA = routeA[routeA.length - 1].askAmount
      let askAmountB: BN = routeB[routeB.length - 1].askAmount
      return askAmountB.gt(askAmountA) ? 1 : -1
    })
    const bestRoute = sortedRoute[0] || []
    const askAmount = await undecimalizeMintAmount(
      bestRoute[bestRoute.length - 1]?.askAmount,
      askMint,
    )
    return setRouteSwapInfo({
      route: bestRoute,
      bidAmount: Number(bidAmount),
      askAmount: Number(askAmount),
      priceImpact: 0,
    })
  }, [askMint, bidAmount, routes, undecimalizeMintAmount])

  useEffect(() => {
    getBestRoute()
  }, [getBestRoute])

  return routeSwapInfo
}
