import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { util, tokenProvider } from '@sentre/senhub'

import { Button, Card, Col, Row, Table, Typography } from 'antd'
import { MintSetup } from '../index'
import { COLUMNS_CONFIG } from './columns'

import { AppState } from 'model'
import { useOracles } from 'hooks/useOracles'
import { getMintInfo } from 'helper/oracles'
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
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const { undecimalizeMintAmount } = useOracles()

  const getPoolInfo = useCallback(async () => {
    if (!poolData) {
      setPoolInfo([])
      return setPoolTotalValue(0)
    }
    const { mints, reserves } = poolData
    let totalValue = 0
    const newPoolInfo: PoolInfo[] = await Promise.all(
      mints.map(async (mint, idx) => {
        const mintAddress = mint.toBase58()
        const mintInfo = getMintInfo(poolData, mint)
        const tokenInfo = await tokenProvider.findByAddress(mintAddress)
        let mintAmount = await undecimalizeMintAmount(
          reserves[idx],
          mintAddress,
        )
        const ticket = tokenInfo?.extensions?.coingeckoId
        if (!ticket) {
          return {
            token: {
              addressToken: mintAddress,
              weight: util
                .numeric(mintInfo.normalizedWeight)
                .format('0,0.[00]'),
              isLocked: true,
              decimal: tokenInfo?.decimals,
            },
            amount: Number(mintAmount),
            value: 0,
          }
        }
        const cgkData = await util.fetchCGK(ticket)

        let mintTotalValue = Number(mintAmount) * (cgkData?.price || 0)
        totalValue += mintTotalValue
        return {
          token: {
            addressToken: mintAddress,
            weight: util.numeric(mintInfo.normalizedWeight).format('0,0.[00]'),
            isLocked: true,
            decimal: tokenInfo?.decimals,
          },
          amount: Number(mintAmount),
          value: mintTotalValue,
        }
      }),
    )
    setPoolTotalValue(totalValue)
    setPoolInfo(newPoolInfo)
  }, [poolData, undecimalizeMintAmount])

  useEffect(() => {
    getPoolInfo()
  }, [getPoolInfo])

  return (
    <Row gutter={[24, 24]}>
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
          }}
          bodyStyle={{ padding: 16 }}
          bordered={false}
          className="card-total-value"
        >
          <Row align="middle">
            <Col flex={1}>
              <Typography.Text type="secondary">Total value</Typography.Text>
            </Col>
            <Col>
              <Typography.Title level={3}>
                ${util.numeric(poolTotalValue).format('0,0.[00]')}
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
          size="large"
        >
          Confirm
        </Button>
      </Col>
    </Row>
  )
}

export default ConfirmPoolInfo
