import { Button, Card, Col, Row, Space, Typography } from 'antd'
import MintPool from 'app/components/mintPool'
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
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Space>
            {[1, 2, 3, 4].map((idx) => (
              <MintPool address="" />
            ))}
          </Space>
        </Col>
        <Col span={24}>
          <Row align="bottom">
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
                onClick={() => console.log('Go to overview')}
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
