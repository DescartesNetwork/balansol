import { useEffect, useMemo, useState } from 'react'
import { useLaunchpad } from './useLaunchpad'

const MINT_IDX = 0
const BASE_MINT_IDX = 1

function calc_new_weight(
  start_weight: number,
  end_weight: number,
  ratio_with_precision: number,
) {
  let amount =
    start_weight > end_weight
      ? start_weight - end_weight
      : end_weight - start_weight

  let diff = amount * ratio_with_precision
  let new_weight =
    start_weight > end_weight ? start_weight - diff : start_weight + diff
  return new_weight
}

export const useLaunchpadWeights = (launchpad: string, timeout = 10000) => {
  const launchpadData = useLaunchpad(launchpad)!
  const [currentTime, setCurrentTime] = useState(new Date().getTime() / 1000)

  useEffect(() => {
    let interval = setInterval(() => {
      setCurrentTime(new Date().getTime() / 1000)
    }, timeout)
    return () => clearInterval(interval)
  }, [timeout])

  // src/schema/launchpad.rs
  const currentWeights = useMemo(() => {
    let start_time = launchpadData.startTime.toNumber()
    let end_time = launchpadData.endTime.toNumber()
    let start_weight_mint = launchpadData.startWeights[MINT_IDX].toNumber()
    let start_weight_base_mint =
      launchpadData.startWeights[BASE_MINT_IDX].toNumber()
    let end_weight_mint = launchpadData.endWeights[MINT_IDX].toNumber()
    let end_weight_base_mint =
      launchpadData.endWeights[BASE_MINT_IDX].toNumber()
    let ratio = (currentTime - start_time) / (end_time - start_time)
    return [
      calc_new_weight(start_weight_mint, end_weight_mint, ratio),
      calc_new_weight(start_weight_base_mint, end_weight_base_mint, ratio),
    ]
  }, [
    currentTime,
    launchpadData.endTime,
    launchpadData.endWeights,
    launchpadData.startTime,
    launchpadData.startWeights,
  ])

  return currentWeights
}
