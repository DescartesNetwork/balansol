import { BN } from '@project-serum/anchor'
import { AppDispatch, AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useBestRouteFromAsk } from './routeFromAsk/useBestRouteFromAsk'
import { useBestRouteFromBid } from './routeFromBid/useBestRouteFromBid'

export type RouteSwapInfo = {
  route: Route
  bidAmount: number
  askAmount: number
  priceImpact: number
}

export type RouteInfo = {
  pool: string
  bidMint: string
  bidAmount: BN
  askMint: string
  askAmount: BN
  priceImpact: number
}
export type Route = RouteInfo[]

export const useRouteSwap = (): RouteSwapInfo => {
  const {
    swap: { isReverse, bidMint, askMint, bidAmount, askAmount },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()

  const routesFromBid = useBestRouteFromBid()
  const routesFromAsk = useBestRouteFromAsk()
  const route = isReverse ? routesFromAsk : routesFromBid

  const updateRouteFromBid = useCallback(() => {
    if (isReverse) return
    dispatch(setSwapState({ askAmount: route.askAmount.toString() })).unwrap()
  }, [dispatch, isReverse, route.askAmount])
  useEffect(() => updateRouteFromBid(), [updateRouteFromBid])

  const updateRouteFromAsk = useCallback(() => {
    if (!isReverse) return
    dispatch(setSwapState({ bidAmount: route.bidAmount.toString() })).unwrap()
  }, [dispatch, isReverse, route.bidAmount])
  useEffect(() => updateRouteFromAsk(), [updateRouteFromAsk])

  if (!bidMint || !askMint || !(Number(bidAmount) && Number(askAmount)))
    return { route: [], bidAmount: 0, askAmount: 0, priceImpact: 0 }
  return route
}
