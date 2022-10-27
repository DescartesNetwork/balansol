import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { tokenProvider } from '@sentre/senhub'

import { AppState } from 'model'
import { useLaunchpadData } from './useLaunchpadData'

export const useTokenPrice = (launchpadAddress: string) => {
  const [mintPrice, setMintPrice] = useState(0)
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const pools = useSelector((state: AppState) => state.pools)

  console.log(launchpadData)

  const getMintPrice = useCallback(async () => {
    const { endWeights, stableMint, pool } = launchpadData
    const { reserves } = pools[pool.toBase58()]
    const weightA = endWeights[0].toNumber()
    const weightB = endWeights[1].toNumber()
    const stablePrice = (await tokenProvider.getPrice(stableMint)) || 0

    if (!weightB || !reserves[0].toNumber()) setMintPrice(0)

    const price =
      (weightA * reserves[1].toNumber() * stablePrice) /
      (reserves[0].toNumber() * weightB)

    return setMintPrice(price)
  }, [launchpadData, pools])

  useEffect(() => {
    getMintPrice()
  }, [getMintPrice])

  return mintPrice
}
