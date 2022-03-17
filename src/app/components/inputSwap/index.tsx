import { useEffect, useState } from 'react'

import { Col, Radio, Row, Space, Typography } from 'antd'
import NumericInput from 'shared/antd/numericInput'
import { MintSymbol } from 'shared/antd/mint'
import Selection from '../selection'

import { numeric } from 'shared/util'

import './index.less'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'

const enum Proportion {
  Zero = 'zero',
  Half = 'half',
  Full = 'full',
}

export default function InputSwap({
  amount,
  onChangeAmount,
  selectedMint,
  onSelect,
}: {
  amount: string
  onChangeAmount?: (val: string) => void
  selectedMint: string
  onSelect?: (mint: string) => void
}) {
  const [runTimeBalance, setRunTimeBalance] = useState(0)
  const [proportion, setProportion] = useState(Proportion.Zero)
  const { balance } = useAccountBalanceByMintAddress(selectedMint)
  useEffect(() => {
    setRunTimeBalance(balance)
  }, [balance])

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
        <Row>
          <Col flex="auto">
            <Selection selectedMint={selectedMint} onChange={onSelect} />
          </Col>
          <Col>
            <NumericInput
              bordered={false}
              style={{
                textAlign: 'right',
                fontSize: 24,
                maxWidth: 150,
                padding: 0,
                color: '#9CA1AF',
                minWidth: '140px',
              }}
              placeholder="0"
              value={amount}
              onValue={(e) => {
                console.log(e, 'sssss')
                if (!!onChangeAmount) {
                  onChangeAmount(e)
                }
                const balanceTemp = balance - Number(amount)
                if (balanceTemp > 0) return setRunTimeBalance(balanceTemp)
                return setRunTimeBalance(0)
              }}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row align="middle">
          <Col flex="auto">
            <Space className="caption">
              <Typography.Text type="secondary">Available:</Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ cursor: 'pointer' }}
                onClick={() => {}}
              >
                {numeric(runTimeBalance).format('0,0.[00]')}
              </Typography.Text>
              <Typography.Text type="secondary">
                <MintSymbol mintAddress={''} />
              </Typography.Text>
            </Space>
          </Col>
          <Col>
            <Radio.Group
              value={0}
              buttonStyle="solid"
              className="proportion-wrap"
              disabled={!onChangeAmount}
            >
              <Space>
                <Space size={4} direction="vertical">
                  <Radio.Button
                    className="proportion-btn"
                    onClick={() => {
                      if (!!onChangeAmount) {
                        onChangeAmount(String(balance / 2))
                        setRunTimeBalance(balance / 2)
                        setProportion(Proportion.Half)
                      }
                    }}
                    value={1}
                    style={{
                      background: [Proportion.Half, Proportion.Full].includes(
                        proportion,
                      )
                        ? '#f148fb'
                        : '',
                    }}
                  />
                  <Typography.Text type="secondary" className="caption">
                    50%
                  </Typography.Text>
                </Space>
                <Space size={4} direction="vertical">
                  <Radio.Button
                    className="proportion-btn"
                    value={2}
                    style={{
                      background:
                        proportion === Proportion.Full ? '#f148fb' : '',
                    }}
                    onClick={() => {
                      if (!!onChangeAmount) {
                        onChangeAmount(String(balance))
                        setRunTimeBalance(0)
                        setProportion(Proportion.Full)
                      }
                    }}
                  />
                  <Typography.Text type="secondary" className="caption">
                    100%
                  </Typography.Text>
                </Space>
              </Space>
            </Radio.Group>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
