import { connection, getAnchorWallet, useWalletAddress } from '@sentre/senhub'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDebounce } from 'react-use'
import axios from 'axios'
import { BN, AnchorProvider, web3 } from '@coral-xyz/anchor'

import { AppState } from 'model'

import { SwapPlatform, RouteSwapInfo, SwapProvider } from 'hooks/useSwap'
import { useOracles } from '../useOracles'

type JupRoute = {
  inAmount: string
  outAmount: string
  priceImpactPct: number
  marketInfos: {
    id: string
    inAmount: string
    inputMint: string
    outAmount: string
    outputMint: string
    priceImpactPct: number
  }[]
}

const DEFAULT_EMPTY_ROUTE = {
  route: [],
  bidAmount: 0,
  askAmount: 0,
  priceImpact: 0,
}

export const useJupiterAggregator = (): SwapProvider => {
  const [bestRouteInfo, setBestRouteInfo] =
    useState<RouteSwapInfo>(DEFAULT_EMPTY_ROUTE)
  const [rawJupRoute, setRawJupRoute] = useState<JupRoute>()
  const [loading, setLoading] = useState(false)
  const {
    bidMint,
    askMint,
    bidAmount,
    askAmount,
    slippageTolerance,
    isReverse,
  } = useSelector((state: AppState) => state.swap)
  const walletAddress = useWalletAddress()

  const { decimalizeMintAmount, undecimalizeMintAmount } = useOracles()

  const composeJupiterProps = useCallback(async () => {
    try {
      setLoading(true)
      if (!bidMint || !askMint || (!Number(askAmount) && !Number(bidAmount)))
        throw new Error('Invalid route input')
      let amount = '0'
      if (isReverse) {
        amount = (await decimalizeMintAmount(askAmount, askMint)).toString()
      } else {
        amount = (await decimalizeMintAmount(bidAmount, bidMint)).toString()
      }
      const {
        data: { data: jupRoutes },
      } = await axios.get<{ data: JupRoute[] }>(
        `https://quote-api.jup.ag/v4/quote?inputMint=${bidMint}&outputMint=${askMint}&amount=${amount}&slippageBps=${
          slippageTolerance * 100
        }&asLegacyTransaction=true&swapMode=${
          isReverse ? 'ExactOut' : 'ExactIn'
        }`,
      )
      const bestRoute = jupRoutes?.[0]
      setRawJupRoute(bestRoute)
    } catch (error) {
      setRawJupRoute(undefined)
    } finally {
      setLoading(false)
    }
  }, [
    askAmount,
    askMint,
    bidAmount,
    bidMint,
    decimalizeMintAmount,
    isReverse,
    slippageTolerance,
  ])
  useDebounce(() => composeJupiterProps(), 100, [composeJupiterProps])

  const syncRoute = useCallback(async () => {
    try {
      setLoading(true)
      if (!rawJupRoute) return setBestRouteInfo(DEFAULT_EMPTY_ROUTE)
      const inAmount = await undecimalizeMintAmount(
        new BN(rawJupRoute.inAmount.toString()),
        bidMint,
      )
      const outAmount = await undecimalizeMintAmount(
        new BN(rawJupRoute.outAmount.toString()),
        askMint,
      )
      return setBestRouteInfo({
        route: rawJupRoute.marketInfos.map((e) => ({
          bidAmount: new BN(e.inAmount),
          bidMint: e.inputMint,
          askAmount: new BN(e.outAmount),
          askMint: e.outputMint,
          pool: e.id,
          priceImpact: e.priceImpactPct,
        })),
        bidAmount: Number(inAmount),
        askAmount: Number(outAmount),
        priceImpact: rawJupRoute.priceImpactPct,
      })
    } catch (error) {
      setBestRouteInfo(DEFAULT_EMPTY_ROUTE)
    } finally {
      setLoading(false)
    }
  }, [askMint, bidMint, rawJupRoute, undecimalizeMintAmount])
  useEffect(() => {
    syncRoute()
  }, [syncRoute])

  const swap = useCallback(async () => {
    if (!rawJupRoute) throw new Error('Invalid route input')
    const {
      data: { swapTransaction },
    } = await axios.post('https://quote-api.jup.ag/v4/swap', {
      // route from /quote api
      route: rawJupRoute,
      // user public key to be used for the swap
      userPublicKey: walletAddress,
      // auto wrap and unwrap SOL. default is true
      wrapUnwrapSOL: true,
      asLegacyTransaction: true,
    })
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64')
    const tx = web3.Transaction.from(swapTransactionBuf)
    const wallet = getAnchorWallet()!
    // @ts-ignore
    const provider = new AnchorProvider(connection, wallet, {
      maxRetries: 2,
    })
    const txid = await provider.sendAndConfirm(tx)
    return {
      txId: txid,
      dstAddress: rawJupRoute.marketInfos.at(-1)?.outputMint,
    }
  }, [rawJupRoute, walletAddress])

  return useMemo(() => {
    return {
      ...bestRouteInfo,
      swap,
      platform: SwapPlatform.Jupiter,
      loading: !Number(bidAmount) ? false : loading,
    }
  }, [bestRouteInfo, bidAmount, loading, swap])
}
