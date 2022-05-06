import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

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
    tooltip: {
      trigger: 'item',
      formatter: '{b} <br/> : {c} ({d}%){@e}',
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        avoidLabelOverlap: false,
        top: 0,
        bottom: 0,
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
        },
        labelLine: {
          show: true,
        },
        data: data.map((value) => {
          return {
            name: value.symbol,
            value: value.weight,
            e: 'tra',
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
