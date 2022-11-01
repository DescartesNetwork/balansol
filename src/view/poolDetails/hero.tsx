import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { util } from '@sentre/senhub'

import { Col, Row, Skeleton, Typography } from 'antd'

import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import CardPoolDetail from './components/cardPoolDetail'
import { useTVL } from 'hooks/useTVL'
import { useStat } from 'hooks/useStat'
import { AppState } from 'model'

import tvlBg from 'static/images/tvl.svg'
import apyBg from 'static/images/apy.svg'
import myContributeBg from 'static/images/my-contribution.svg'

const Hero = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)

  const { TVL } = useTVL(poolAddress)

  const { balance } = useAccountBalanceByMintAddress(
    poolData.mintLpt.toBase58(),
  )

  const { apy, loading } = useStat(poolAddress)

  return (
    <Row gutter={[24, 24]}>
      <Col lg={8} md={8} xs={24}>
        <CardPoolDetail
          title="TVL"
          content={
            <Typography.Title level={3}>
              $ {util.numeric(TVL).format('0,0.[00]a')}
            </Typography.Title>
          }
          bg={tvlBg}
        />
      </Col>
      <Col lg={8} md={8} xs={24}>
        <CardPoolDetail
          title="APY"
          content={
            loading ? (
              <Skeleton
                style={{ width: 150 }}
                active
                paragraph={{ rows: 1 }}
                title={false}
              />
            ) : (
              <Typography.Title level={3}>
                {util.numeric(apy).format('0,0.[00]a%')}
              </Typography.Title>
            )
          }
          bg={apyBg}
        />
      </Col>
      <Col lg={8} md={8} xs={24}>
        <CardPoolDetail
          title="My Contribution"
          content={
            <Fragment>
              <Typography.Title level={3}>
                {util.numeric(balance).format('0,0.[00]')}
              </Typography.Title>
              <Typography.Text type="secondary"> LP</Typography.Text>
            </Fragment>
          }
          bg={myContributeBg}
        />
      </Col>
    </Row>
  )
}

export default Hero
