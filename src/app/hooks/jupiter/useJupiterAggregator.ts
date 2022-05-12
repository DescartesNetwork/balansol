import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { web3, BN } from '@project-serum/anchor'
import { useJupiter } from '@jup-ag/react-hook'
import { RouteInfo } from '@jup-ag/core'
import { Connection, PublicKey } from '@solana/web3.js'
import { useWallet } from '@senhub/providers'

import configs from 'app/configs'
import { AppState } from 'app/model'

import JupiterWalletWrapper from 'app/hooks/jupiter/jupiterWalletWrapper'
import { SwapPlatform, RouteSwapInfo, SwapProvider } from 'app/hooks/useSwap'
import { useOracles } from '../useOracles'

const {
  sol: { node },
} = configs
const connection = new Connection(node)
interface UseJupiterProps {
  amount: number
  inputMint: PublicKey | undefined
  outputMint: PublicKey | undefined
  slippage: number
  debounceTime?: number
}

const DEFAULT_JUPITER_PROPS = {
  amount: 0,
  inputMint: undefined,
  outputMint: undefined,
  slippage: 0,
  debounceTime: 250,
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
  const [jupiterProps, setJupiterProps] = useState<UseJupiterProps>({
    ...DEFAULT_JUPITER_PROPS,
  })
  const {
    swap: { bidMint, askMint, bidAmount, slippageTolerance, isReverse },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { decimalizeMintAmount, undecimalizeMintAmount } = useOracles()
  const { exchange, routes, loading } = useJupiter(jupiterProps)

  const composeJupiterProps = useCallback(async () => {
    if (!bidMint || !askMint || !Number(bidAmount) || isReverse)
      return setJupiterProps({ ...DEFAULT_JUPITER_PROPS })
    const bidAmountBN = await decimalizeMintAmount(bidAmount, bidMint)
    setJupiterProps({
      amount: bidAmountBN.toNumber(),
      inputMint: new web3.PublicKey(bidMint),
      outputMint: new web3.PublicKey(askMint),
      slippage: slippageTolerance,
      debounceTime: 250,
    })
  }, [
    askMint,
    bidAmount,
    bidMint,
    decimalizeMintAmount,
    isReverse,
    slippageTolerance,
  ])
  useEffect(() => {
    composeJupiterProps()
  }, [composeJupiterProps])

  const composeBestRoute = useCallback(async () => {
    if (!bidMint || !askMint || !Number(bidAmount) || isReverse || !routes)
      return setBestRouteInfo(DEFAULT_EMPTY_ROUTE)
    const bestJupiterRoute = routes[0]

    const route = bestJupiterRoute.marketInfos.map((market) => {
      return {
        bidAmount: new BN(market.inAmount),
        bidMint: market.inputMint.toBase58(),
        askAmount: new BN(market.outAmount),
        askMint: market.outputMint.toBase58(),
        pool: '',
        priceImpact: market.priceImpactPct,
      }
    })

    const inAmount = await undecimalizeMintAmount(
      new BN(bestJupiterRoute.inAmount),
      bidMint,
    )
    const outAmount = await undecimalizeMintAmount(
      new BN(bestJupiterRoute.outAmount),
      askMint,
    )

    return setBestRouteInfo({
      route,
      bidAmount: Number(inAmount),
      askAmount: Number(outAmount),
      priceImpact: bestJupiterRoute.priceImpactPct * 100,
    })
  }, [askMint, bidAmount, bidMint, isReverse, routes, undecimalizeMintAmount])
  useEffect(() => {
    composeBestRoute()
  }, [composeBestRoute])

  const swap = useCallback(async () => {
    const {
      sentre: { wallet },
    } = window
    if (!wallet) throw new Error('Wallet is not connected')
    if (!routes?.length) throw new Error('No available route')

    const wrappedWallet = new JupiterWalletWrapper(walletAddress, wallet)
    const result: any = await exchange({
      wallet: wrappedWallet,
      routeInfo: routes[0],
      onTransaction: async (txid: string) => {
        await connection.confirmTransaction(txid, 'confirmed')
        return await connection.getTransaction(txid, {
          commitment: 'confirmed',
        })
      },
    })
    if (result.error) throw new Error(result.error?.message || 'Unknown Error')
    const { txid, outputAddress } = result
    return { txId: txid, dstAddress: outputAddress }
  }, [exchange, routes, walletAddress])

  return useMemo(() => {
    return { ...bestRouteInfo, swap, platform: SwapPlatform.Jupiter, loading }
  }, [bestRouteInfo, loading, swap])
}
