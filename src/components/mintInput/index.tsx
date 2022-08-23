import { ReactNode, useCallback } from 'react'
import { util } from '@sentre/senhub'

import { Col, Row, Space, Typography } from 'antd'
import NumericInput from '../numericInput'
import Selection from '../selection'
import { MintSymbol } from '@sen-use/app'
import Proportion from './proportion'

import { useWrapAccountBalance } from 'hooks/useWrapAccountBalance'

import './index.less'

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
  placeholder?: string
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
  placeholder = '0',
}: MintInputProps) {
  const { balance } = useWrapAccountBalance(selectedMint)

  const onInput = useCallback(
    (value: string) => {
      if (!onChangeAmount) return
      const invalidValue = Number(value) > balance && !!onChangeAmount
      return onChangeAmount(value, invalidValue)
    },
    [balance, onChangeAmount],
  )

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
              placeholder={String(Number(placeholder))}
              value={!Number(amount) ? undefined : amount}
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
              <Typography.Text style={{ cursor: 'pointer' }}>
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
                {PROPORTIONS.map((val) => (
                  <Proportion
                    amount={amount}
                    selectedMint={selectedMint}
                    portionValue={val}
                    onChangeAmount={onChangeAmount}
                  />
                ))}
              </Space>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
