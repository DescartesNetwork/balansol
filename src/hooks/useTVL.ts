import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PoolData } from '@senswap/balancer'

import { useOracles } from './useOracles'

import { AppState } from 'model'
import { useGetMintPrice } from './useGetPrice'

export const useTVL = (poolAddress = '') => {
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const [TVL, setTVL] = useState(0)
  const getPrice = useGetMintPrice()
  const { undecimalizeMintAmount } = useOracles()

  const getTVL = useCallback(
    async (poolData: PoolData) => {
      if (!poolData) return 0
      let totalValueLocked = 0
      for (let i in poolData.reserves) {
        const tokenPrice = await getPrice(poolData.mints[i])
        if (!tokenPrice) continue
        const reserver = await undecimalizeMintAmount(
          poolData.reserves[i],
          poolData.mints[i],
        )
        totalValueLocked += tokenPrice * Number(reserver)
      }
      return totalValueLocked
    },
    [getPrice, undecimalizeMintAmount],
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
