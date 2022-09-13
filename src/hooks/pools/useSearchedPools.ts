import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { forceCheck } from '@sentre/react-lazyload'
import { tokenProvider } from '@sentre/senhub'

import { AppState } from 'model'
import { PoolsState } from 'model/pools.controller'

const KEY_SIZE = 3

export const useSearchedPools = (pools: PoolsState) => {
  const [poolsSearched, setPoolsSearched] = useState<PoolsState>({})
  const searchInput = useSelector(
    (state: AppState) => state.searchPools.searchInput,
  )

  const search = useCallback(async () => {
    const newPoolsSearch: PoolsState = {}
    const listTokenInfo = await tokenProvider.find(searchInput)
    const listTokenAddress = listTokenInfo.map((info) => info.address)

    const listPoolsAddress = Object.keys(pools).filter((poolAddress) => {
      if (!searchInput || !pools || searchInput.length < KEY_SIZE) return true
      const poolData = pools[poolAddress]
      const { mintLpt, mints } = poolData
      // Search poolAddress
      if (poolAddress.includes(searchInput)) return true
      // Search minLpt
      if (mintLpt.toBase58().includes(searchInput)) return true
      // Search Token
      for (const mint in mints) {
        if (listTokenAddress.includes(mints[mint].toBase58())) return true
        if (searchInput.includes(mints[mint].toBase58())) {
          return true
        }
      }
      return false
    })
    listPoolsAddress
      .sort()
      .map((poolAddress) => (newPoolsSearch[poolAddress] = pools[poolAddress]))
    setPoolsSearched(newPoolsSearch)
  }, [pools, searchInput])

  useEffect(() => {
    search().then(() => {
      // fix lazyload
      setTimeout(() => {
        forceCheck()
      }, 500)
    })
  }, [search])

  return poolsSearched
}
