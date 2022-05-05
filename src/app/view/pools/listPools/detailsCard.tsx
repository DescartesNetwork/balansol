import { useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'

import { Button, Card, Col, Row, Space, Typography } from 'antd'
import PercentGroupMints from './percentGroupMints'
import PoolAddressActions from './poolAddressActions'
import { PoolAvatar } from 'app/components/pools/poolAvatar'

import { useAppRouter } from 'app/hooks/useAppRouter'
import { useTVL } from 'app/hooks/useTVL'
import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'

export type DetailsCardProps = { poolAddress: string }

const DetailsCard = ({ poolAddress }: DetailsCardProps) => {
  const { pushHistory } = useAppRouter()
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const poolState: any = poolData.state
  const TVL = useTVL(poolAddress)
  const { balance } = useAccountBalanceByMintAddress(
    poolData.mintLpt.toBase58(),
  )

  const validPool =
    poolState['initialized'] || poolData.authority.toBase58() === walletAddress

  return (
    <Card
      className={`${validPool ? '' : 'disabled-pool'}`}
      style={{ boxShadow: 'unset' }}
    >
      <Row style={{ marginBottom: '16px' }}>
        <Col flex="auto">
          <PoolAvatar size={32} poolAddress={poolAddress} />
        </Col>
        <Col>
          <PoolAddressActions poolAddress={poolAddress} />
        </Col>
      </Row>
      <Row gutter={[0, 10]}>
        <Col span={24}>
          <PercentGroupMints poolAddress={poolAddress} />
        </Col>
        <Col span={24}>
          <Row align="bottom" wrap={false}>
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
                    <Typography.Text type="secondary">
                      My Contribution:
                    </Typography.Text>
                    <Typography.Title level={5}>
                      {' '}
                      {numeric(balance).format('0,0.[00]')} LP
                    </Typography.Title>
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
