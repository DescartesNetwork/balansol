import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { AppDispatch, AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
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
  const {
    swap: { isReverse },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()
  const [platformSwap, setPlatformSwap] = useState<SwapProvider>({
    ...DEFAULT_EMPTY_ROUTE,
  })
  //Route balansol
  const balansol = useSwapBalansol()
  // Route Jupiter
  const jupiter = useJupiterAggregator()

  const choosePlatform = useCallback(() => {
    if (balansol.route.length) return setPlatformSwap(balansol)
    return setPlatformSwap(jupiter)
  }, [balansol, jupiter])
  useEffect(() => {
    choosePlatform()
  }, [choosePlatform])

  const updateRouteFromBid = useCallback(() => {
    if (isReverse) return
    dispatch(setSwapState({ askAmount: platformSwap.askAmount.toString() }))
  }, [dispatch, isReverse, platformSwap.askAmount])
  useEffect(() => updateRouteFromBid(), [updateRouteFromBid])

  const updateRouteFromAsk = useCallback(() => {
    if (!isReverse) return
    dispatch(setSwapState({ bidAmount: platformSwap.bidAmount.toString() }))
  }, [dispatch, isReverse, platformSwap.bidAmount])
  useEffect(() => updateRouteFromAsk(), [updateRouteFromAsk])

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
