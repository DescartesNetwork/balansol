import React, { useMemo, useState } from 'react'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import { Row, Space } from 'antd'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'
import { PoolData } from '@senswap/balancer'
import util from '@senswap/sen-js/dist/utils'
import { GENERAL_DECIMALS } from 'app/constant'
import { useMint } from '@senhub/providers'

echarts.use([
  TitleComponent,
  GridComponent,
  PieChart,
  CanvasRenderer,
  LegendComponent,
])

type DoughnutData = { symbol: string; weight: string }

const options = (data: DoughnutData[]) => {
  return {
    legend: {
      bottom: 0,
      icon: 'circle',
      textStyle: {
        color: '#F3F3F5',
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: data.map((value, idx) => {
          console.log(value, 'valllsksksksks')
          return { value: value.weight, name: value.symbol }
        }),
      },
    ],
  }
}

const DoughnutChart = ({ poolAddress }: { poolAddress: string }) => {
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const { tokenProvider } = useMint()
  const [data, setData] = useState<DoughnutData[]>()

  const doughnutChartData = useMemo(async () => {
    const { mints, weights } = poolData
    const data = Promise.all(
      mints.map(async (value, idx) => {
        const tokenInfo = await tokenProvider.findByAddress(value.toBase58())
        const weight = util.undecimalize(
          BigInt(weights[idx].toString()),
          GENERAL_DECIMALS,
        )
        if (!tokenInfo) return { symbol: 'TOKN', weight }
        return { symbol: tokenInfo.symbol, weight }
      }),
    )
    return data
  }, [poolData, tokenProvider])

  return (
    <Row justify="center">
      <Space className="doughnut-container">
        <ReactEChartsCore
          echarts={echarts}
          option={options(doughnutChartData)}
          notMerge={true}
          lazyUpdate={true}
        />
      </Space>
    </Row>
  )
}

export default DoughnutChart
