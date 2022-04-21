import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { useUI, useWallet } from '@senhub/providers'

import { Button, Col, Row, Space, Typography } from 'antd'
import Deposit from './deposit'
import Withdraw from './withdraw'
import { PoolAvatar } from 'app/components/pools/poolAvatar'
import CardPoolDetail from './cardPoolDetail'
import IonIcon from 'shared/antd/ionicon'
import PoolManagement from './management'
import PoolBalance from './poolBalance'
import Volume24h from './volume24h'

import { useAppRouter } from 'app/hooks/useAppRouter'
import { AppState } from 'app/model'
import { useTVL } from 'app/hooks/useTVL'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import { numeric } from 'shared/util'

import tvlBg from 'app/static/images/tvl.svg'
import apyBg from 'app/static/images/apy.svg'
import myContributeBg from 'app/static/images/my-contribution.svg'
import { useStat } from 'app/hooks/useStat'

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
  const { apy } = useStat(poolAddress)
  const isMobile = width < 768

  const TVL = useTVL(poolAddress)
  const { balance } = useAccountBalanceByMintAddress(
    poolData.mintLpt.toBase58(),
  )

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
            <Row gutter={[24, 24]} justify="space-between">
              <Col md={18} xs={24}>
                <Space>
                  <PoolAvatar poolAddress={poolAddress} size={32} />
                  <Typography.Title level={4}>Balansol LP</Typography.Title>
                </Space>
              </Col>
              <Col span={isMobile ? 24 : undefined}>
                <Space style={{ width: '100%' }}>
                  <Withdraw poolAddress={poolAddress} />
                  <Deposit poolAddress={poolAddress} />
                </Space>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row gutter={[24, 24]}>
              <Col lg={8} md={8} xs={24}>
                <CardPoolDetail
                  title="TVL"
                  content={
                    <Typography.Title level={3}>
                      $ {numeric(TVL).format('0,0.[00]a')}
                    </Typography.Title>
                  }
                  styles={{
                    background: `url(${tvlBg})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                />
              </Col>
              <Col lg={8} md={8} xs={24}>
                <CardPoolDetail
                  title="APY"
                  content={
                    <Typography.Title level={3}>
                      {numeric(apy).format('0,0.[00]a%')}
                    </Typography.Title>
                  }
                  styles={{
                    background: `url(${apyBg})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                />
              </Col>
              <Col lg={8} md={8} xs={24}>
                <CardPoolDetail
                  title="My Contribution"
                  content={
                    <Fragment>
                      <Typography.Title level={3}>
                        {numeric(balance).format('0,0.[00]')}
                      </Typography.Title>
                      <Typography.Text type="secondary"> LP</Typography.Text>
                    </Fragment>
                  }
                  styles={{
                    background: `url(${myContributeBg})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                />
              </Col>
            </Row>
          </Col>
          {/* Chart */}
          <Col span={24}>
            <Row gutter={[24, 24]} style={{ display: 'flex' }}>
              <Col lg={12} md={12} xs={24}>
                {/* Bar Chart */}
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
