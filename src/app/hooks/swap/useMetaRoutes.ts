import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'app/model'
import { useMintRoutes } from './useMintRoutes'

type Market = {
  pool: string
  bidMint: string
  askMint: string
}
export type MetaRoute = Market[]

export const useMetaRoutes = () => {
  const {
    swap: { askMint, bidMint },
  } = useSelector((state: AppState) => state)

  const tokenRoutes = useMintRoutes()

  const validRoute = (route: MetaRoute) => {
    for (const marketBid of route) {
      for (const marketAsk of route) {
        if (
          marketBid.bidMint === marketAsk.askMint &&
          marketBid.askMint === marketAsk.bidMint
        )
          return false
      }
    }
    return true
  }

  const computeMetaRoutes = useCallback(
    (bidMint: string, askMint: string, deep: number = 1): MetaRoute[] => {
      if (deep > 3) return []
      const routesFromBidMint = tokenRoutes[bidMint]
      if (!routesFromBidMint) return []

      // Market is all pools can swap bidMint -> askMint
      const markets = routesFromBidMint[askMint] || []
      const routes: MetaRoute[] = markets.map((market) => {
        return [{ pool: market, bidMint, askMint }]
      })

      for (const nextMint in routesFromBidMint) {
        const nextMintMarkets = routesFromBidMint[nextMint]
        if (!nextMintMarkets) continue
        const nextDeep = deep + 1
        const deepRoutes = computeMetaRoutes(nextMint, askMint, nextDeep)
        for (const deepRoute of deepRoutes) {
          for (const nextMintMarket of nextMintMarkets) {
            const newRoute = [
              { pool: nextMintMarket, bidMint, askMint: nextMint },
              ...deepRoute,
            ]
            if (!validRoute(newRoute)) continue
            routes.push(newRoute)
          }
        }
      }
      return routes
    },
    [tokenRoutes],
  )

  const metaRoutes = useMemo(
    () => computeMetaRoutes(bidMint, askMint),
    [askMint, bidMint, computeMetaRoutes],
  )

  return metaRoutes
}
