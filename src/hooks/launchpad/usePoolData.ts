import { useSelector } from 'react-redux'

import { AppState } from 'model'
import { useLaunchpad } from './useLaunchpad'

export const usePoolData = (launchpadAddress: string) => {
  const launchpadData = useLaunchpad(launchpadAddress)!
  const poolData = useSelector(
    (state: AppState) => state.pools[launchpadData.pool.toBase58()],
  )
  return poolData
}
