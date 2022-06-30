import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'
import { useDebounce } from 'react-use'

import { AppState } from 'model'
import { calcPriceImpact } from 'helper/oracles'
import { useBalansolPools } from 'hooks/useBalansolPools'
import { useOracles } from '../../useOracles'
import { RouteSwapInfo } from '../../useSwap'
import { useMetaRoutes } from '../useMetaRoutes'
import { useAllRoutesFromAsk } from './useAllRoutesFromAsk'

export const useBestRouteFromAsk = (): {
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
  const { bidMint, askAmount, askMint, isReverse } = useSelector(
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

  useDebounce(
    () => {
      try {
        if (!isReverse) return
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
