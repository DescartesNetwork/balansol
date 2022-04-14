import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAccount, useWallet } from '@senhub/providers'
import { utils, web3 } from '@project-serum/anchor'

import { AppState } from 'app/model'
import { PoolsState } from 'app/model/pools.controller'
import { FilterPools } from 'app/constant'

export const useFilterPools = () => {
  const [poolsFilter, setPoolsFilter] = useState<PoolsState>({})
  const {
    pools,
    searchPools: { filterPool },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { accounts } = useAccount()

  const checkIsYourPool = useCallback(
    (address: string) => pools[address].authority.toBase58() === walletAddress,
    [pools, walletAddress],
  )

  const checkIsDepositedPool = useCallback(
    async (poolAddress: string) => {
      const tokenAccountLpt = await utils.token.associatedAddress({
        mint: pools[poolAddress].mintLpt,
        owner: new web3.PublicKey(walletAddress),
      })
      const balance = accounts[tokenAccountLpt.toBase58()]?.amount
      if (!balance) return false
      return true
    },
    [accounts, pools, walletAddress],
  )

  const filterListPools = useCallback(
    async (pools: PoolsState) => {
      let newPools: PoolsState = {}
      for (const poolAddress in pools) {
        let isValid = false
        switch (filterPool) {
          case FilterPools.YourPools:
            isValid = checkIsYourPool(poolAddress)
            break
          case FilterPools.DepositedPools:
            isValid = await checkIsDepositedPool(poolAddress)
            break
          default:
            isValid = true
            break
        }
        if (isValid) newPools[poolAddress] = pools[poolAddress]
      }
      setPoolsFilter(newPools)
    },
    [checkIsDepositedPool, checkIsYourPool, filterPool],
  )

  useEffect(() => {
    filterListPools(pools)
  }, [filterListPools, pools])

  return { poolsFilter, filterListPools, checkIsYourPool }
}
