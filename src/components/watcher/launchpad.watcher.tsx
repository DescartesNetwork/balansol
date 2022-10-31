import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { web3 } from '@project-serum/anchor'

import Watcher from './watcher'
import {
  initLaunchpads,
  LaunchpadsState,
  upsetLaunchpad,
} from 'model/launchpads.controller'

// TODO: Config
const NAME = 'launchpad'
const FILTER: web3.GetProgramAccountsFilter[] = []

const LaunchpadWatcher = () => {
  const dispatch = useDispatch()

  // TODO: init all account data
  const init = useCallback(
    async (launchpads: LaunchpadsState) => {
      const pools = await window.balansol.program.account.pool.all()
      const filterLaunchpad: LaunchpadsState = {}
      for (const key in launchpads) {
        const poolData = pools.find((pool) =>
          pool.publicKey.equals(launchpads[key].pool),
        )
        if (!poolData) continue
        filterLaunchpad[key] = launchpads[key]
      }
      dispatch(initLaunchpads(filterLaunchpad))
    },
    [dispatch],
  )
  // TODO: upset account data
  const upset = useCallback(
    (key: string, value: any) =>
      dispatch(upsetLaunchpad({ address: key, data: value })),
    [dispatch],
  )

  return (
    <Watcher
      program={window.launchpad.program}
      name={NAME}
      filter={FILTER}
      init={init}
      upset={upset}
    />
  )
}
export default LaunchpadWatcher
