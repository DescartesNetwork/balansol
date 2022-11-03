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
import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { useMemo } from 'react'

echarts.use([
  TitleComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  LegendComponent,
])

type LaunchpadLineChartProps = {
  startPrice?: number
  endPrice?: number
  startTime?: number
  endTime?: number
  launchpadAddress?: string
}

const getTimes = (starTime: number, endTime: number) => {
  const result: number[] = []
  const blockTime = (endTime - starTime) / 3
  for (let i = 0; i < 4; i++) {
    if (i === 0) {
      result[i] = starTime
      continue
    }
    const time = result[result.length - 1] + blockTime
    result[i] = time
  }
  return result
}

const getPrices = (starPrice = 0, endPrice = 0) => {
  const result: BN[] = []
  const bnStartPrice = utilsBN.decimalize(starPrice, 9)
  const bnEndPrice = utilsBN.decimalize(endPrice, 9)

  const singlePrice = bnStartPrice.sub(bnEndPrice).div(new BN(3))
  for (let i = 0; i < 4; i++) {
    if (i === 0) {
      result[i] = bnStartPrice
      continue
    }
    const price = result[result.length - 1].sub(singlePrice)
    result[i] = price
  }
  return result
}

const buildOptions = (
  defaultValue: string[],
  currentValue: string[],
  startTime: number,
  endTime: number,
) => {
  const times = getTimes(startTime, endTime)
  const xAxis = times.map((time) => moment(time).format('DD/MM HH:MM'))

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
        data: defaultValue,
        type: 'line',
        smooth: true,
      },
      {
        data: currentValue,
        type: 'line',
        smooth: true,
      },
    ],
  }
}

const LaunchpadLineChart = ({
  launchpadAddress,
  startPrice,
  endPrice,
  startTime = 0,
  endTime = 0,
}: LaunchpadLineChartProps) => {
  const { launchpadData } = useLaunchpadData(launchpadAddress || '')

  const defaultValue = useMemo(() => {
    let prices: BN[] = []
    if (!launchpadAddress && startPrice && endPrice)
      prices = getPrices(startPrice, endPrice)
    // prices = getPrices(startPrice, endPrice)
    return prices.map((price) => utilsBN.undecimalize(price, 9))
  }, [endPrice, launchpadAddress, startPrice])

  const startDate = launchpadAddress
    ? launchpadData.startTime.toNumber() * 1000
    : startTime

  const endDate = launchpadAddress
    ? launchpadData.endTime.toNumber() * 1000
    : endTime

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={buildOptions(defaultValue, [], startDate, endDate)}
      notMerge={true}
      lazyUpdate={true}
    />
  )
}

export default LaunchpadLineChart
