import { MintSelection } from '@sen-use/app'
import { useTheme, util } from '@sentre/senhub'

import { Button, Card, Col, Row, Space, Typography } from 'antd'
import MintInput from 'components/mintInput'

import configs from 'configs'
import { priceImpactColor } from 'helper'

const BuyToken = () => {
  const theme = useTheme()
  return (
    <Card>
      <Row gutter={[24, 24]}>
        {/* Ask amount */}
        <Col span={24}>
          <Space direction="vertical">
            <Typography.Text>You pay</Typography.Text>
            <Card
              bordered={false}
              className="card-swap"
              bodyStyle={{ padding: 0 }}
            >
              <MintInput
                amount={0}
                selectedMint={configs.sol.askMintDefault}
                onChangeAmount={() => {}}
                mintSelection={
                  <MintSelection
                    value={configs.sol.askMintDefault}
                    style={{
                      background: theme === 'dark' ? '#394360' : '#F2F4FA',
                    }}
                    onChange={() => {}}
                    disabled
                  />
                }
              />
            </Card>
          </Space>
        </Col>
        {/* Bid amount */}
        <Col span={24}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Text>You receive</Typography.Text>
            <Row align="middle">
              <Col flex="auto">
                <MintSelection
                  value={configs.sol.bidMintDefault}
                  style={{
                    background: theme === 'dark' ? '#394360' : '#F2F4FA',
                  }}
                  disabled
                />
              </Col>
              <Col>
                <Typography.Title level={3}>0</Typography.Title>
              </Col>
            </Row>
          </Space>
        </Col>

        <Col span={24}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Row align="middle">
              <Col flex="auto">
                <Typography.Text type="secondary">Price impact</Typography.Text>
              </Col>
              <Col>
                <Typography.Text style={{ color: priceImpactColor(0.0012) }}>
                  {1.2 > 0 ? util.numeric(0.0012).format('0.[0000]%') : '~ 0%'}
                </Typography.Text>
              </Col>
            </Row>
            <Row align="middle">
              <Col flex="auto">
                <Typography.Text type="secondary">Rate</Typography.Text>
              </Col>
              <Col>
                <Typography.Text>1 ZET = 0.5 USDC</Typography.Text>
              </Col>
            </Row>
          </Space>
        </Col>

        <Col span={24}>
          <Button size="large" type="primary" block>
            Purchase
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default BuyToken
