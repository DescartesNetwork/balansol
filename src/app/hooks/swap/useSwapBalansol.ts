import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  createMultiTokenAccountIfNeededTransactions,
  getAnchorProvider,
} from 'sentre-web3'

import { AppState } from 'app/model'
import { SwapPlatform, SwapProvider } from '../useSwap'
import { useOracles } from '../useOracles'
import { useBestRouteFromAsk } from './routeFromAsk/useBestRouteFromAsk'
import { useBestRouteFromBid } from './routeFromBid/useBestRouteFromBid'
import { rpc } from 'shared/runtime'

export const useSwapBalansol = (): SwapProvider => {
  const { bidAmount, bidMint, askMint, slippageTolerance, isReverse } =
    useSelector((state: AppState) => state.swap)
  const { decimalizeMintAmount } = useOracles()
  const routesFromBid = useBestRouteFromBid()
  const routesFromAsk = useBestRouteFromAsk()
  const routeInfo = isReverse ? routesFromAsk : routesFromBid

  const initTokenAccountTxs = useCallback(async () => {
    const { wallet } = window.sentre
    const walletAddress = await wallet.getAddress()
    const provider = getAnchorProvider(rpc, walletAddress, wallet)
    const transactions = await createMultiTokenAccountIfNeededTransactions(
      provider,
      {
        mints: routeInfo.route.map((route) => route.askMint),
      },
    )
    return transactions
  }, [routeInfo.route])

  const swap = useCallback(async () => {
    const { wallet } = window.sentre
    const walletAddress = await wallet.getAddress()
    const provider = getAnchorProvider(rpc, walletAddress, wallet)

    const bidAmountBN = await decimalizeMintAmount(bidAmount, bidMint)
    const limit = Number(routeInfo.askAmount) * (1 - slippageTolerance / 100)
    const limitBN = await decimalizeMintAmount(limit, askMint)
    const transactions = await initTokenAccountTxs()
    const { transaction } = await window.balansol.createRouteTransaction(
      bidAmountBN,
      routeInfo.route,
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
    routeInfo.askAmount,
    routeInfo.route,
    slippageTolerance,
  ])

  return useMemo(() => {
    return {
      ...routeInfo,
      swap,
      loading: false,
      platform: SwapPlatform.Balansol,
    }
  }, [routeInfo, swap])
}
