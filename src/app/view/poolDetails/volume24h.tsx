import React, { useCallback, useState } from 'react'
import moment from 'moment'

import BarChart from './charts/barChart'

import { DataLoader } from 'shared/dataloader'
import PoolService from 'app/stat/logic/pool/pool'

const TTL_5_MIN = 300000
export type VolumeData = { data: number; label: string }

const Volume24h = ({ poolAddress }: { poolAddress: string }) => {
  const [volumes24h, setVolume24h] = useState<VolumeData[]>([])
  const [loading, setLoading] = useState(false)

  const fetchChart = useCallback(async () => {
    if (!poolAddress) return
    try {
      setLoading(true)
      const poolService = new PoolService(poolAddress)
      const poolStat = await DataLoader.load(
        'getDailyInfo' + poolAddress,
        poolService.getDailyInfo,
        { cache: { ttl: TTL_5_MIN } },
      )
      const volume24Data = Object.keys(poolStat).map((time) => {
        return {
          data: poolStat[time].volume,
          label: moment(time, 'YYYYMMDD').format('MM/DD'),
        }
      })
      setVolume24h(volume24Data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [poolAddress])

  console.log(volumes24h, 'volumes24h')

  return <BarChart data={volumes24h} />
}

export default Volume24h
