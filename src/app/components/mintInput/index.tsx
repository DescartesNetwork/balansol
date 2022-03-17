import { Col, Radio, Row, Space, Typography } from 'antd'
import NumericInput from 'shared/antd/numericInput'
import { MintSymbol } from 'shared/antd/mint'
import Selection from '../selection'

import { numeric } from 'shared/util'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import './index.less'
import { ReactNode } from 'react'

const PROPORTIONS = [50, 100]

export default function MintInput({
  amount,
  onChangeAmount = () => {},
  selectedMint,
  mints = [],
  onSelect = () => {},
  mintLabel,
  mintAvatar,
}: {
  amount: string
  onChangeAmount?: (val: string) => void
  selectedMint: string
  onSelect?: (mint: string) => void
  mints?: string[]
  mintLabel?: ReactNode
  mintAvatar?: ReactNode
}) {
  const { balance } = useAccountBalanceByMintAddress(selectedMint)

  return (
    <Row
      gutter={[0, 10]}
      align="middle"
      style={{
        background: '#142042',
        borderRadius: 20,
        padding: 16,
      }}
    >
      <Col span={24}>
        <Row justify="space-between">
          {/* Mint select */}
          <Col flex="auto">
            <Selection
              selectedMint={selectedMint}
              onChange={onSelect}
              mints={mints}
              mintLabel={mintLabel}
              mintAvatar={mintAvatar}
            />
          </Col>
          {/* Amount input */}
          <Col>
            <NumericInput
              bordered={false}
              style={{
                textAlign: 'right',
                fontSize: 24,
                maxWidth: 150,
                padding: 0,
                color: '#9CA1AF',
              }}
              placeholder="0"
              value={amount}
              onValue={onChangeAmount}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row align="middle" style={{ width: '100%' }}>
          {/* Available  */}
          <Col flex="auto" style={{ justifyContent: 'left' }}>
            <Space className="caption">
              <Typography.Text type="secondary">Available:</Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ cursor: 'pointer' }}
                onClick={() => {}}
              >
                {numeric(balance).format('0,0.[00]')}
              </Typography.Text>
              <Typography.Text type="secondary">
                <MintSymbol mintAddress={''} />
              </Typography.Text>
            </Space>
          </Col>
          {/* proportion  */}
          <Col className="proportion-wrap">
            <Space>
              {PROPORTIONS.map((val) => {
                const minValue = (balance * val) / 100
                const isActive = balance && Number(amount) >= minValue
                return (
                  <Space size={4} direction="vertical">
                    <Radio.Button
                      className="proportion-btn"
                      onClick={() => onChangeAmount(String(minValue))}
                      style={{
                        background: isActive ? '#63e0b3' : undefined,
                      }}
                    />
                    <Typography.Text type="secondary" className="caption">
                      {`${val}%`}
                    </Typography.Text>
                  </Space>
                )
              })}
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
