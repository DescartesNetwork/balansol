import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { AppState } from 'app/model'
import { useMetaRoutes } from './useMetaRoutes'
import { Route, useAllRoutes } from './useAllRoutes'
import { useOracles } from '../useOracles'
import { calcPriceImpact } from 'app/helper/oracles'

type RouteSwapInfo = {
  route: Route
  bidAmount: number
  askAmount: number
  priceImpact: number
}

export const useRouteSwap = (): RouteSwapInfo => {
  const {
    swap: { bidAmount, askMint },
    pools,
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
    const bestRoute = sortedRoute[0]
    if (!bestRoute?.length || !askMint)
      return setRouteSwapInfo({
        route: [],
        bidAmount: Number(bidAmount),
        askAmount: 0,
        priceImpact: 0,
      })

    let askAmount = await undecimalizeMintAmount(
      bestRoute[bestRoute.length - 1]?.askAmount,
      askMint,
    )
    const bestRouteFullInfo = bestRoute.map((value, idx) => {
      const poolData = pools[value.pool]
      return { ...bestRoute[idx], poolData }
    })
    const newPriceImpact = calcPriceImpact(bestRouteFullInfo)

    return setRouteSwapInfo({
      route: bestRoute,
      bidAmount: Number(bidAmount),
      askAmount: Number(askAmount),
      priceImpact: newPriceImpact,
    })
  }, [askMint, bidAmount, pools, routes, undecimalizeMintAmount])

  useEffect(() => {
    getBestRoute()
  }, [getBestRoute])

  return routeSwapInfo
}
