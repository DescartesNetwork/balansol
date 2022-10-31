import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { web3 } from '@project-serum/anchor'

import Watcher from './watcher'
import { initLaunchpads, upsetLaunchpad } from 'model/launchpads.controller'

// TODO: Config
const NAME = 'launchpad'
const FILTER: web3.GetProgramAccountsFilter[] = []

const LaunchpadWatcher = () => {
  const dispatch = useDispatch()

  // TODO: init all account data
  const init = useCallback((data) => dispatch(initLaunchpads(data)), [dispatch])
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