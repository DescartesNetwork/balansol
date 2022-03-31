import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMint } from '@senhub/providers'

import { fetchCGK } from 'shared/util'
import { AppState } from 'app/model'
import { useMintPrice } from './useMintPrice'
import { useOracles } from './useOracles'

export const useTVL = (poolAddress: string) => {
  const {
    pools: { [poolAddress || '']: poolData },
  } = useSelector((state: AppState) => state)

  const [TVL, setTVL] = useState(0)
  const { getTokenPrice } = useMintPrice()
  const { undecimalizeMintAmount } = useOracles()

  const getTVL = useCallback(async () => {
    if (!poolData) return
    let totalValueLocked = 0
    for (let i = 0; i < poolData.reserves.length; i++) {
      const tokenPrice = await getTokenPrice(poolData.mints[i].toBase58())
      const numReserver = await undecimalizeMintAmount(
        poolData.reserves[i],
        poolData.mints[i],
      )
      totalValueLocked += tokenPrice * Number(numReserver)
    }

    setTVL(Number(totalValueLocked.toFixed(2)))
  }, [getTokenPrice, poolData, undecimalizeMintAmount])

  useEffect(() => {
    getTVL()
  }, [getTVL])

  return TVL
}
