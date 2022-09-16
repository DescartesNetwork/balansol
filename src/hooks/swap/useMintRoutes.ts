import { useCallback, useMemo } from 'react'

import { useBalansolPools } from '../useBalansolPools'

type MintAddress = string
type PoolAddress = string
export type MintRoutes = Record<MintAddress, Record<MintAddress, PoolAddress[]>>

// Generate MintRoute, includes all pools that can swap bidMint -> askMint
export const useMintRoutes = (): MintRoutes => {
  const { activePools } = useBalansolPools()

  const addPoolToRoute = useCallback(
    (routes: MintRoutes, bidMint: string, askMint: string, pool: string) => {
      let poolData = activePools[pool]
      let mints = poolData.mints.map((m) => m.toBase58())
      let bidMintIdx = mints.indexOf(bidMint)
      let askMintIdx = mints.indexOf(askMint)

      let actions = poolData.actions as { active: {} }[]
      if (!actions[bidMintIdx]['active'] || !actions[askMintIdx]['active'])
        return routes

      if (bidMint === askMint) return routes
      // Init route if needed
      if (!routes[bidMint]) routes[bidMint] = {}
      if (!routes[bidMint][askMint]) routes[bidMint][askMint] = []
      // Add pool in to route
      routes[bidMint][askMint].push(pool)
      return routes
    },
    [activePools],
  )

  return useMemo(() => {
    let mintRoutes: MintRoutes = {}
    for (const poolAddress in activePools) {
      const mints = activePools[poolAddress].mints.map((e) => e.toBase58())
      for (const bidMint of mints) {
        for (const askMint of mints) {
          mintRoutes = addPoolToRoute(mintRoutes, bidMint, askMint, poolAddress)
        }
      }
    }
    return mintRoutes
  }, [activePools, addPoolToRoute])
}
