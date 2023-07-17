import { useCallback, useEffect, useState } from 'react'

import { useTVL } from './useTVL'
import { useStatStore } from 'providers/stat.provider'

export const useStat = (poolAddress: string) => {
  const [apy, setApy] = useState(0)
  const { TVL } = useTVL(poolAddress)
  const {
    loading,
    data: { [poolAddress]: dailyInfo },
  } = useStatStore()

  const calculate = useCallback(async () => {
    if (!poolAddress || !TVL || !dailyInfo) return setApy(0)
    // Calc Roi -> APY
    let totalFee = 0
    let dateCount = 0
    for (const date in dailyInfo) {
      totalFee += dailyInfo[date].fee
      dateCount++
    }
    const feePerDay = totalFee / dateCount
    const roi = feePerDay / TVL
    const apy = Math.pow(1 + roi, 365) - 1
    setApy(Number.isFinite(apy) ? apy : 0)
  }, [TVL, dailyInfo, poolAddress])
  useEffect(() => {
    calculate()
  }, [calculate])

  return { apy, dailyInfo, loading }
}
