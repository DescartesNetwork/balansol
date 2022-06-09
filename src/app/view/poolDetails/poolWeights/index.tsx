import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMint } from '@senhub/providers'

import { Card, Col, Row, Typography } from 'antd'
import DoughnutChart, { PoolWeightData } from './doughnutChart'

import { AppState } from 'app/model'
import { getMintInfo } from 'app/helper/oracles'
import { utilsBN } from 'app/helper/utilsBN'

const PoolWeights = ({ poolAddress }: { poolAddress: string }) => {
  const [poolWeights, setPoolWeights] = useState<PoolWeightData[]>([])
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const { tokenProvider } = useMint()

  const doughnutChartData = useCallback(async () => {
    if (!poolData) return
    const newData = await Promise.all(
      poolData.mints.map(async (mint) => {
        const { normalizedWeight, reserve } = getMintInfo(
          poolData,
          mint.toBase58(),
        )
        let symbol = 'TOKEN'
        let tokenAmount = '-'
        const tokenInfo = await tokenProvider.findByAddress(mint.toBase58())
        if (tokenInfo) {
          symbol = tokenInfo.symbol
          tokenAmount = utilsBN.undecimalize(reserve, tokenInfo.decimals)
        }
        return {
          symbol,
          tokenAmount,
          weight: normalizedWeight * 100,
        }
      }),
    )
    setPoolWeights(newData)
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
          <DoughnutChart data={poolWeights} />
        </Col>
      </Row>
    </Card>
  )
}

export default PoolWeights
