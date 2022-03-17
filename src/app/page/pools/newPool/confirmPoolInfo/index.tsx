import { useMint } from '@senhub/providers'
import { Button, Card, Col, Row, Table, Typography } from 'antd'
import React, {
  Dispatch,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { fetchCGK } from 'shared/util'
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
}: {
  tokenList: TokenInfo[]
  onSetTokenList: Dispatch<React.SetStateAction<TokenInfo[]>>
  setCurrentStep: Dispatch<React.SetStateAction<number>>
  poolAddress: string
  depositedAmounts: string[]
  setVisible: Dispatch<React.SetStateAction<boolean>>
}) => {
  const [poolInfo, setPoolInfo] = useState<PoolInfo[]>([])
  const [poolTotalValue, setPoolTotalValue] = useState(0)

  const { tokenProvider } = useMint()

  const getPoolInfo = useCallback(async () => {
    const poolElements: PoolInfo[] = await Promise.all(
      tokenList.map(async (value, idx) => {
        const tokenInfo = await tokenProvider.findByAddress(value.addressToken)
        const ticket = tokenInfo?.extensions?.coingeckoId
        const CGKTokenInfo = await fetchCGK(ticket)
        if (!CGKTokenInfo) return { token: value, amount: 0, value: 0 }
        console.log(
          CGKTokenInfo?.price,
          Number(depositedAmounts[idx]),
          depositedAmounts[idx],
          'CGKTokenInfo',
        )
        return {
          token: value,
          amount: Number(depositedAmounts[idx]),
          value: CGKTokenInfo?.price * (Number(depositedAmounts[idx]) | 0),
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
          <Row>
            <Col flex={1}>
              <Typography.Text type="secondary">Total value</Typography.Text>
            </Col>
            <Col>{poolTotalValue}</Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={() => {
            setVisible(false)
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
