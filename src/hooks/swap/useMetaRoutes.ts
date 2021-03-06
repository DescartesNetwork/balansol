import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDebounce } from 'react-use'

import { AppState } from 'model'
import { useMintRoutes } from './useMintRoutes'

type Market = {
  pool: string
  bidMint: string
  askMint: string
}
export type MetaRoute = Market[]

export const useMetaRoutes = () => {
  const { askMint, bidMint } = useSelector((state: AppState) => state.swap)
  const tokenRoutes = useMintRoutes()
  const [metaRoutes, setMetaRoutes] = useState<MetaRoute[]>([])

  const validRoute = (route: MetaRoute) => {
    const pools = route.map((e) => e.pool)
    for (const idx in pools) {
      // Check duplicate pool address
      if (pools[idx] === pools[Number(idx) + 1]) return false
    }
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

  const compareMetaRoutes = useCallback(() => {
    const metaRoutes = computeMetaRoutes(bidMint, askMint)
    setMetaRoutes(metaRoutes)
  }, [askMint, bidMint, computeMetaRoutes])

  useDebounce(async () => compareMetaRoutes(), 300, [compareMetaRoutes])

  return metaRoutes
}
