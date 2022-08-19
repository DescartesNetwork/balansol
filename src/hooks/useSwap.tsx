import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDebounce } from 'react-use'
import { BN } from '@project-serum/anchor'
import { net } from '@sentre/senhub'

import { AppDispatch, AppState } from 'model'
import { setSwapState } from 'model/swap.controller'
import { useSwapBalansol } from './swap/useSwapBalansol'
import { useJupiterAggregator } from './jupiter/useJupiterAggregator'

export type RouteSwapInfo = {
  route: Route
  bidAmount: number
  askAmount: number
  priceImpact: number
}
export enum SwapPlatform {
  Balansol,
  Jupiter,
}
export type SwapProvider = RouteSwapInfo & {
  loading: boolean
  platform: SwapPlatform
  swap: () => Promise<{ txId: string }>
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

const DEFAULT_EMPTY_ROUTE = {
  route: [],
  bidAmount: 0,
  askAmount: 0,
  priceImpact: 0,
  swap: async () => {
    return { txId: '' }
  },
  loading: false,
  platform: SwapPlatform.Balansol,
}

const Context = createContext<SwapProvider>({ ...DEFAULT_EMPTY_ROUTE })

/**
 * Swap Context Provider
 */
const Provider = ({ children }: { children: ReactNode }) => {
  const isReverse = useSelector((state: AppState) => state.swap.isReverse)
  const dispatch = useDispatch<AppDispatch>()
  const [platformSwap, setPlatformSwap] = useState<SwapProvider>({
    ...DEFAULT_EMPTY_ROUTE,
  })
  //Route balansol
  const balansol = useSwapBalansol()
  // Route Jupiter
  const jupiter = useJupiterAggregator()

  const updateRouteFromBid = useCallback(() => {
    if (isReverse) return
    if (balansol.loading || jupiter.loading)
      return dispatch(setSwapState({ askAmount: '0', loading: true }))

    let askAmountBalansol = balansol.askAmount.toString()
    let askAmountJup = jupiter.askAmount.toString()
    // Select platform
    let platformSwap = balansol
    if (
      Number(askAmountJup) > 1.05 * Number(askAmountBalansol) &&
      net === 'mainnet' &&
      balansol.route.length
    )
      platformSwap = jupiter
    // Update platform
    let askAmount = platformSwap.askAmount.toString()
    dispatch(setSwapState({ askAmount, loading: false }))
    return setPlatformSwap(platformSwap)
  }, [balansol, dispatch, isReverse, jupiter])
  useDebounce(() => updateRouteFromBid(), 1000, [updateRouteFromBid])

  const updateRouteFromAsk = useCallback(() => {
    if (!isReverse) return
    let bidAmount = balansol.bidAmount.toString()
    const loading = balansol.loading
    if (loading) bidAmount = ''
    dispatch(setSwapState({ bidAmount, loading }))
    return setPlatformSwap(balansol)
  }, [balansol, dispatch, isReverse])
  useDebounce(() => updateRouteFromAsk(), 500, [updateRouteFromAsk])

  const provider = useMemo((): SwapProvider => {
    return platformSwap
  }, [platformSwap])

  // Context provider
  return <Context.Provider value={provider}>{children}</Context.Provider>
}
export default Provider

/**
 * Swap Hook
 */
export const useSwap = () => {
  return useContext<SwapProvider>(Context)
}
