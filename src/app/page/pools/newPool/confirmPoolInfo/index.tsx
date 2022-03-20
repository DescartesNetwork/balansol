import { useMint } from '@senhub/providers'
import { Button, Card, Col, Row, Table, Typography } from 'antd'
import { PoolCreatingStep } from 'app/constant'
import React, {
  Dispatch,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { fetchCGK, numeric } from 'shared/util'
import { TokenInfo } from '..'
import { WORMHOLE_COLUMNS } from './column'

import './index.less'

type PoolInfo = {
  token: TokenInfo
  amount: number
  value: number
}

const ConfirmPoolInfo = ({
  tokenList,
  onSetTokenList,
  setCurrentStep,
  poolAddress,
  depositedAmounts,
  setVisible,
  onReset,
}: {
  tokenList: TokenInfo[]
  onSetTokenList: Dispatch<React.SetStateAction<TokenInfo[]>>
  setCurrentStep: Dispatch<React.SetStateAction<PoolCreatingStep>>
  poolAddress: string
  depositedAmounts: string[]
  setVisible: Dispatch<React.SetStateAction<boolean>>
  onReset: () => void
}) => {
  const [poolInfo, setPoolInfo] = useState<PoolInfo[]>([])
  const [poolTotalValue, setPoolTotalValue] = useState(0)

  const { tokenProvider } = useMint()

  const getPoolInfo = useCallback(async () => {
    const poolElements: PoolInfo[] = await Promise.all(
      tokenList.map(async (value, idx) => {
        const tokenInfo = await tokenProvider.findByAddress(value.addressToken)
        const ticket = tokenInfo?.extensions?.coingeckoId
        if (!ticket) return { token: value, amount: 0, value: 0 }
        const CGKTokenInfo = await fetchCGK(ticket)
        return {
          token: value,
          amount: Number(depositedAmounts[idx]),
          value: Number(
            numeric(CGKTokenInfo?.price * Number(depositedAmounts[idx])).format(
              '0,0.[00]',
            ),
          ),
        }
      }),
    )
    const totalValue = poolElements.reduce(
      (previousSum, currentValue) => previousSum + currentValue.value,
      0,
    )
    setPoolTotalValue(totalValue)
    setPoolInfo(poolElements)
  }, [depositedAmounts, tokenList, tokenProvider])

  useEffect(() => {
    getPoolInfo()
  }, [getPoolInfo, tokenList])

  return (
    <Fragment>
      <Col span={24}>
        <Table
          columns={WORMHOLE_COLUMNS}
          dataSource={poolInfo}
          rowClassName={(record, index) => (index % 2 ? 'odd-row' : 'even-row')}
          pagination={false}
          rowKey={(record) => record.token.addressToken}
        />
      </Col>
      <Col span={24}>
        <Card
          style={{
            borderRadius: '8px',
            backgroundColor: '#142042',
            boxShadow: 'none',
          }}
          bodyStyle={{ padding: 16 }}
          bordered={false}
        >
          <Row align="middle">
            <Col flex={1}>
              <Typography.Text type="secondary">Total value</Typography.Text>
            </Col>
            <Col>
              <Typography.Title level={3}>${poolTotalValue}</Typography.Title>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={() => {
            onReset()
          }}
          style={{ borderRadius: 40 }}
          block
        >
          Confirm
        </Button>
      </Col>
    </Fragment>
  )
}

export default ConfirmPoolInfo
