import { useCallback, useEffect, useMemo, useState } from 'react'
import moment from 'moment'

import BarChart from './charts/barChart'
import { Card, Col, Row, Spin, Typography } from 'antd'

import { numeric } from 'shared/util'
import { useStat } from 'app/hooks/useStat'

export type VolumeData = { data: number; label: string }

const Volume24h = ({ poolAddress }: { poolAddress: string }) => {
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

  return (
    <Card className="chart-card">
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
          <Spin tip="Loading..." spinning={loading}>
            <BarChart data={chartData} />
          </Spin>
        </Col>
      </Row>
    </Card>
  )
}

export default Volume24h
