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
import { useUI } from '@senhub/providers'

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

const buildOptions = (data: PoolBalanceData[], textColor: string) => {
  return {
    legend: {
      bottom: 0,
      icon: 'circle',
      textStyle: {
        color: textColor,
      },
    },
    tooltip: {
      trigger: 'item',
      borderWidth: '1',
      formatter: function (params: any, ticket: any, callback: () => void) {
        return `<div style="width: 200px; font-weight: 400"><span style="color: #9CA1AF; font-size: 12px">${params.data.name}</span><br/><span style="display: flex; justify-content: space-between; font-size: 14px"><span>Weight</span> <span>${params.data.value}%</span></span> <span style="display: flex; justify-content: space-between; font-size: 14px"><span>Token amount</span> <span>${params.data.tokenAmount}</span></span></div>`
      },
      backgroundColor: '#212C4C',
      extraCssText: 'border-radius: 24px',
      textStyle: {
        color: textColor,
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

const TEXT_COLOR = {
  light: '#081438',
  dark: '#F3F3F5',
}

const DoughnutChart = ({ data }: { data: PoolBalanceData[] }) => {
  const {
    ui: { theme },
  } = useUI()

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={buildOptions(data, TEXT_COLOR[theme])}
      notMerge={true}
      lazyUpdate={true}
    />
  )
}

export default DoughnutChart
