import { useSelector } from 'react-redux'

import { Button, Card, Col, Row, Space, Typography } from 'antd'

import { PoolAvatar } from 'app/components/pools/poolAvatar'
import { useAppRouter } from 'app/hooks/useAppRouter'
import { useTVL } from 'app/hooks/useTVL'
import { AppState } from 'app/model'
import PercentGroupMints from './percentGroupMints'
import WalletAddress from './walletAddress'
import { numeric } from 'shared/util'

const DetailsCard = ({ poolAddress }: { poolAddress: string }) => {
  const { pushHistory } = useAppRouter()
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const poolState: any = poolData.state
  const TVL = useTVL(poolAddress)

  return (
    <Card
      className={`${poolState['initialized'] ? '' : 'disableDiv'}`}
      style={{ boxShadow: 'unset' }}
    >
      <Row style={{ marginBottom: '16px' }}>
        <Col flex="auto">
          <PoolAvatar size={32} poolAddress={poolAddress} />
        </Col>
        <Col>
          <WalletAddress poolAddress={poolAddress} />
        </Col>
      </Row>
      <Row gutter={[0, 10]}>
        <Col span={24}>
          <PercentGroupMints poolAddress={poolAddress} />
        </Col>
        <Col span={24}>
          <Row align="bottom">
            <Col flex="auto">
              <Row>
                <Col span={24}>
                  <Space>
                    <Typography.Text type="secondary">TVL:</Typography.Text>
                    <Typography.Title level={5}>
                      {' '}
                      {numeric(TVL).formatCurrency('($0.00a)')}
                    </Typography.Title>
                  </Space>
                </Col>
                <Col span={24}>
                  <Space>
                    <Typography.Text type="secondary">APY:</Typography.Text>
                    <Typography.Title level={5}> 0%</Typography.Title>
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={() => pushHistory(`/details?pool=${poolAddress}`)}
              >
                Overview
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default DetailsCard
