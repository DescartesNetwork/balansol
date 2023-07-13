import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { web3 } from '@coral-xyz/anchor'

import Watcher from './watcher'
import { initCheques, upsetCheque } from 'model/cheques.controller'

// TODO: Config
const NAME = 'cheque'
const FILTER: web3.GetProgramAccountsFilter[] = []

const LaunchpadWatcher = () => {
  const dispatch = useDispatch()

  // TODO: init all account data
  const init = useCallback((data) => dispatch(initCheques(data)), [dispatch])
  // TODO: upset account data
  const upset = useCallback(
    (key: string, value: any) =>
      dispatch(upsetCheque({ address: key, data: value })),
    [dispatch],
  )

  return (
    <Watcher
      // @ts-ignore
      program={window.launchpad.program}
      name={NAME}
      filter={FILTER}
      init={init}
      upset={upset}
    />
  )
}
export default LaunchpadWatcher
