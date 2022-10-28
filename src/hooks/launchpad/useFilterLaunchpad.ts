import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { LaunchpadSate } from 'constant'
import { AppState } from 'model'

export const useFilterLaunchpad = (state?: LaunchpadSate) => {
  const launchpads = useSelector((state: AppState) => state.launchpads)

  const filteredLaunchpads = useMemo(() => {
    const result = []

    const validLaunchpads = Object.keys(launchpads).filter(
      (address) => !launchpads[address].state['uninitialized'],
    )
    if (!state) return validLaunchpads

    for (const address of validLaunchpads) {
      const launchpadData = launchpads[address]
      let valid = true
      const startTime = launchpadData.startTime.toNumber() * 1000
      const endTime = launchpadData.endTime.toNumber() * 1000
      const now = Date.now()

      switch (state) {
        case LaunchpadSate.active:
          if (startTime > now || endTime < now) valid = false
          break
        case LaunchpadSate.upcoming:
          if (startTime < now || endTime < now) valid = false
          break
        case LaunchpadSate.completed:
          if (endTime >= now) valid = false
          break
      }
      if (valid) result.push(address)
    }

    return result
  }, [launchpads, state])

  return filteredLaunchpads
}
