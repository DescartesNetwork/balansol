import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@coral-xyz/anchor'
import { useDebounce } from 'react-use'

import { AppState } from 'model'
import { calcPriceImpact } from 'helper/oracles'
import { useOracles } from '../../useOracles'
import { useMetaRoutes } from '../useMetaRoutes'
import { RouteSwapInfo } from '../../useSwap'
import { useAllRouteFromBid } from './useAllRouteFromBid'
import { useBalansolPools } from 'hooks/useBalansolPools'

export const useBestRouteFromBid = (): {
  loading: boolean
  bestRoute: RouteSwapInfo
} => {
  const [routeSwapInfo, setRouteSwapInfo] = useState<RouteSwapInfo>({
    route: [],
    bidAmount: 0,
    askAmount: 0,
    priceImpact: 0,
  })
  const [loading, setLoading] = useState(false)
  const { bidAmount, askMint, bidMint, isReverse } = useSelector(
    (state: AppState) => state.swap,
  )
  const { activePools } = useBalansolPools()
  const { undecimalizeMintAmount } = useOracles()
  const metaRoutes = useMetaRoutes()
  const routes = useAllRouteFromBid(metaRoutes)

  const getBestRoute = useCallback(async () => {
    let sortedRoute = routes.sort((routeA, routeB) => {
      let askAmountA = routeA[routeA.length - 1].askAmount
      let askAmountB: BN = routeB[routeB.length - 1].askAmount
      return askAmountB.gt(askAmountA) ? 1 : -1
    })
    const bestRoute = sortedRoute[0]
    if (!bestRoute?.length || !bidMint || !askMint)
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
  }, [askMint, bidAmount, bidMint, activePools, routes, undecimalizeMintAmount])

  useDebounce(
    () => {
      try {
        if (isReverse) return
        getBestRoute()
      } catch (error) {
        console.log('route error:', error)
      } finally {
        setLoading(false)
      }
    },
    500,
    [getBestRoute],
  )

  useEffect(() => {
    setLoading(true)
  }, [getBestRoute])

  return { loading, bestRoute: routeSwapInfo }
}
