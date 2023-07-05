import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PoolState } from '@senswap/balancer'
import { web3 } from '@project-serum/anchor'

import { PoolsState } from 'model/pools.controller'
import { AppState } from 'model'
import { useTVL } from 'hooks/useTVL'

const MIN_TVL = 100

export const useActivePools = () => {
  const pools = useSelector((state: AppState) => state.pools)
  const [activePools, setActivePools] = useState<PoolsState>({})
  const { getTVL } = useTVL()

  const filterPools = useCallback(async () => {
    const activePools: PoolsState = {}
    for (const addr in pools) {
      const poolData = pools[addr]
      if (!web3.PublicKey.isOnCurve(poolData.authority)) continue
      const state = poolData.state as PoolState
      if (!state['initialized']) continue
      if (poolData.reserves.map((val) => val.toString()).includes('0')) continue
      const tvl = await getTVL(poolData)
      if (tvl < MIN_TVL) continue
      activePools[addr] = poolData
    }
    setActivePools(activePools)
  }, [getTVL, pools])

  useEffect(() => {
    filterPools()
  }, [filterPools])

  return activePools
}
