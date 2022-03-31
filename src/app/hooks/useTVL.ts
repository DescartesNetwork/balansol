import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useMintPrice } from './useMintPrice'
import { useOracles } from './useOracles'

import { AppState } from 'app/model'

export const useTVL = (poolAddress: string) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)

  const [TVL, setTVL] = useState(0)
  const { getTokenPrice } = useMintPrice()
  const { undecimalizeMintAmount } = useOracles()

  const getTVL = useCallback(async () => {
    if (!poolData) return setTVL(0)
    let totalValueLocked = 0
    for (let i in poolData.reserves) {
      const tokenPrice = await getTokenPrice(poolData.mints[i].toBase58())
      const reserver = await undecimalizeMintAmount(
        poolData.reserves[i],
        poolData.mints[i],
      )
      totalValueLocked += tokenPrice * Number(reserver)
    }

    setTVL(totalValueLocked)
  }, [getTokenPrice, poolData, undecimalizeMintAmount])

  useEffect(() => {
    getTVL()
  }, [getTVL])

  return TVL
}
