import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { tokenProvider, useMintDecimals, util } from '@sentre/senhub'

import { useGetPriceInPool } from 'hooks/launchpad/useGetTokenInPoolPrice'
import { useGetLaunchpadWeight } from 'hooks/launchpad/useGetLaunchpadWeight'

echarts.use([
  TitleComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
])

type LaunchpadLineChartProps = {
  startPrice: number
  endPrice: number
  balanceA: number
  balanceB: number
  baseMint: string
  startTime: number
  endTime: number
  mint: string
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

const buildOptions = (defaultValue: number[], durations: number[]) => {
  const xAxis = durations.map((time) => moment(time).format('DD/MM HH:mm'))
  return {
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
        return 'Price: $' + util.numeric(params.value).format('0,0.[000]')
      },
    },
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
    ],
  }
}

const LaunchpadChartInit = ({
  startPrice,
  endPrice,
  balanceA,
  balanceB,
  baseMint,
  startTime,
  endTime,
  mint,
}: LaunchpadLineChartProps) => {
  const [stablePrice, setStablePrice] = useState(0)
  const calcPriceInPool = useGetPriceInPool()
  const getLaunchpadWeight = useGetLaunchpadWeight()
  const decimal = useMintDecimals({ mintAddress: mint }) || 0
  const stbDecimal = useMintDecimals({ mintAddress: baseMint }) || 0

  const getWeight = useCallback(
    (priceA: number, balanceA: number, priceB: number, balanceB) => {
      const total = priceA * balanceA + priceB * balanceB
      const weightA = (priceA * balanceA) / total
      const weightB = 1 - weightA
      return [utilsBN.decimalize(weightA, 9), utilsBN.decimalize(weightB, 9)]
    },
    [],
  )

  const durations = useMemo(() => {
    const times = getTimes(startTime, endTime)
    return times
  }, [endTime, startTime])

  const defaultValue = useMemo(() => {
    let prices: number[] = []
    const startWeight = getWeight(startPrice, balanceA, stablePrice, balanceB)
    const endWeight = getWeight(endPrice, balanceA, stablePrice, balanceB)

    for (const time of durations) {
      const weights = getLaunchpadWeight(
        time,
        '',
        startWeight,
        endWeight,
        startTime / 1000,
        endTime / 1000,
      )

      const price = calcPriceInPool(
        utilsBN.decimalize(weights[0], 9),
        utilsBN.decimalize(balanceA, decimal),
        stablePrice,
        utilsBN.decimalize(balanceB, 9),
        utilsBN.decimalize(weights[1], stbDecimal),
      )
      prices.push(price)
    }

    return prices
  }, [
    balanceA,
    balanceB,
    calcPriceInPool,
    decimal,
    durations,
    endPrice,
    endTime,
    getLaunchpadWeight,
    getWeight,
    stablePrice,
    startPrice,
    startTime,
    stbDecimal,
  ])

  useEffect(() => {
    ;(async () => {
      if (stablePrice) return
      const price = await tokenProvider.getPrice(baseMint)
      if (!price) return setStablePrice(0)
      return setStablePrice(price)
    })()
  }, [baseMint, stablePrice])

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={buildOptions(defaultValue, durations)}
      notMerge={true}
      lazyUpdate={true}
    />
  )
}

export default LaunchpadChartInit
