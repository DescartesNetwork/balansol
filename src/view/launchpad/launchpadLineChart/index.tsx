import { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { utilsBN } from '@sen-use/web3'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { tokenProvider, useTheme, util } from '@sentre/senhub'

import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { useGetPriceInPool } from 'hooks/launchpad/useGetTokenInPoolPrice'
import { useGetLaunchpadWeight } from 'hooks/launchpad/useGetLaunchpadWeight'
import { useGetBalanceAtTime } from 'hooks/launchpad/useGetBalanceAtTime'

echarts.use([
  TitleComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
])

type LaunchpadLineChartProps = {
  launchpadAddress: string
}
const MILESTONES = 20

const STYLE = {
  light: {
    color: '#081438',
    lineColor: '#CED0D7',
  },
  dark: {
    color: '#F3F3F5',
    lineColor: '#394360',
  },
}

type Price = null | number

const getTimes = (starTime: number, endTime: number) => {
  const result: number[] = []
  const blockTime = (endTime - starTime) / MILESTONES
  for (let i = 0; i <= MILESTONES; i++) {
    if (i === 0) {
      result[i] = starTime
      continue
    }
    const time = result[result.length - 1] + blockTime
    result[i] = time
  }
  return result
}

const buildOptions = (
  value: { currentResult: Price[]; estimateResult: Price[] },
  durations: number[],
  style: { color: string; lineColor: string },
) => {
  const xAxis = durations.map((time) => moment(time).format('DD/MM HH:mm'))

  return {
    legend: {
      data: ['Real price', 'Estimated price'],
      textStyle: {
        color: style.color,
      },
    },
    tooltip: {
      // Means disable default "show/hide rule".
      trigger: 'item',
      formatter: function (params: any) {
        return `<div style="min-width: 150px; font-weight: 400"><span style="display: flex; justify-content: space-between"><span style="font-size: 14px, font-weight: 400">Price:</span> <span style="font-size: 16px; font-weight: 700">$${util
          .numeric(params.value)
          .format(
            '0,0.[000]',
          )}</span></span> <span style="display: flex; justify-content: space-between;"><span style="font-size: 14px; font-weight: 400">Date:</span> <span style="font-size: 16px; font-weight: 700">${
          params.name
        }</span></span></div>`
      },
    },
    xAxis: {
      type: 'category',
      data: xAxis,
      axisLine: {
        lineStyle: {
          color: style.color,
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: style.color,
        },
      },
      splitLine: {
        lineStyle: {
          // Dark and light colors will be used in turns
          color: [style.lineColor],
        },
      },
    },
    series: [
      {
        name: 'Estimated price',
        data: value.estimateResult,
        type: 'line',
        smooth: true,
        lineStyle: {
          normal: {
            width: 2,
            type: 'dashed',
          },
        },
      },
      {
        name: 'Real price',
        data: value.currentResult,
        type: 'line',
        smooth: true,
        lineStyle: {
          normal: {
            width: 2,
          },
        },
      },
    ],
  }
}

const LaunchpadLineChart = ({ launchpadAddress }: LaunchpadLineChartProps) => {
  const [stablePrice, setStablePrice] = useState(0)
  const { launchpadData } = useLaunchpadData(launchpadAddress)
  const calcPriceInPool = useGetPriceInPool()
  const getLaunchpadWeight = useGetLaunchpadWeight()
  const getBalanceAtTime = useGetBalanceAtTime()
  const theme = useTheme()

  const durations = useMemo(() => {
    const { startTime, endTime } = launchpadData
    const times = getTimes(
      startTime.toNumber() * 1000,
      endTime.toNumber() * 1000,
    )
    return times
  }, [launchpadData])

  const currentValue = useMemo(() => {
    const currentResult: Price[] = []
    const estimateResult: Price[] = []
    for (const time of durations) {
      const weights = getLaunchpadWeight(time, launchpadAddress)
      const balances = getBalanceAtTime(launchpadAddress, time)
      const price = calcPriceInPool(
        utilsBN.decimalize(weights[0], 9),
        balances[0],
        stablePrice,
        balances[1],
        utilsBN.decimalize(weights[1], 9),
      )
      if (time >= Date.now()) {
        estimateResult.push(price)
        currentResult.push(null)
      } else {
        currentResult.push(price)
        estimateResult.push(null)
      }
    }

    //Format data
    let lastVal = 0
    for (let i = 0; i < currentResult.length; i++) {
      if (currentResult[i]) continue
      lastVal = currentResult[i - 1] || 0
      break
    }

    for (let i = 0; i < estimateResult.length; i++) {
      if (!estimateResult[i]) continue
      estimateResult[i - 1] = lastVal
      break
    }
    return { currentResult, estimateResult }
  }, [
    calcPriceInPool,
    durations,
    getBalanceAtTime,
    getLaunchpadWeight,
    launchpadAddress,
    stablePrice,
  ])

  useEffect(() => {
    ;(async () => {
      if (stablePrice || !launchpadAddress) return
      const price = await tokenProvider.getPrice(launchpadData.stableMint)
      if (!price) return setStablePrice(0)
      return setStablePrice(price)
    })()
  }, [launchpadAddress, launchpadData.stableMint, stablePrice])

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={buildOptions(currentValue, durations, STYLE[theme])}
      notMerge={true}
      lazyUpdate={true}
    />
  )
}

export default LaunchpadLineChart
