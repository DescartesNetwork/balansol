import React from 'react'
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

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PieChart,
  CanvasRenderer,
  LegendComponent,
])

const options = {
  tooltip: {
    trigger: 'item',
  },
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
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ],
    },
  ],
}

const DoughnutChart = () => {
  return (
    <Row justify="center">
      <Space className="doughnut-container">
        <ReactEChartsCore
          echarts={echarts}
          option={options}
          notMerge={true}
          lazyUpdate={true}
        />
      </Space>
    </Row>
  )
}

export default DoughnutChart
