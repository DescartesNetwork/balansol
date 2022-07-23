import { ReactNode, useCallback } from 'react'
import { useUI, util } from '@sentre/senhub'

import { Col, Radio, Row, Space, Typography } from 'antd'
import NumericInput from '../numericInput'
import Selection from '../selection'
import { MintSymbol } from '@sen-use/components'

import './index.less'
import { useWrapAccountBalance } from 'hooks/useWrapAccountBalance'

const PROPORTIONS = [50, 100]
type MintInputProps = {
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
}

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
}: MintInputProps) {
  const {
    ui: { theme },
  } = useUI()
  const balance = useWrapAccountBalance(selectedMint)

  const onInput = useCallback(
    (value: string) => {
      if (!onChangeAmount) return
      const invalidValue = Number(value) > balance && !!onChangeAmount
      return onChangeAmount(value, invalidValue)
    },
    [balance, onChangeAmount],
  )

  const bg_default = theme === 'dark' ? '#394360' : '#ced0d7'

  return (
    <Row gutter={[0, 10]} align="middle" className="card-swap-item">
      <Col span={24}>
        <Row gutter={[10, 0]} wrap={false}>
          {/* Mint select */}
          <Col>
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
          <Col flex="auto">
            <NumericInput
              bordered={false}
              controls={false}
              placeholder="0"
              value={amount}
              max={force ? balance : undefined}
              onValue={onInput}
              disabled={!onChangeAmount || (force && !balance)}
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
                {util.numeric(balance).format('0,0.[00]')}
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
                  let proportionActive = 0
                  for (const idx in PROPORTIONS) {
                    if (!balance) break
                    const proportion = PROPORTIONS[idx]
                    const proportionVal = (balance * proportion) / 100

                    if (Number(amount).toFixed(4) === proportionVal.toFixed(4))
                      proportionActive = proportion
                  }
                  const isActive = val <= proportionActive

                  return (
                    <Space size={4} direction="vertical" key={val}>
                      <Radio.Button
                        className="proportion-btn"
                        disabled={!onChangeAmount}
                        onClick={
                          onChangeAmount
                            ? () =>
                                onChangeAmount(
                                  ((balance * val) / 100).toFixed(9),
                                )
                            : undefined
                        }
                        style={{
                          background: isActive ? '#63e0b3' : bg_default,
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
