import { BN } from '@project-serum/anchor'
import { PoolData } from '@senswap/balancer'
import { calOutGivenInSwap, calWeightToken } from 'app/helper/oracles'
import { AppState } from 'app/model'
import { PoolsState } from 'app/model/pools.controller'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'

export const useRouteSwap = () => {
  const {
    swap: { bidAmount, askMint, bidMint },
    pools,
  } = useSelector((state: AppState) => state)
  const [satisfiedPool, setSatisfiedPool] = useState<PoolsState>({})
  const [askAmount, setAskAmount] = useState('')
  const [bestPool, setBestPool] = useState('')

  const { balance: askBalance } = useAccountBalanceByMintAddress(askMint)
  const { balance: bidBalance } = useAccountBalanceByMintAddress(bidMint)

  useEffect(() => {
    const filteredPool = Object.entries(pools).filter(([key, value]) => {
      const mintAddresses = value.mints.map((value) => value.toBase58())
      return mintAddresses.includes(askMint) && mintAddresses.includes(bidMint)
    })

    const objFilteredPool = Object.fromEntries(filteredPool)

    setSatisfiedPool(objFilteredPool)
  }, [askMint, bidMint, pools])

  const getCommensuratedAskToken = useCallback(() => {
    const poolAddresses = Object.keys(satisfiedPool)
    if (poolAddresses.length === 0) setAskAmount('0')

    for (let i = 0; i < poolAddresses.length; i++) {
      const tokenInIdx = satisfiedPool[poolAddresses[i]].mints.findIndex(
        (mint) => mint.toBase58() === bidMint,
      )

      const tokenOutIdx = satisfiedPool[poolAddresses[i]].mints.findIndex(
        (mint) => mint.toBase58() === askMint,
      )

      const weightIn = calWeightToken(
        satisfiedPool[poolAddresses[i]].weights,
        satisfiedPool[poolAddresses[i]].weights[tokenInIdx],
      )
      const weightOut = calWeightToken(
        satisfiedPool[poolAddresses[i]].weights,
        satisfiedPool[poolAddresses[i]].weights[tokenOutIdx],
      )
      const tokenOutAmout = calOutGivenInSwap(
        new BN(bidAmount),
        new BN(askBalance),
        new BN(bidBalance),
        weightIn,
        weightOut,
        satisfiedPool[poolAddresses[i]].fee,
      )

      setBestPool(poolAddresses[i])
      setAskAmount(String(tokenOutAmout))
    }

    setAskAmount('0')
  }, [askBalance, askMint, bidAmount, bidBalance, bidMint, satisfiedPool])

  useEffect(() => {
    getCommensuratedAskToken()
  }, [getCommensuratedAskToken])

  return { askAmount, bestPool }
}
