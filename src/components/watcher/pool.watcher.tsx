import {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { tokenProvider } from '@sentre/senhub'

import Loading from '../loading'

import { getPools, upsetPool } from 'model/pools.controller'
import { AppDispatch } from 'model'

// Watch id
let watchId = 0

const PoolWatcher: FunctionComponent = (props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(true)

  // First-time fetching
  const fetchData = useCallback(async () => {
    try {
      await tokenProvider.all()
      await dispatch(getPools()).unwrap()
      setLoading(false)
    } catch (er) {
      return window.notify({
        type: 'error',
        description: 'Cannot fetch data of pools',
      })
    }
  }, [dispatch])

  // Watch account changes
  const watchData = useCallback(async () => {
    if (watchId) return console.warn('Already watched')
    watchId = window.balansol.watch((er: string | null, re) => {
      if (er) return console.error(er)
      if (re) return dispatch(upsetPool({ address: re.address, data: re.data }))
    }, [])
  }, [dispatch])

  useEffect(() => {
    fetchData()
    watchData()
    // Unwatch (cancel socket)
    return () => {
      ;(async () => {
        try {
          await window.balansol.unwatch(watchId)
        } catch (er) {}
      })()
      watchId = 0
    }
  }, [fetchData, watchData])

  if (loading) return <Loading />
  return <Fragment>{props.children}</Fragment>
}

export default PoolWatcher
