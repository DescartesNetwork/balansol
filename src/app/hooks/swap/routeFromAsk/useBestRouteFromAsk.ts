import { calcPriceImpact } from 'app/helper/oracles'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { AppState } from 'app/model'
import { useBalansolPools } from 'app/hooks/useBalansolPools'
import { useMetaRoutes } from '../useMetaRoutes'
import { useOracles } from '../../useOracles'
import { RouteSwapInfo } from '../../useSwap'
import { useAllRoutesFromAsk } from './useAllRoutesFromAsk'

export const useBestRouteFromAsk = () => {
  const [routeSwapInfo, setRouteSwapInfo] = useState<RouteSwapInfo>({
    route: [],
    bidAmount: 0,
    askAmount: 0,
    priceImpact: 0,
  })
  const { bidMint, askAmount, askMint } = useSelector(
    (state: AppState) => state.swap,
  )
  const { activePools } = useBalansolPools()

  const { undecimalizeMintAmount } = useOracles()
  const metaRoutes = useMetaRoutes()
  const routes = useAllRoutesFromAsk(metaRoutes)

  const getBestRoute = useCallback(async () => {
    let sortedRoute = routes.sort((routeA, routeB) => {
      let bidAmountA: BN = routeA[0].bidAmount
      let bidAmountB: BN = routeB[0].bidAmount
      return bidAmountA.gt(bidAmountB) ? 1 : -1
    })
    const bestRoute = sortedRoute[0]
    if (!bestRoute?.length || !bidMint || !askMint)
      return setRouteSwapInfo({
        route: [],
        bidAmount: Number(0),
        askAmount: 0,
        priceImpact: 0,
      })

    let bidAmount = await undecimalizeMintAmount(
      bestRoute[0]?.bidAmount,
      bidMint,
    )

    const bestRouteFullInfo = bestRoute.map((value, idx) => {
      const poolData = activePools[value.pool]
      return { ...bestRoute[idx], poolData }
    })
    const newPriceImpact = calcPriceImpact(bestRouteFullInfo)

    return setRouteSwapInfo({
      route: bestRoute,
      bidAmount: Number(bidAmount),
      askAmount: Number(askAmount),
      priceImpact: newPriceImpact,
    })
  }, [askAmount, askMint, bidMint, activePools, routes, undecimalizeMintAmount])

  useEffect(() => {
    getBestRoute()
  }, [getBestRoute])

  return routeSwapInfo
}
