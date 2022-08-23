import { util } from '@sentre/senhub'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart as BC } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import { Row } from 'antd'
import { VolumeData } from '.'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BC,
  CanvasRenderer,
  LegendComponent,
])

const buildOptions = (data: VolumeData[]) => ({
  xAxis: {
    type: 'category',
    data: data.map((value) => value.label),
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false,
    },
    axisLabel: {
      formatter: (value: number) => {
        return util.numeric(value).format('0,0.[00]a')
      },
    },
  },
  tooltip: {
    trigger: 'item',
    borderWidth: '1',
    valueFormatter: (value: any) => '$' + value.toFixed(2),
  },
  series: [
    {
      data: data.map((value) => value.data),
      type: 'bar',
      itemStyle: { color: '#87E0C0' },
    },
  ],
  grid: {
    show: false,
    top: 10,
    left: 40,
    right: 10,
    bottom: 50,
  },
})

const BarChart = ({ data }: { data: VolumeData[] }) => {
  return (
    <Row justify="center" className="barchart-container">
      <ReactEChartsCore echarts={echarts} option={buildOptions(data)} />
    </Row>
  )
}

export default BarChart
