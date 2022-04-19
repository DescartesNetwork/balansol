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

echarts.use([
  TitleComponent,
  GridComponent,
  PieChart,
  CanvasRenderer,
  LegendComponent,
])

export type PoolBalanceData = { symbol: string; weight: string; logo: string }

const buildOptions = (data: PoolBalanceData[]) => {
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

const DoughnutChart = ({ data }: { data: PoolBalanceData[] }) => {
  return (
    <Row justify="center">
      <Space className="doughnut-container">
        <ReactEChartsCore
          echarts={echarts}
          option={buildOptions(data)}
          notMerge={true}
          lazyUpdate={true}
        />
      </Space>
    </Row>
  )
}

export default DoughnutChart
