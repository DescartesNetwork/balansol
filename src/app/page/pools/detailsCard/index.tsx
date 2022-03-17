import React from 'react'

import MintPool from 'app/components/mintPool'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { PoolAvatar } from 'app/components/pools/poolAvatar'
import { useAppRouter } from 'app/hooks/useAppRoute'

import WalletAddress from './walletAddress'

export default function DetailsCard({ poolAddress }: { poolAddress: string }) {
  const { pushHistory } = useAppRouter()

  return (
    <Card style={{ boxShadow: 'unset' }}>
      <Row style={{ marginBottom: '16px' }}>
        <Col flex="auto">
          <PoolAvatar poolAddress={poolAddress} />
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
