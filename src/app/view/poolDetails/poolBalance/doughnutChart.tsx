import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { numeric } from 'shared/util'

echarts.use([
  TitleComponent,
  GridComponent,
  PieChart,
  CanvasRenderer,
  LegendComponent,
])

export type PoolBalanceData = {
  symbol: string
  weight: number
  tokenAmount: string
}

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
          show: true,
          position: 'inside',
          formatter: '{c}%',
        },
        labelLine: {
          show: true,
        },
        bottom: 0,
        data: data.map((value) => {
          return {
            name: value.symbol,
            value: numeric(value.weight).format('0,0.[00]'),
            tokenAmount: value.tokenAmount,
            tooltip: {
              show: false,
              borderWidth: '0',
            },
            emphasis: {
              label: {
                show: true,
                formatter: ['{a| }', '{c|{c}%}', '{@tokenAmount}'].join(
                  '\n\n\n',
                ),
                rich: {
                  a: {
                    borderRadius: 45,
                    height: 32,
                    width: 32,
                  },
                  c: {
                    fontSize: 20,
                    color: '#F3F3F5',
                  },
                },
                backgroundColor: 'red',
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
    <ReactEChartsCore
      echarts={echarts}
      option={buildOptions(data)}
      notMerge={true}
      lazyUpdate={true}
    />
  )
}

export default DoughnutChart
