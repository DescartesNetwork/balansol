import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMint } from '@senhub/providers'
import { utils } from '@senswap/sen-js'

import { Card, Col, Row, Typography } from 'antd'
import DoughnutChart, { PoolBalanceData } from './doughnutChart'

import { AppState } from 'app/model'
import { getMintInfo } from 'app/helper/oracles'

const PoolBalance = ({ poolAddress }: { poolAddress: string }) => {
  const [poolBalances, setPoolBalances] = useState<PoolBalanceData[]>([])
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const { tokenProvider } = useMint()

  const doughnutChartData = useCallback(async () => {
    if (!poolData) return
    const newData = await Promise.all(
      poolData.mints.map(async (value, idx) => {
        const tokenInfo = await tokenProvider.findByAddress(value.toBase58())

        const { normalizedWeight, reserve } = getMintInfo(
          poolData,
          value.toBase58(),
        )

        if (!tokenInfo)
          return { symbol: 'TOKN', weight: normalizedWeight, tokenAmount: '' }

        const reserveNumber = utils.undecimalize(
          BigInt(reserve.toString()),
          tokenInfo?.decimals || 0,
        )

        if (!tokenInfo.logoURI)
          return {
            symbol: tokenInfo.symbol,
            weight: normalizedWeight,
            tokenAmount: '',
          }
        return {
          symbol: tokenInfo.symbol,
          weight: normalizedWeight,
          tokenAmount: reserveNumber,
        }
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
          <Typography.Title level={4}>Pool Weights</Typography.Title>
        </Col>
        <Col span={24}>
          <DoughnutChart data={poolBalances} />
        </Col>
      </Row>
    </Card>
  )
}

export default PoolBalance
