import { useMemo } from 'react'
import { useActivePools } from '../pools/useActivePools'

type MintAddress = string
type PoolAddress = string
export type MintRoutes = Record<MintAddress, Record<MintAddress, PoolAddress[]>>

// Generate MintRoute, includes all pools that can swap bidMint -> askMint
export const useMintRoutes = (): MintRoutes => {
  const pools = useActivePools()

  const addPoolToRoute = (
    routes: MintRoutes,
    bidMint: string,
    askMint: string,
    pool: string,
  ) => {
    if (bidMint === askMint) return routes
    // Init route if needed
    if (!routes[bidMint]) routes[bidMint] = {}
    if (!routes[bidMint][askMint]) routes[bidMint][askMint] = []
    // Add pool in to route
    routes[bidMint][askMint].push(pool)
    return routes
  }

  return useMemo(() => {
    let mintRoutes: MintRoutes = {}
    for (const poolAddress in pools) {
      const mints = pools[poolAddress].mints.map((e) => e.toBase58())
      for (const bidMint of mints) {
        for (const askMint of mints) {
          mintRoutes = addPoolToRoute(mintRoutes, bidMint, askMint, poolAddress)
        }
      }
    }
    return mintRoutes
  }, [pools])
}
