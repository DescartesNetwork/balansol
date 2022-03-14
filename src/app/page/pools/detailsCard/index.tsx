import { Button, Card, Col, Row, Typography } from 'antd'

import { PoolAvatar } from 'app/components/pools/poolAvatar'
import { useAppRouter } from 'app/hooks/useAppRoute'

import WalletAddress from './walletAddress'

export default function DetailsCard({ poolAddress }: { poolAddress: string }) {
  const { pushHistory } = useAppRouter()

  return (
    <Card style={{ boxShadow: 'unset', background: '#212C4C' }}>
      <Row>
        <Col flex="auto">
          <PoolAvatar poolAddress={poolAddress} />
        </Col>
        <Col>
          <WalletAddress />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {[1, 2, 3, 4].map((idx) => (
            <Typography.Text>30 Usdt </Typography.Text>
          ))}
        </Col>
      </Row>
      <Row>
        <Col flex="auto">
          <Row>
            <Col span={24}>
              <Typography.Text>TVL</Typography.Text>
              <Typography.Text> $299.11$</Typography.Text>
            </Col>
            <Col span={24}>
              <Typography.Text>APY</Typography.Text>
              <Typography.Text> 9%</Typography.Text>
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
    </Card>
  )
}
