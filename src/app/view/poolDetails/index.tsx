import { useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'

import { Button, Col, Row } from 'antd'

import IonIcon from 'shared/antd/ionicon'
import PoolManagement from './management'
import PoolBalance from './poolBalance'
import Volume24h from './volume24h'
import Hero from './hero'
import Header from './header'

import { useAppRouter } from 'app/hooks/useAppRouter'
import { AppState } from 'app/model'
import { useEffect } from 'react'

const PoolDetails = () => {
  const { getQuery, pushHistory } = useAppRouter()
  const poolAddress = getQuery('pool') || ''
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  useEffect(() => {
    if (!poolData) pushHistory(`/?tab=pools`)
  })

  const isOwner = walletAddress === poolData?.authority.toBase58()
  if (!poolAddress) return null

  return (
    <Row justify="center">
      <Col lg={20} md={24} style={{ maxWidth: 930 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Button
              type="text"
              icon={<IonIcon name="arrow-back-outline" />}
              onClick={() => pushHistory(`/?tab=pools`)}
              style={{ margin: -12 }}
            >
              Back
            </Button>
          </Col>
          <Col span={24}>
            <Header poolAddress={poolAddress} />
          </Col>
          <Col span={24}>
            <Hero poolAddress={poolAddress} />
          </Col>
          {/* Chart */}
          <Col span={24}>
            <Row gutter={[24, 24]} style={{ display: 'flex' }}>
              <Col lg={12} md={12} xs={24}>
                <Volume24h poolAddress={poolAddress} />
              </Col>
              <Col lg={12} md={12} xs={24}>
                <PoolBalance poolAddress={poolAddress} />
              </Col>
              {isOwner && (
                <Col lg={12} md={12} xs={24}>
                  <PoolManagement poolAddress={poolAddress} />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default PoolDetails
