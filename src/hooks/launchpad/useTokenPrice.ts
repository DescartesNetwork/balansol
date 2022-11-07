import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDebounce } from 'react-use'
import { useMintDecimals } from '@sentre/senhub'
import { utilsBN } from '@sen-use/web3'
import { BN } from '@project-serum/anchor'

import { AppState } from 'model'
import { useLaunchpadData } from './useLaunchpadData'
import { useLaunchpadWeights } from './useLaunchpadWeights'
import { calcOutGivenInSwap } from 'helper/oracles'

export const useTokenPrice = (launchpadAddress: string) => {
  const [mintPrice, setMintPrice] = useState(0)
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const pools = useSelector((state: AppState) => state.pools)
  const currentWeights = useLaunchpadWeights(launchpadAddress, 5000)
  const decimals =
    useMintDecimals({ mintAddress: launchpadData.mint.toBase58() }) || 0

  const getMintPrice = useCallback(async () => {
    const { pool } = launchpadData
    const { reserves } = pools[pool.toBase58()]
    const totalWeights = currentWeights[0] + currentWeights[1]

    const weightA = currentWeights[0] / totalWeights
    const weightB = currentWeights[1] / totalWeights

    const price = calcOutGivenInSwap(
      utilsBN.decimalize(1, decimals),
      reserves[0],
      reserves[1],
      weightA,
      weightB,
      new BN(0),
    )
    return setMintPrice(1 / Number(utilsBN.undecimalize(price, decimals)))
  }, [currentWeights, decimals, launchpadData, pools])

  useDebounce(getMintPrice, 500, [getMintPrice])

  useEffect(() => {
    getMintPrice()
  }, [getMintPrice])

  return mintPrice
}
