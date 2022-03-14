import { Fragment, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { getPools, upsetPool } from 'app/model/pool.controller'
import { AppDispatch } from 'app/model'

// Watch id
let watchId = 0

const PoolWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()

  // First-time fetching
  const fetchData = useCallback(async () => {
    try {
      await dispatch(getPools()).unwrap()
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
    watchId = window.sen_balancer.watch((er: string | null, re) => {
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
          await window.sen_balancer.unwatch(watchId)
        } catch (er) {}
      })()
      watchId = 0
    }
  }, [fetchData, watchData])

  return <Fragment />
}

export default PoolWatcher
