import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDebounce } from 'react-use'
import { tokenProvider } from '@sentre/senhub'
import { utilsBN } from '@sen-use/web3'

import { AppState } from 'model'
import { useLaunchpadData } from './useLaunchpadData'
import { useLaunchpadWeights } from './useLaunchpadWeights'
import { useGetPriceInPool } from './useGetTokenInPoolPrice'
import { useGetBalanceAtTime } from './useGetBalanceAtTime'
import { useGetLaunchpadWeight } from './useGetLaunchpadWeight'

export const useTokenPrice = (launchpadAddress: string) => {
  const [mintPrice, setMintPrice] = useState(0)
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const pools = useSelector((state: AppState) => state.pools)
  const weights = useLaunchpadWeights(launchpadAddress, 5000)
  const getTokenPrice = useGetPriceInPool()
  const getBalanceAtTime = useGetBalanceAtTime()
  const getLaunchpadWeights = useGetLaunchpadWeight()

  const getMintPrice = useCallback(async () => {
    const { pool, endTime } = launchpadData
    const { reserves } = pools[pool.toBase58()]
    const stbPrice =
      (await tokenProvider.getPrice(launchpadData.stableMint)) || 0
    let balances = reserves
    let currentWeights = weights
    if (balances[0].isZero() || balances[1].isZero()) {
      currentWeights = getLaunchpadWeights(
        endTime.toNumber() * 1000,
        launchpadAddress,
      )
      balances = getBalanceAtTime(launchpadAddress, endTime.toNumber() * 1000)
    }

    const price = getTokenPrice(
      utilsBN.decimalize(currentWeights[0], 9),
      balances[0],
      stbPrice,
      balances[1],
      utilsBN.decimalize(currentWeights[1], 9),
    )

    return setMintPrice(price)
  }, [
    launchpadData,
    pools,
    weights,
    getTokenPrice,
    getLaunchpadWeights,
    launchpadAddress,
    getBalanceAtTime,
  ])

  useDebounce(getMintPrice, 500, [getMintPrice])

  useEffect(() => {
    getMintPrice()
  }, [getMintPrice])

  return mintPrice
}
