import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useMint } from '@senhub/providers'

import { Button, Card, Col, Row, Table, Typography } from 'antd'

import { fetchCGK, numeric } from 'shared/util'
import { TokenInfo } from '../index'
import { WORMHOLE_COLUMNS } from './column'

import './index.less'
import { AppState } from 'app/model'
import { useSelector } from 'react-redux'
import { useOracles } from 'app/hooks/useOracles'
import { GENERAL_DECIMALS } from 'app/constant'
import util from '@senswap/sen-js/dist/utils'

type PoolInfo = {
  token: TokenInfo
  amount: number
  value: number
}

const ConfirmPoolInfo = ({
  onReset,
  poolAddress,
}: {
  onReset: () => void
  poolAddress: string
}) => {
  const { pools } = useSelector((state: AppState) => state)
  const [poolInfo, setPoolInfo] = useState<PoolInfo[]>([])
  const [poolTotalValue, setPoolTotalValue] = useState(0)
  const { tokenProvider } = useMint()
  const { undecimalizeMintAmount } = useOracles()

  const getPoolInfo = useCallback(async () => {
    const { mints, reserves, weights } = pools[poolAddress]
    const poolElements: PoolInfo[] = await Promise.all(
      mints.map(async (value, idx) => {
        const tokenInfo = await tokenProvider.findByAddress(value.toBase58())
        const ticket = tokenInfo?.extensions?.coingeckoId
        let balance = await undecimalizeMintAmount(
          reserves[idx],
          value.toBase58(),
        )
        const normalizedWeight = util.undecimalize(
          BigInt(weights[idx].toString()),
          GENERAL_DECIMALS,
        )
        if (!ticket)
          return {
            token: {
              addressToken: value.toBase58(),
              weight: String(normalizedWeight),
              isLocked: true,
            },
            amount: Number(balance),
            value: 0,
          }

        const CGKTokenInfo = await fetchCGK(ticket)
        return {
          token: {
            addressToken: value.toBase58(),
            weight: String(normalizedWeight),
            isLocked: true,
          },
          amount: Number(balance),
          value: Number(
            numeric(CGKTokenInfo?.price * Number(balance)).format('0,0.[00]'),
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
  }, [poolAddress, pools, tokenProvider, undecimalizeMintAmount])

  useEffect(() => {
    getPoolInfo()
  }, [getPoolInfo])

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
          onClick={onReset}
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
