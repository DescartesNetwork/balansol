import React, { useCallback, useEffect, useState } from 'react'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import { Row, Space } from 'antd'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'
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

type DoughnutData = { symbol: string; weight: string; logo: string }

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
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        top: 0,
        label: {
          show: false,
          position: 'center',
        },
        labelLine: {
          show: true,
        },
        bottom: 0,
        data: data.map((value) => {
          return {
            name: value.symbol,
            value: value.weight,
            tooltip: {
              show: false,
              borderWidth: '0',
            },
            emphasis: {
              label: {
                show: true,
                formatter: ['{a| }', '{c|{c}%}'].join('\n\n'),
                rich: {
                  a: {
                    backgroundColor: {
                      image: value.logo,
                    },
                    borderRadius: 45,
                    height: 32,
                    width: 32,
                  },
                  c: {
                    fontSize: 20,
                    color: '#F3F3F5',
                  },
                },
              },
            },
          }
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
  const [data, setData] = useState<DoughnutData[]>([])

  const doughnutChartData = useCallback(async () => {
    const { mints, weights } = poolData
    const newData = await Promise.all(
      mints.map(async (value, idx) => {
        const tokenInfo = await tokenProvider.findByAddress(value.toBase58())
        const weight = util.undecimalize(
          BigInt(weights[idx].toString()),
          GENERAL_DECIMALS,
        )
        if (!tokenInfo) return { symbol: 'TOKN', weight, logo: '' }
        if (!tokenInfo.logoURI)
          return { symbol: tokenInfo.symbol, weight, logo: '' }
        return { symbol: tokenInfo.symbol, weight, logo: tokenInfo.logoURI }
      }),
    )
    setData(newData)
  }, [poolData, tokenProvider])

  useEffect(() => {
    doughnutChartData()
  }, [doughnutChartData])

  return (
    <Row justify="center">
      <Space className="doughnut-container">
        <ReactEChartsCore
          echarts={echarts}
          option={options(data)}
          notMerge={true}
          lazyUpdate={true}
        />
      </Space>
    </Row>
  )
}

export default DoughnutChart
