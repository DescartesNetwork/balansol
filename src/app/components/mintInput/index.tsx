import { ReactNode } from 'react'

import { Col, Radio, Row, Space, Typography } from 'antd'
import NumericInput from 'shared/antd/numericInput'
import { MintSymbol } from 'shared/antd/mint'
import Selection from '../selection'

import { numeric } from 'shared/util'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'

import './index.less'

const PROPORTIONS = [50, 100]

export default function MintInput({
  amount,
  onChangeAmount,
  selectedMint,
  mints = [],
  onSelect = () => {},
  mintLabel,
  mintAvatar,
  ratioButton,
  unit,
  force, // Validate input with max = balance
  mintSelection,
}: {
  amount: string | number
  onChangeAmount?: (val: string, invalid?: boolean) => void
  selectedMint: string
  onSelect?: (mint: string) => void
  mints?: string[]
  unit?: string
  force?: boolean
  mintLabel?: ReactNode
  mintAvatar?: ReactNode
  ratioButton?: ReactNode
  mintSelection?: ReactNode
}) {
  const { balance } = useAccountBalanceByMintAddress(selectedMint)

  const onInput = (value: string) => {
    if (!onChangeAmount) return
    const invalidValue = Number(value) > balance && !!onChangeAmount
    return onChangeAmount(value, invalidValue)
  }

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
            {!mintSelection ? (
              <Selection
                selectedMint={selectedMint}
                onChange={onSelect}
                mints={mints}
                mintLabel={mintLabel}
                mintAvatar={mintAvatar}
              />
            ) : (
              mintSelection
            )}
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
              }}
              placeholder="0"
              value={amount}
              max={force ? balance : undefined}
              onValue={onInput}
              disabled={!onChangeAmount}
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
                {unit || <MintSymbol mintAddress={selectedMint} />}
              </Typography.Text>
            </Space>
          </Col>
          {/* RatioButton  */}
          <Col
            className="proportion-wrap"
            style={{ display: ratioButton === null ? 'none' : '' }}
          >
            {ratioButton ? (
              ratioButton
            ) : (
              <Space>
                {PROPORTIONS.map((val) => {
                  const minValue = (balance * val) / 100
                  const isActive =
                    balance &&
                    (Number(amount).toFixed(4) === minValue.toFixed(4) ||
                      Number(amount).toFixed(4) === balance.toFixed(4))

                  return (
                    <Space size={4} direction="vertical" key={val}>
                      <Radio.Button
                        className="proportion-btn"
                        disabled={!onChangeAmount}
                        onClick={
                          onChangeAmount
                            ? () => onChangeAmount(String(minValue))
                            : undefined
                        }
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
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
