import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'model'

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

export const useGetLaunchpadWeight = () => {
  const launchpads = useSelector((state: AppState) => state.launchpads)

  const getLaunchpadWeights = useCallback(
    (
      currentTime: number,
      launchpadAddr = '',
      startWeights = [0, 0],
      endWeights = [0, 0],
      startTime = 0,
      endTime = 0,
    ) => {
      const launchpadData = launchpads[launchpadAddr]
      let start_time = launchpadAddr
        ? launchpadData.startTime.toNumber()
        : startTime
      let end_time = launchpadAddr ? launchpadData.endTime.toNumber() : endTime

      let start_weight_mint = launchpadAddr
        ? launchpadData.startWeights[MINT_IDX].toNumber()
        : startWeights[MINT_IDX].toNumber()

      let start_weight_base_mint = launchpadAddr
        ? launchpadData.startWeights[BASE_MINT_IDX].toNumber()
        : startWeights[BASE_MINT_IDX].toNumber()

      let end_weight_mint = launchpadAddr
        ? launchpadData.endWeights[MINT_IDX].toNumber()
        : endWeights[MINT_IDX].toNumber()

      let end_weight_base_mint = launchpadAddr
        ? launchpadData.endWeights[BASE_MINT_IDX].toNumber()
        : endWeights[BASE_MINT_IDX].toNumber()

      let ratio = (currentTime / 1000 - start_time) / (end_time - start_time)
      return [
        calc_new_weight(start_weight_mint, end_weight_mint, ratio),
        calc_new_weight(start_weight_base_mint, end_weight_base_mint, ratio),
      ]
    },
    [launchpads],
  )

  return getLaunchpadWeights
}
