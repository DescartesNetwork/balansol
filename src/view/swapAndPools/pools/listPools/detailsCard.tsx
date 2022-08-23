import { useSelector } from 'react-redux'
import { useWalletAddress, util } from '@sentre/senhub'

import { Card, Col, Row, Space, Typography } from 'antd'
import PercentGroupMints from './percentGroupMints'
import PoolAddressActions from './poolAddressActions'
import { PoolAvatar } from 'components/pools/poolAvatar'

import { useAppRouter } from 'hooks/useAppRouter'
import { useTVL } from 'hooks/useTVL'
import { useVolume24h } from 'hooks/useVolume24h'
import { AppState } from 'model'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'

export type DetailsCardProps = { poolAddress: string }

const DetailsCard = ({ poolAddress }: DetailsCardProps) => {
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const walletAddress = useWalletAddress()
  const { vol24h } = useVolume24h(poolAddress)
  const { pushHistory } = useAppRouter()

  const poolState: any = poolData.state
  const { TVL } = useTVL(poolAddress)
  const { balance } = useAccountBalanceByMintAddress(
    poolData.mintLpt.toBase58(),
  )

  const validPool =
    poolState['initialized'] || poolData.authority.toBase58() === walletAddress

  return (
    <Card
      className={`${validPool ? 'pool-card-detail' : 'disabled-pool'}`}
      style={{ boxShadow: 'unset' }}
      onClick={() => pushHistory(`/details`, { pool: poolAddress })}
    >
      <Row style={{ marginBottom: '16px' }}>
        <Col flex="auto">
          <PoolAvatar size={32} poolAddress={poolAddress} />
        </Col>
        <Col>
          <PoolAddressActions poolAddress={poolAddress} />
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <PercentGroupMints poolAddress={poolAddress} />
        </Col>
        <Col span={24}>
          <Row align="bottom" wrap={false}>
            <Col flex="auto">
              <Row gutter={[32, 0]}>
                <Col>
                  <Space size={4} direction="vertical">
                    <Typography.Text type="secondary">TVL:</Typography.Text>
                    <Typography.Title level={5}>
                      {' '}
                      {util.numeric(TVL).formatCurrency('($0.00a)')}
                    </Typography.Title>
                  </Space>
                </Col>
                <Col>
                  <Space size={4} direction="vertical">
                    <Typography.Text type="secondary">Vol 24h:</Typography.Text>
                    <Typography.Title level={5}>
                      {' '}
                      {util.numeric(vol24h).formatCurrency('($0.00a)')}
                    </Typography.Title>
                  </Space>
                </Col>
                <Col flex="auto">
                  <Space size={4} direction="vertical">
                    <Typography.Text type="secondary">
                      My Contribution:
                    </Typography.Text>
                    <Typography.Title level={5}>
                      {' '}
                      {util.numeric(balance).format('0,0.[00]')} LP
                    </Typography.Title>
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default DetailsCard
