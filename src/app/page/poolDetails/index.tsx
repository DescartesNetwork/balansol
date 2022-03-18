import { Fragment } from 'react'

import { Card, Col, Image, Row, Space, Typography } from 'antd'
import Deposit from './deposit'
import Withdraw from './withdraw'

import { useAppRouter } from 'app/hooks/useAppRoute'
import { PoolAvatar } from 'app/components/pools/poolAvatar'
import CardPoolDetail from './cardPoolDetail'
import BarChart from 'app/static/images/bar-chart.png'
import DoughnutChart from 'app/static/images/doughnut-chart.png'

const PoolDetails = () => {
  const { getQuery } = useAppRouter()
  const poolAddress = getQuery('pool')

  if (!poolAddress) return null
  return (
    <Row justify="center">
      <Col lg={20} md={24}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Row gutter={[24, 24]} justify="center">
              <Col lg={18} md={18} xs={24}>
                <Space align="start">
                  <PoolAvatar poolAddress={poolAddress} />
                  <Typography.Title level={4}>Balansol LP</Typography.Title>
                </Space>
              </Col>
              <Col lg={6} md={6} xs={24}>
                <Row gutter={[12, 12]} justify="end">
                  <Col span={12}>
                    <Deposit poolAddress={poolAddress} />
                  </Col>
                  <Col span={12}>
                    <Withdraw poolAddress={poolAddress} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row gutter={[24, 24]}>
              <Col lg={8} md={8} xs={24}>
                <CardPoolDetail
                  title="TVL"
                  content={
                    <Typography.Title level={3}>$245.98m</Typography.Title>
                  }
                />
              </Col>
              <Col lg={8} md={8} xs={24}>
                <CardPoolDetail
                  title="APY"
                  content={<Typography.Title level={3}>9%</Typography.Title>}
                />
              </Col>
              <Col lg={8} md={8} xs={24}>
                <CardPoolDetail
                  title="My Contribution"
                  content={
                    <Fragment>
                      <Typography.Title level={3}>62.7052</Typography.Title>
                      <Typography.Text type="secondary"> LP</Typography.Text>
                    </Fragment>
                  }
                />
              </Col>
            </Row>
          </Col>
          {/* Chart */}
          <Col span={24}>
            <Row gutter={[24, 24]} style={{ display: 'flex' }}>
              <Col lg={12} md={12} xs={24}>
                {/* Bar Chart */}
                <Card className="chart-card">
                  <Row gutter={[24, 24]}>
                    <Col span={24}>
                      <Row
                        justify="center"
                        align="middle"
                        className="chart-title"
                      >
                        <Col flex={'auto'}>
                          <Typography.Text>24h Volume</Typography.Text>
                        </Col>
                        <Col>
                          <Typography.Title level={3}>$3m</Typography.Title>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row justify="center">
                        <Image width="50%" src={BarChart} />
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col lg={12} md={12} xs={24}>
                {/* Doughnut Chart */}
                <Card className="chart-card">
                  <Row gutter={[24, 24]}>
                    <Col span={24}>
                      <Row
                        justify="center"
                        align="middle"
                        className="chart-title"
                      >
                        <Col flex={'auto'}>
                          <Typography.Text>Pool balance</Typography.Text>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row justify="center">
                        <Image width="50%" src={DoughnutChart} />
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default PoolDetails
