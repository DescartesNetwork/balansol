import { useSelector } from 'react-redux'
import { useUI, useWallet } from '@senhub/providers'

import { Button, Col, Row } from 'antd'

import IonIcon from '@sentre/antd-ionicon'
import PoolManagement from './management'
import PoolBalance from './poolBalance'
import Volume24h from './volume24h'
import Hero from './hero'
import Header from './header'
import PoolNotFound from './poolNotFound'

import { useAppRouter } from 'app/hooks/useAppRouter'
import { AppState } from 'app/model'

const PoolDetails = () => {
  const { getQuery, pushHistory } = useAppRouter()
  const poolAddress = getQuery('pool') || ''
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const {
    ui: { width },
  } = useUI()

  if (!poolData || !poolAddress) return <PoolNotFound />

  const isOwner = walletAddress === poolData.authority.toBase58()

  const isMobile = width < 768
  return (
    <Row justify="center">
      <Col lg={20} md={24} style={{ maxWidth: !isMobile ? 930 : '' }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Button
              type="text"
              icon={<IonIcon name="arrow-back-outline" />}
              onClick={() => pushHistory(`/pools`)}
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
