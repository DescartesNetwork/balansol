import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { PoolState } from '@senswap/balancer'

import { PoolsState } from 'app/model/pools.controller'
import { AppState } from 'app/model'

export const useActivePools = () => {
  const { pools } = useSelector((state: AppState) => state)

  return useMemo(() => {
    const activePools: PoolsState = {}
    for (const addr in pools) {
      const poolData = pools[addr]
      const state = poolData.state as PoolState
      if (state['initialized']) {
        activePools[addr] = poolData
      }
    }
    return activePools
  }, [pools])
}
