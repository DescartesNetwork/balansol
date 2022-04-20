import React from 'react'
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
import { VolumeData } from '../volume24h'
import { numeric } from 'shared/util'

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
        return numeric(value).format('0,0.[00]a')
      },
    },
  },
  series: [
    {
      data: data.map((value) => value.data),
      type: 'bar',
    },
  ],
  grid: {
    show: false,
  },
})

const BarChart = ({ data }: { data: VolumeData[] }) => {
  return (
    <Row justify="center" className="barchart-container">
      <ReactEChartsCore
        echarts={echarts}
        option={buildOptions(data)}
        notMerge={true}
        lazyUpdate={true}
      />
    </Row>
  )
}

export default BarChart
