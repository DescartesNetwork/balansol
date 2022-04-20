import PoolService from 'app/stat/logic/pool/pool'
import moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react'

import BarChart from './charts/barChart'
import { DataLoader } from 'shared/dataloader'
import { Col, Row, Spin, Typography } from 'antd'
import { numeric } from 'shared/util'

export type VolumeData = { data: number; label: string }
const TTL_5_MIN = 300000

const Volume24h = ({ poolAddress }: { poolAddress: string }) => {
  const [chartData, setChartData] = useState<VolumeData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchVolume = useCallback(async () => {
    if (!poolAddress) return setChartData([])
    setIsLoading(true)
    const poolStatService = new PoolService(poolAddress)
    const dailyInfo = await DataLoader.load(
      'getDailyInfo' + poolAddress,
      () => poolStatService.getDailyInfo(),
      { cache: { ttl: TTL_5_MIN } },
    )

    const chartData = Object.keys(dailyInfo).map((time) => {
      return {
        data: dailyInfo[time].volume,
        label: moment(time, 'YYYYMMDD').format('MM/DD'),
      }
    })

    setIsLoading(false)
    return setChartData(chartData)
  }, [poolAddress])
  useEffect(() => {
    fetchVolume()
  }, [fetchVolume])

  const vol24h = useMemo(() => {
    const today = chartData[chartData.length - 1]?.data || 0
    const yesterday = chartData[chartData.length - 2]?.data || 0
    const house = new Date().getHours()
    return today + (house * yesterday) / 24
  }, [chartData])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row justify="center" align="middle" className="chart-title">
          <Col flex={'auto'}>
            <Typography.Title level={4}>Volume 24h</Typography.Title>
          </Col>
          <Col>
            <Typography.Title level={2}>
              ${numeric(vol24h).format('0,0.[0]a')}
            </Typography.Title>
          </Col>
        </Row>
      </Col>
      <Col span={24} flex="auto">
        <Spin tip="Loading..." spinning={isLoading}>
          <BarChart data={chartData} />
        </Spin>
      </Col>
    </Row>
  )
}

export default Volume24h
