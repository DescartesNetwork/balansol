import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDebounce } from 'react-use'

import { useGetMintDecimals } from '@sentre/senhub'
import {
  calcOutGivenInSwap,
  calcPriceImpactSwap,
  getMintInfo,
} from 'helper/oracles'
import { AppState } from 'model'
import { useOracles } from '../../useOracles'
import { MetaRoute } from '../useMetaRoutes'
import { Route } from '../../useSwap'
import { useBalansolPools } from 'hooks/useBalansolPools'

export const useAllRouteFromBid = (metaRoutes: MetaRoute[]): Route[] => {
  const { bidAmount, isReverse } = useSelector((state: AppState) => state.swap)
  const { activePools } = useBalansolPools()
  const { decimalizeMintAmount } = useOracles()
  const [routes, setRoutes] = useState<Route[]>([])
  const getDecimals = useGetMintDecimals()

  const computeRouteInfos = useCallback(async () => {
    const routes = []
    if (isReverse || !Number(bidAmount)) return setRoutes([])
    for (const metaRoute of metaRoutes) {
      const bidMint = metaRoute[0].bidMint
      const route = []
      let bidAmountBN = await decimalizeMintAmount(bidAmount, bidMint)
      for (const market of metaRoute) {
        const { bidMint, askMint, pool } = market
        const poolData = activePools[pool]
        const bidMintInfo = getMintInfo(poolData, bidMint)
        const askMintInfo = getMintInfo(poolData, askMint)
        const decimalIn = (await getDecimals({ mintAddress: bidMint })) || 0
        const decimalOut = (await getDecimals({ mintAddress: askMint })) || 0

        const tokenOutAmount = calcOutGivenInSwap(
          bidAmountBN,
          askMintInfo.reserve,
          bidMintInfo.reserve,
          askMintInfo.normalizedWeight,
          bidMintInfo.normalizedWeight,
          poolData.fee.add(poolData.taxFee),
        )

        const dataForSlippage = {
          balanceIn: bidMintInfo.reserve,
          balanceOut: askMintInfo.reserve,
          weightIn: bidMintInfo.normalizedWeight,
          weightOut: askMintInfo.normalizedWeight,
          decimalIn: decimalIn,
          decimalOut: decimalOut,
          swapFee: poolData.fee.add(poolData.taxFee),
        }

        let priceImpact = calcPriceImpactSwap(bidAmountBN, dataForSlippage)
        if (priceImpact < 0) priceImpact = 0
        route.push({
          pool: market.pool,
          bidMint,
          askMint,
          bidAmount: bidAmountBN,
          askAmount: tokenOutAmount,
          priceImpact: priceImpact,
        })
        bidAmountBN = tokenOutAmount
      }
      routes.push(route)
    }
    return setRoutes(routes)
  }, [
    bidAmount,
    decimalizeMintAmount,
    getDecimals,
    isReverse,
    metaRoutes,
    activePools,
  ])

  useDebounce(async () => computeRouteInfos(), 300, [computeRouteInfos])

  return routes
}
