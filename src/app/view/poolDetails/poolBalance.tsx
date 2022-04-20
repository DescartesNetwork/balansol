import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import DoughnutChart, { PoolBalanceData } from './charts/doughnutChart'
import { GENERAL_DECIMALS } from 'app/constant'
import { useMint } from '@senhub/providers'
import { AppState } from 'app/model'
import util from '@senswap/sen-js/dist/utils'

const PoolBalance = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const { tokenProvider } = useMint()
  const [poolBalances, setPoolBalances] = useState<PoolBalanceData[]>([])

  const doughnutChartData = useCallback(async () => {
    const { mints, weights } = poolData
    const newData = await Promise.all(
      mints.map(async (value, idx) => {
        const tokenInfo = await tokenProvider.findByAddress(value.toBase58())
        const weight = util.undecimalize(
          BigInt(weights[idx].toString()),
          GENERAL_DECIMALS,
        )
        if (!tokenInfo) return { symbol: 'TOKN', weight, logo: '' }
        if (!tokenInfo.logoURI)
          return { symbol: tokenInfo.symbol, weight, logo: '' }
        return { symbol: tokenInfo.symbol, weight, logo: tokenInfo.logoURI }
      }),
    )
    setPoolBalances(newData)
  }, [poolData, tokenProvider])

  useEffect(() => {
    doughnutChartData()
  }, [doughnutChartData])

  return <DoughnutChart data={poolBalances} />
}

export default PoolBalance
