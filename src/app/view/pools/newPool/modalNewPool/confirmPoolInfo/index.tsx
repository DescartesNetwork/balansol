import { Fragment, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Card, Col, Row, Table, Typography } from 'antd'
import { MintSetup } from '../index'
import { COLUMNS_CONFIG } from './columns'

import { useMint } from '@senhub/providers'
import { fetchCGK, numeric } from 'shared/util'
import { AppState } from 'app/model'
import { useOracles } from 'app/hooks/useOracles'
import { getMintInfo } from 'app/helper/oracles'
import './index.less'

export type PoolInfo = {
  token: MintSetup
  amount: number
  value: number
}

export type ConfirmPoolInfoProps = {
  onConfirm: () => void
  poolAddress: string
}

const ConfirmPoolInfo = ({ onConfirm, poolAddress }: ConfirmPoolInfoProps) => {
  const [poolInfo, setPoolInfo] = useState<PoolInfo[]>([])
  const [poolTotalValue, setPoolTotalValue] = useState(0)

  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const { tokenProvider } = useMint()
  const { undecimalizeMintAmount } = useOracles()

  const getPoolInfo = useCallback(async () => {
    if (!poolData) {
      setPoolInfo([])
      return setPoolTotalValue(0)
    }
    const { mints, reserves } = poolData
    let totalValue = 0
    const poolInfo: PoolInfo[] = await Promise.all(
      mints.map(async (mint, idx) => {
        const mintAddress = mint.toBase58()
        const mintInfo = getMintInfo(poolData, mint)

        const tokenInfo = await tokenProvider.findByAddress(mintAddress)
        const ticket = tokenInfo?.extensions?.coingeckoId
        const cgkData = await fetchCGK(ticket)

        let mintAmount = await undecimalizeMintAmount(
          reserves[idx],
          mintAddress,
        )
        let mintTotalValue = Number(mintAmount) * (cgkData?.price || 0)
        totalValue += mintTotalValue
        return {
          token: {
            addressToken: mintAddress,
            weight: String(mintInfo.normalizedWeight),
            isLocked: true,
          },
          amount: Number(mintAmount),
          value: mintTotalValue,
        }
      }),
    )
    setPoolTotalValue(totalValue)
    setPoolInfo(poolInfo)
  }, [poolData, tokenProvider, undecimalizeMintAmount])

  useEffect(() => {
    getPoolInfo()
  }, [getPoolInfo])

  return (
    <Fragment>
      <Col span={24}>
        <Table
          columns={COLUMNS_CONFIG}
          dataSource={poolInfo}
          rowClassName={(_, index) => (index % 2 ? 'odd-row' : 'even-row')}
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
              <Typography.Title level={3}>
                ${numeric(poolTotalValue).format('0,0.[00]')}
              </Typography.Title>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={onConfirm}
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
