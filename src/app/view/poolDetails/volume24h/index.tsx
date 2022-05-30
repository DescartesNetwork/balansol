import BarChart from './barChart'
import { Card, Col, Row, Spin, Typography } from 'antd'

import { useVolume24h } from 'app/hooks/useVolume24h'
import { numeric } from 'shared/util'

export type VolumeData = { data: number; label: string }

const Volume24h = ({ poolAddress }: { poolAddress: string }) => {
  const { vol24h, loading, chartData } = useVolume24h(poolAddress)

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
