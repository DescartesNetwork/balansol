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

  const choosePlatform = useCallback(() => {
    if (
      balansol.route.length ||
      isReverse ||
      net !== 'mainnet' ||
      balansol.loading
    )
      return setPlatformSwap(balansol)
    return setPlatformSwap(jupiter)
  }, [balansol, isReverse, jupiter])
  useDebounce(() => choosePlatform(), 300, [choosePlatform])

  const updateRouteFromBid = useCallback(() => {
    if (isReverse) return
    let askAmount = platformSwap.askAmount.toString()
    const loading = platformSwap.loading
    if (loading) askAmount = ''
    dispatch(setSwapState({ askAmount, loading }))
  }, [platformSwap, isReverse, dispatch])
  useDebounce(() => updateRouteFromBid(), 300, [updateRouteFromBid])

  const updateRouteFromAsk = useCallback(() => {
    if (!isReverse) return
    let bidAmount = platformSwap.bidAmount.toString()
    const loading = platformSwap.loading
    if (loading) bidAmount = ''
    dispatch(setSwapState({ bidAmount, loading }))
  }, [dispatch, isReverse, platformSwap.bidAmount, platformSwap.loading])
  useDebounce(() => updateRouteFromAsk(), 300, [updateRouteFromAsk])

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
