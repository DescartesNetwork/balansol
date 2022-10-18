import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'

echarts.use([
  TitleComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  LegendComponent,
])

const buildOptions = () => {
  return {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
      },
    ],
  }
}

const LaunchpadLineChart = () => {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={buildOptions()}
      notMerge={true}
      lazyUpdate={true}
    />
  )
}

export default LaunchpadLineChart
