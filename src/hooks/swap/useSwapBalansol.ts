import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  createMultiTokenAccountIfNeededTransactions,
  getAnchorProvider,
} from 'sentre-web3'
import { rpc } from '@sentre/senhub'

import { AppState } from 'model'
import { SwapPlatform, SwapProvider } from '../useSwap'
import { useOracles } from '../useOracles'
import { useBestRouteFromAsk } from './routeFromAsk/useBestRouteFromAsk'
import { useBestRouteFromBid } from './routeFromBid/useBestRouteFromBid'

export const useSwapBalansol = (): SwapProvider => {
  const { bidAmount, bidMint, askMint, slippageTolerance, isReverse } =
    useSelector((state: AppState) => state.swap)
  const { decimalizeMintAmount } = useOracles()
  const routesFromBid = useBestRouteFromBid()
  const routesFromAsk = useBestRouteFromAsk()
  const { loading, bestRoute } = isReverse ? routesFromAsk : routesFromBid

  const initTokenAccountTxs = useCallback(async () => {
    const { wallet } = window.sentre
    const walletAddress = await wallet.getAddress()
    const provider = getAnchorProvider(rpc, walletAddress, wallet)
    const transactions = await createMultiTokenAccountIfNeededTransactions(
      provider,
      {
        mints: bestRoute.route.map((route) => route.askMint),
      },
    )
    return transactions
  }, [bestRoute.route])

  const swap = useCallback(async () => {
    const { wallet } = window.sentre
    const walletAddress = await wallet.getAddress()
    const provider = getAnchorProvider(rpc, walletAddress, wallet)

    const bidAmountBN = await decimalizeMintAmount(bidAmount, bidMint)
    const limit = Number(bestRoute.askAmount) * (1 - slippageTolerance / 100)
    const limitBN = await decimalizeMintAmount(limit, askMint)
    const transactions = await initTokenAccountTxs()
    const { transaction } = await window.balansol.createRouteTransaction(
      bidAmountBN,
      bestRoute.route,
      limitBN,
    )
    transactions.push(transaction)
    const txIds = await provider.sendAll(
      transactions.map((tx) => {
        return { tx, signers: [] }
      }),
    )
    return { txId: txIds[txIds.length - 1] }
  }, [
    askMint,
    bidAmount,
    bidMint,
    decimalizeMintAmount,
    initTokenAccountTxs,
    bestRoute.askAmount,
    bestRoute.route,
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
