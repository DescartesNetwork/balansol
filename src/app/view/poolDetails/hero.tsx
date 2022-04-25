import { Fragment } from 'react'
import { useSelector } from 'react-redux'

import { Col, Row, Typography } from 'antd'

import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import { numeric } from 'shared/util'
import CardPoolDetail from './components/cardPoolDetail'
import { useTVL } from 'app/hooks/useTVL'
import { AppState } from 'app/model'
import { useStat } from 'app/hooks/useStat'

import tvlBg from 'app/static/images/tvl.svg'
import apyBg from 'app/static/images/apy.svg'
import myContributeBg from 'app/static/images/my-contribution.svg'

const Hero = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)

  const TVL = useTVL(poolAddress)

  const { balance } = useAccountBalanceByMintAddress(
    poolData?.mintLpt.toBase58(),
  )

  const { apy } = useStat(poolAddress)

  return (
    <Row gutter={[24, 24]}>
      <Col lg={8} md={8} xs={24}>
        <CardPoolDetail
          title="TVL"
          content={
            <Typography.Title level={3}>
              $ {numeric(TVL).format('0,0.[00]a')}
            </Typography.Title>
          }
          bg={tvlBg}
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
          bg={apyBg}
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
          bg={myContributeBg}
        />
      </Col>
    </Row>
  )
}

export default Hero
