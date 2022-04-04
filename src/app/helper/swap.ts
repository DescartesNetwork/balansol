import { PoolsState } from 'app/model/pools.controller'

type MintAddress = string

export const getTokenRoute = (
  pools: PoolsState,
): Map<MintAddress, Map<MintAddress, string>> => {
  const tokenRoute = new Map()
  return tokenRoute
}
