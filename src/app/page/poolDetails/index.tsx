import { Fragment, useEffect, useState } from 'react'

import { Card, Col, Image, Row, Space, Typography } from 'antd'
import Deposit from './deposit'
import Withdraw from './withdraw'

import { useAppRouter } from 'app/hooks/useAppRoute'
import { PoolAvatar } from 'app/components/pools/poolAvatar'
import CardPoolDetail from './cardPoolDetail'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'
import { useMintPrice } from 'app/hooks/useMintPrice'
import { useOracles } from 'app/hooks/useOracles'
import { BN } from '@project-serum/anchor'
import { useMint } from '@senhub/providers'
import DoughnutChart from './charts/doughnutChart'
import BarChart from './charts/barChart'

const PoolDetails = () => {
  const { getQuery } = useAppRouter()
  const poolAddress = getQuery('pool')
  const {
    pools: { [poolAddress || '']: poolData },
  } = useSelector((state: AppState) => state)
  const [TVL, setTVL] = useState(0)
  const [LP, setLP] = useState('')
  const { getTokenPrice } = useMintPrice()
  const { undecimalizeMintAmount } = useOracles()
  const { getMint } = useMint()

  useEffect(() => {
    ;(async () => {
      if (!!poolData) {
        let totalValueLocked = 0

        for (let i = 0; i < poolData.reserves.length; i++) {
          const tokenPrice = await getTokenPrice(poolData.mints[i].toBase58())
          const numReserver = await undecimalizeMintAmount(
            poolData.reserves[i],
            poolData.mints[i],
          )
          totalValueLocked += tokenPrice * Number(numReserver)
        }

        const {
          [poolData.mintLpt.toBase58()]: { supply },
        } = await getMint({
          address: poolData.mintLpt.toBase58(),
        })
        const numSupply = await undecimalizeMintAmount(
          new BN(supply.toString()),
          poolData.mintLpt,
        )

        setLP(numSupply)
        setTVL(Number(totalValueLocked.toFixed(2)))
      }
    })()
  }, [getMint, getTokenPrice, poolData, undecimalizeMintAmount])

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
                    <Withdraw poolAddress={poolAddress} />
                  </Col>
                  <Col span={12}>
                    <Deposit poolAddress={poolAddress} />
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
                    <Typography.Title level={3}>$ {TVL}</Typography.Title>
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
                      <Typography.Title level={3}>{LP}</Typography.Title>
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
                      <BarChart />
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
                      <DoughnutChart />
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
