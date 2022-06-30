import { useCallback, useEffect, useMemo, useState } from 'react'
import moment from 'moment'

import { VolumeData } from 'view/poolDetails/volume24h'
import { useStat } from './useStat'

export const useVolume24h = (poolAddress: string) => {
  const [chartData, setChartData] = useState<VolumeData[]>([])
  const { dailyInfo, loading } = useStat(poolAddress)

  const fetchVolume = useCallback(async () => {
    if (!poolAddress) return setChartData([])
    const chartData = Object.keys(dailyInfo).map((time) => {
      return {
        data: dailyInfo[time].volume,
        label: moment(time, 'YYYYMMDD').format('MM/DD'),
      }
    })
    return setChartData(chartData)
  }, [dailyInfo, poolAddress])
  useEffect(() => {
    fetchVolume()
  }, [fetchVolume])

  const vol24h = useMemo(() => {
    const today = chartData[chartData.length - 1]?.data || 0
    const yesterday = chartData[chartData.length - 2]?.data || 0
    const house = new Date().getHours()
    return today + (house * yesterday) / 24
  }, [chartData])

  return { chartData, loading, vol24h }
}
