import { Button, Card, Col, Row, Typography } from 'antd'
import React from 'react'
import { MintAvatar } from 'shared/antd/mint'
import WalletAddress from './walletAddress'

export default function DetailsCard() {
  return (
    <Card style={{ boxShadow: 'unset', background: '#212C4C' }}>
      <Row>
        <Col flex="auto">
          <MintAvatar
            mintAddress={'6Nr4FTUjiGECAuazTHpYVpeH5WpNLjvCbTo7S8dnbS1G'}
            size={24}
          />
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
          <Button type="primary" onClick={() => console.log('Go to overview')}>
            Overview
          </Button>
        </Col>
      </Row>
    </Card>
  )
}
