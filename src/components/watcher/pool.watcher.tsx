import {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { web3 } from '@coral-xyz/anchor'

import Loading from '../loading'

import { getPools, upsetPool } from 'model/pools.controller'
import { AppDispatch } from 'model'
import Watcher from './watcher'

// Watch id
const NAME = 'pool'
const FILTER: web3.GetProgramAccountsFilter[] = []

const PoolWatcher: FunctionComponent = (props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(true)

  // TODO: upset account data
  const upset = useCallback(
    (key: string, value: any) =>
      dispatch(upsetPool({ address: key, data: value })),
    [dispatch],
  )

  // First-time fetching
  const fetchData = useCallback(async () => {
    try {
      await dispatch(getPools()).unwrap()
      setLoading(false)
    } catch (er) {
      return window.notify({
        type: 'error',
        description: 'Cannot fetch data of pools',
      })
    }
  }, [dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <Loading />
  return (
    <Fragment>
      <Watcher
        // @ts-ignore
        program={window.balansol.program}
        name={NAME}
        filter={FILTER}
        init={() => {}}
        upset={upset}
      />
      {props.children}
    </Fragment>
  )
}

export default PoolWatcher
