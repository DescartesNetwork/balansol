import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMint } from '@senhub/providers'
import { utils } from '@senswap/sen-js'

import { Card, Col, Row, Typography } from 'antd'
import DoughnutChart, { PoolBalanceData } from './doughnutChart'

import { GENERAL_DECIMALS } from 'app/constant'
import { AppState } from 'app/model'

const PoolBalance = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const { tokenProvider } = useMint()
  const [poolBalances, setPoolBalances] = useState<PoolBalanceData[]>([])

  const doughnutChartData = useCallback(async () => {
    if (!poolData) return
    const { mints, weights } = poolData
    const newData = await Promise.all(
      mints.map(async (value, idx) => {
        const tokenInfo = await tokenProvider.findByAddress(value.toBase58())
        const weight = utils.undecimalize(
          BigInt(weights[idx].toString()),
          GENERAL_DECIMALS,
        )
        if (!tokenInfo) return { symbol: 'TOKN', weight, logo: '' }
        if (!tokenInfo.logoURI)
          return { symbol: tokenInfo.symbol, weight, logo: '' }
        return { symbol: tokenInfo.symbol, weight, logo: tokenInfo.logoURI }
      }),
    )
    setPoolBalances(newData)
  }, [poolData, tokenProvider])

  useEffect(() => {
    doughnutChartData()
  }, [doughnutChartData])

  return (
    <Card className="chart-card">
      <Row>
        <Col span={24}>
          <Typography.Title level={4}>Pool balance</Typography.Title>
        </Col>
        <Col span={24}>
          <DoughnutChart data={poolBalances} />
        </Col>
      </Row>
    </Card>
  )
}

export default PoolBalance
