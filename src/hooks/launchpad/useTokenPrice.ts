import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { tokenProvider } from '@sentre/senhub'

import { AppState } from 'model'
import { useLaunchpadData } from './useLaunchpadData'
import { useLaunchpadWeights } from './useLaunchpadWeights'

export const useTokenPrice = (launchpadAddress: string) => {
  const [mintPrice, setMintPrice] = useState(0)
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const pools = useSelector((state: AppState) => state.pools)
  const currentWeights = useLaunchpadWeights(launchpadAddress, 5000)

  const getMintPrice = useCallback(async () => {
    const { stableMint, pool } = launchpadData
    const { reserves } = pools[pool.toBase58()]
    const weightA = currentWeights[0]
    const weightB = currentWeights[1]
    const stablePrice = (await tokenProvider.getPrice(stableMint)) || 0

    if (!weightB || reserves[0].isZero()) return setMintPrice(0)

    const price =
      (weightA * reserves[1].toNumber() * stablePrice) /
      (reserves[0].toNumber() * weightB)

    return setMintPrice(price)
  }, [currentWeights, launchpadData, pools])

  useEffect(() => {
    getMintPrice()
  }, [getMintPrice])

  return mintPrice
}
