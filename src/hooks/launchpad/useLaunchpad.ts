import { useSelector } from 'react-redux'
import { LaunchpadData } from '@sentre/launchpad'
import { AppState } from 'model'

export const useLaunchpad = (address: string): LaunchpadData => {
  const launchpadData = useSelector(
    (state: AppState) => state.launchpads[address],
  )
  return launchpadData
}
