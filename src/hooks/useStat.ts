import { useCallback, useEffect, useState } from 'react'
import { DataLoader } from '@sentre/senhub'

import { TotalSummary } from 'stat/constants/summary'
import PoolService from 'stat/logic/pool/pool'
import { useTVL } from './useTVL'

const TTL_5_MIN = 300000

export const useStat = (poolAddress: string) => {
  const [apy, setApy] = useState(0)
  const [dailyInfo, setDailyInfo] = useState<Record<string, TotalSummary>>({})
  const [loading, setLoading] = useState(false)
  const { TVL } = useTVL(poolAddress)

  const fetchVolume = useCallback(async () => {
    try {
      setLoading(true)
      if (!poolAddress || !TVL) {
        setLoading(false)
        setApy(0)
        return setDailyInfo({})
      }
      const poolStatService = new PoolService(poolAddress)
      const dailyInfo = await DataLoader.load(
        'getDailyInfo' + poolAddress,
        () => poolStatService.getDailyInfo(),
        { cache: { ttl: TTL_5_MIN } },
      )
      // Calc Roi -> APY
      let totalFee = 0
      let dateCount = 0
      for (const date in dailyInfo) {
        totalFee += dailyInfo[date].fee
        if (
          dailyInfo[date].fee &&
          dailyInfo[date].volume &&
          dailyInfo[date].tvl
        )
          dateCount++
      }
      const feePerDay = totalFee / dateCount
      const roi = feePerDay / TVL
      const apy = Math.pow(1 + roi, 365) - 1
      setApy(Number.isFinite(apy) ? apy : 0)
      setDailyInfo(dailyInfo)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [poolAddress, TVL])

  useEffect(() => {
    fetchVolume()
  }, [fetchVolume])

  return { apy, dailyInfo, loading }
}
