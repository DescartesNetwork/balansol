import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { AppDispatch, AppState } from 'app/model'
import { setSwapState } from 'app/model/swap.controller'
import { useSwapBalansol } from './swap/useSwapBalansol'

export type SwapProvider = {
  swap: SwapPlatformInfo
}
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
export type SwapPlatformInfo = RouteSwapInfo & {
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

const Context = createContext<SwapProvider>({
  swap: {
    route: [],
    bidAmount: 0,
    askAmount: 0,
    priceImpact: 0,
    swap: async () => {
      return { txId: '' }
    },
    loading: false,
    platform: SwapPlatform.Balansol,
  },
})

/**
 * Swap Context Provider
 */
const Provider = ({ children }: { children: ReactNode }) => {
  const {
    swap: { isReverse },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()

  //Route balansol
  const balansol = useSwapBalansol()
  // Route Jupiter
  // const jupiter = useJupiterAggregator()

  const updateRouteFromBid = useCallback(() => {
    if (isReverse) return
    dispatch(setSwapState({ askAmount: balansol.askAmount.toString() }))
    // check route jupiter
    // if (!balansol.askAmount) {
    //   dispatch(setSwapState({ askAmount: balansol.askAmount.toString() }))
    //   setSwapPlatformInfo(jupiter)
    // }
  }, [balansol, dispatch, isReverse])
  useEffect(() => updateRouteFromBid(), [updateRouteFromBid])

  const updateRouteFromAsk = useCallback(() => {
    if (!isReverse) return
    dispatch(setSwapState({ bidAmount: balansol.bidAmount.toString() }))
  }, [balansol, dispatch, isReverse])
  useEffect(() => updateRouteFromAsk(), [updateRouteFromAsk])

  const provider = useMemo((): SwapProvider => {
    return { swap: balansol }
  }, [balansol])

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
