import { createContext, useContext, ReactNode, useMemo } from 'react'

import { PoolsState } from 'model/pools.controller'
import { useActivePools } from './pools/useActivePools'

export type BalansolPoolsProvider = {
  activePools: PoolsState
}
const Context = createContext<BalansolPoolsProvider>({
  activePools: {},
})

/**
 * Pool Context Provider
 */
const Provider = ({ children }: { children: ReactNode }) => {
  const activePools = useActivePools()
  const provider = useMemo((): BalansolPoolsProvider => {
    return { activePools }
  }, [activePools])
  // Context provider
  return <Context.Provider value={provider}>{children}</Context.Provider>
}
export default Provider

/**
 * Pool Hook
 */
export const useBalansolPools = () => {
  return useContext<BalansolPoolsProvider>(Context)
}
