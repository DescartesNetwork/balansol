import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useMintPrice } from './useMintPrice'
import { useOracles } from './useOracles'

import { AppState } from 'model'
import { PoolData } from '@senswap/balancer'

export const useTVL = (poolAddress = '') => {
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const [TVL, setTVL] = useState(0)
  const { getTokenPrice } = useMintPrice()
  const { undecimalizeMintAmount } = useOracles()

  const getTVL = useCallback(
    async (poolData: PoolData) => {
      if (!poolData) return 0
      let totalValueLocked = 0
      for (let i in poolData.reserves) {
        const tokenPrice = await getTokenPrice(poolData.mints[i].toBase58())
        const reserver = await undecimalizeMintAmount(
          poolData.reserves[i],
          poolData.mints[i],
        )
        totalValueLocked += tokenPrice * Number(reserver)
      }
      return totalValueLocked
    },
    [getTokenPrice, undecimalizeMintAmount],
  )

  const updateTvl = useCallback(async () => {
    const tvl = await getTVL(poolData)
    return setTVL(tvl)
  }, [getTVL, poolData])

  useEffect(() => {
    updateTvl()
  }, [updateTvl])

  return { TVL, getTVL }
}
