import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'app/model'
import { SwapPlatform, SwapPlatformInfo } from '../useSwap'
import { useOracles } from '../useOracles'
import { useBestRouteFromAsk } from './routeFromAsk/useBestRouteFromAsk'
import { useBestRouteFromBid } from './routeFromBid/useBestRouteFromBid'

export const useSwapBalansol = (): SwapPlatformInfo => {
  const {
    swap: { bidAmount, bidMint, askMint, slippageTolerance, isReverse },
  } = useSelector((state: AppState) => state)
  const { decimalizeMintAmount } = useOracles()
  const routesFromBid = useBestRouteFromBid()
  const routesFromAsk = useBestRouteFromAsk()
  const routeInfo = isReverse ? routesFromAsk : routesFromBid

  const swap = useCallback(async () => {
    const bidAmountBN = await decimalizeMintAmount(bidAmount, bidMint)
    const limit = Number(routeInfo.askAmount) * (1 - slippageTolerance / 100)
    const limitBN = await decimalizeMintAmount(limit, askMint)
    return window.balansol.route(bidAmountBN, routeInfo.route, limitBN)
  }, [
    askMint,
    bidAmount,
    bidMint,
    decimalizeMintAmount,
    routeInfo.askAmount,
    routeInfo.route,
    slippageTolerance,
  ])

  return useMemo(() => {
    return {
      ...routeInfo,
      swap,
      loading: false,
      platform: SwapPlatform.Balansol,
    }
  }, [routeInfo, swap])
}
