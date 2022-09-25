import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { tokenProvider, useGetMintDecimals } from '@sentre/senhub'

import { Card, Col, Row, Spin, Typography } from 'antd'
import DoughnutChart, { PoolWeightData } from './doughnutChart'

import { AppState } from 'model'
import { getMintInfo } from 'helper/oracles'
import { utilsBN } from 'helper/utilsBN'
import { notifyError } from 'helper'

const PoolWeights = ({ poolAddress }: { poolAddress: string }) => {
  const [loading, setLoading] = useState(false)
  const [poolWeights, setPoolWeights] = useState<PoolWeightData[]>([])
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  const getDecimals = useGetMintDecimals()

  const doughnutChartData = useCallback(async () => {
    try {
      setLoading(true)
      if (!poolData) return
      const newData = await Promise.all(
        poolData.mints.map(async (mint) => {
          const { normalizedWeight, reserve } = getMintInfo(
            poolData,
            mint.toBase58(),
          )
          const tokenInfo = await tokenProvider.findByAddress(mint.toBase58())

          if (tokenInfo)
            return {
              symbol: tokenInfo.symbol,
              tokenAmount: utilsBN.undecimalize(reserve, tokenInfo.decimals),
              weight: normalizedWeight * 100,
            }
          const decimal =
            (await getDecimals({ mintAddress: mint.toBase58() })) || 0
          return {
            symbol: mint.toBase58().substring(0, 4),
            tokenAmount: utilsBN.undecimalize(reserve, decimal) || '0',
            weight: normalizedWeight * 100,
          }
        }),
      )
      setPoolWeights(newData)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }, [getDecimals, poolData])

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
          <Spin tip="Loading..." spinning={loading}>
            <DoughnutChart data={poolWeights} />
          </Spin>
        </Col>
      </Row>
    </Card>
  )
}

export default PoolWeights
