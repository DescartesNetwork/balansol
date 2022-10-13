import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { initTxCreateMultiTokenAccount } from '@sen-use/web3'
import { getAnchorProvider } from '@sentre/senhub'

import { AppState } from 'model'
import { SwapPlatform, SwapProvider } from '../useSwap'
import { useOracles } from '../useOracles'
import { useBestRouteFromAsk } from './routeFromAsk/useBestRouteFromAsk'
import { useBestRouteFromBid } from './routeFromBid/useBestRouteFromBid'
import { useWrapAndUnwrapSolIfNeed } from 'hooks/useWrapAndUnwrapSolIfNeed'

export const useSwapBalansol = (): SwapProvider => {
  const { bidAmount, bidMint, askMint, slippageTolerance, isReverse } =
    useSelector((state: AppState) => state.swap)
  const { decimalizeMintAmount } = useOracles()
  const routesFromBid = useBestRouteFromBid()
  const routesFromAsk = useBestRouteFromAsk()
  const { createWrapSolTxIfNeed, createUnWrapSolTxIfNeed } =
    useWrapAndUnwrapSolIfNeed()

  const { loading, bestRoute } = isReverse ? routesFromAsk : routesFromBid

  const initTokenAccountTxs = useCallback(async () => {
    const provider = getAnchorProvider()!
    const transactions = await initTxCreateMultiTokenAccount(provider, {
      mints: bestRoute.route.map((route) => route.askMint),
    })
    return transactions
  }, [bestRoute.route])

  const swap = useCallback(async () => {
    const provider = getAnchorProvider()!
    const bidAmountBN = await decimalizeMintAmount(bidAmount, bidMint)
    const limit = Number(bestRoute.askAmount) * (1 - slippageTolerance / 100)
    const limitBN = await decimalizeMintAmount(limit, askMint)
    const transactions = await initTokenAccountTxs()
    const wrapSolTx = await createWrapSolTxIfNeed(bidMint, bidAmount)
    if (wrapSolTx) transactions.push(wrapSolTx)

    const { transaction } = await window.balansol.createRouteTransaction(
      bidAmountBN,
      bestRoute.route,
      limitBN,
    )
    transactions.push(transaction)

    const unwrapSolTx = await createUnWrapSolTxIfNeed(askMint)
    if (unwrapSolTx) transactions.push(unwrapSolTx)

    const txIds = await provider.sendAll(
      transactions.map((tx) => {
        return { tx, signers: [] }
      }),
    )
    return { txId: txIds[txIds.length - 1] }
  }, [
    askMint,
    bestRoute.askAmount,
    bestRoute.route,
    bidAmount,
    bidMint,
    createUnWrapSolTxIfNeed,
    createWrapSolTxIfNeed,
    decimalizeMintAmount,
    initTokenAccountTxs,
    slippageTolerance,
  ])

  return useMemo(() => {
    return {
      ...bestRoute,
      swap,
      loading: loading,
      platform: SwapPlatform.Balansol,
    }
  }, [bestRoute, swap, loading])
}
