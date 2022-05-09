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
    tooltip: {
      trigger: 'item',
      borderWidth: '2',
      formatter: function (params: any, ticket: any, callback: () => void) {
        return `<span style="color: #9CA1AF">${params.data.name}</span><br/><span style="display: flex; flex-wrap: nowrap; justify-content: space-between; align-items: center"><span>Weight</span> <span style="margin-left: 4px">${params.data.value}</span></span> <span style="display: flex; flex-wrap: nowrap; justify-content: space-between"><span>Token amount</span> <span style="margin-left: 4px">${params.data.tokenAmount}</span></span>`
      },
      backgroundColor: '#212C4C',
      extraCssText: 'border-radius: 24px',
      textStyle: {
        color: '#F3F3F5',
      },
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
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
