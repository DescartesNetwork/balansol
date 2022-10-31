import { useState } from 'react'
import { useTheme, util } from '@sentre/senhub'

import { Button, Card, Col, Row, Space, Typography } from 'antd'
import MintInput from 'components/mintInput'
import { MintSelection, MintSymbol } from '@sen-use/app'

import { priceImpactColor } from 'helper'
import { useBuyToken } from 'hooks/launchpad/actions/useBuyToken'
import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { useWrapAccountBalance } from 'hooks/useWrapAccountBalance'

const BuyToken = ({ launchpadAddress }: { launchpadAddress: string }) => {
  const [amount, setAmount] = useState(0)
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const theme = useTheme()
  const { onBuyToken, loading } = useBuyToken()
  const { balance } = useWrapAccountBalance(launchpadData.stableMint.toBase58())

  const handleBuyToken = () => {
    if (!amount) return
    onBuyToken({
      amount,
      launchpadAddress,
    })
  }

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
                amount={amount}
                selectedMint={launchpadData.stableMint.toBase58()}
                onChangeAmount={(val) => setAmount(Number(val))}
                mintSelection={
                  <MintSelection
                    value={launchpadData?.stableMint.toBase58()}
                    style={{
                      background: theme === 'dark' ? '#394360' : '#F2F4FA',
                    }}
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
                  value={launchpadData.mint.toBase58()}
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
                <Typography.Text>
                  1 <MintSymbol mintAddress={launchpadData.mint.toBase58()} /> =
                  0.5{' '}
                  <MintSymbol
                    mintAddress={launchpadData.stableMint.toBase58()}
                  />
                </Typography.Text>
              </Col>
            </Row>
          </Space>
        </Col>

        <Col span={24}>
          <Button
            size="large"
            type="primary"
            block
            onClick={handleBuyToken}
            loading={loading}
            disabled={!amount || amount > balance}
          >
            Purchase
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default BuyToken
