import moment from 'moment'
import { utilsBN } from '@sen-use/web3'
import { BN } from '@project-serum/anchor'
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

type LaunchpadLineChartProps = {
  price_a?: number
  price_b?: number
  balance_a?: number
  balance_b?: number
}

const getTimes = (starTime: number, endTime: number) => {
  const result: number[] = []
  const blockTime = (endTime - starTime) / 5
  for (let i = 0; i < 3; i++) {
    if (i === 0) {
      result[i] = starTime
      continue
    }
    const time = result[result.length - 1] + blockTime
    result[i] = time
  }
  return result
}

const getPrices = (starPrice: number, endPrice: number) => {
  const result: BN[] = []
  const bnStartPrice = utilsBN.decimalize(starPrice, 9)
  const bnEndPrice = utilsBN.decimalize(endPrice, 9)

  const singlePrice = bnStartPrice.sub(bnEndPrice).div(new BN(5))
  for (let i = 0; i < 3; i++) {
    if (i === 0) {
      result[i] = bnStartPrice
      continue
    }
    const price = result[result.length - 1].sub(singlePrice)
    result[i] = price
  }
  return result
}

const buildOptions = (props: LaunchpadLineChartProps) => {
  const startTime = Date.now()
  const endTime = startTime + 3 * (24 * 60 * 60 * 1000)
  const startPrice = 0.6
  const endPrice = 0.1

  const prices = getPrices(startPrice, endPrice)
  const times = getTimes(startTime, endTime)
  const xAxis = times.map((time) => moment(time).format('DD/MM HH:MM'))
  const yAxis = prices.map((price) => utilsBN.undecimalize(price, 9))
  const tmpValue = [0.6, 0.7, 0.4]
  return {
    xAxis: {
      type: 'category',
      data: xAxis,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: yAxis,
        type: 'line',
        smooth: true,
      },
      {
        data: tmpValue,
        type: 'line',
        smooth: true,
      },
    ],
  }
}

const LaunchpadLineChart = (props: LaunchpadLineChartProps) => {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={buildOptions(props)}
      notMerge={true}
      lazyUpdate={true}
    />
  )
}

export default LaunchpadLineChart
